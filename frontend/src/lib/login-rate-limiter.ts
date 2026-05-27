import { Redis } from '@upstash/redis';
import { getTrustedClientIp } from '@/lib/rate-limiter';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redisClient = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;
const fallbackStore = new Map<string, { count: number; expiresAt: number }>();

const MAX_EMAIL_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 20;
const WINDOW_SECONDS = 60 * 60; // 60 minutes
const LOCKOUT_SECONDS = 60 * 60; // 60 minutes

function normalizeKey(key: string) {
  return key.trim().toLowerCase();
}

async function getTTL(key: string): Promise<number> {
  if (!redisClient) {
    const entry = fallbackStore.get(key);
    return entry && entry.expiresAt > Date.now() ? Math.ceil((entry.expiresAt - Date.now()) / 1000) : -2;
  }

  const ttl = await redisClient.ttl(key);
  return typeof ttl === 'number' ? ttl : Number(ttl);
}

async function incrementKey(key: string, expireSeconds: number): Promise<number> {
  if (!redisClient) {
    const now = Date.now();
    const entry = fallbackStore.get(key);
    if (!entry || entry.expiresAt <= now) {
      fallbackStore.set(key, { count: 1, expiresAt: now + expireSeconds * 1000 });
      return 1;
    }
    entry.count += 1;
    return entry.count;
  }

  const count = Number(await redisClient.incr(key));
  if (count === 1) {
    await redisClient.expire(key, expireSeconds);
  }
  return count;
}

async function setLockoutKey(key: string, seconds: number) {
  if (!redisClient) {
    fallbackStore.set(key, { count: 1, expiresAt: Date.now() + seconds * 1000 });
    return;
  }

  await redisClient.set(key, '1', { ex: seconds });
}

async function deleteKey(key: string) {
  if (!redisClient) {
    fallbackStore.delete(key);
    return;
  }

  await redisClient.del(key);
}

function getEmailKey(email: string) {
  return `login:failed:email:${normalizeKey(email)}`;
}

function getIpKey(ip: string) {
  return `login:failed:ip:${normalizeKey(ip)}`;
}

function getEmailLockoutKey(email: string) {
  return `login:lockout:email:${normalizeKey(email)}`;
}

function getIpLockoutKey(ip: string) {
  return `login:lockout:ip:${normalizeKey(ip)}`;
}

async function isLocked(key: string): Promise<{ locked: boolean; retryAfter: number }> {
  const ttl = await getTTL(key);
  if (ttl > 0) {
    return { locked: true, retryAfter: ttl };
  }
  return { locked: false, retryAfter: 0 };
}

export async function checkLoginRateLimit(request: Request, email: string) {
  const ip = getTrustedClientIp(request);
  const emailLock = await isLocked(getEmailLockoutKey(email));
  if (emailLock.locked) {
    return { allowed: false, retryAfter: emailLock.retryAfter };
  }

  const ipLock = await isLocked(getIpLockoutKey(ip));
  if (ipLock.locked) {
    return { allowed: false, retryAfter: ipLock.retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

export async function recordFailedLoginAttempt(request: Request, email: string) {
  const ip = getTrustedClientIp(request);
  const emailKey = getEmailKey(email);
  const ipKey = getIpKey(ip);

  const emailAttempts = await incrementKey(emailKey, WINDOW_SECONDS);
  const ipAttempts = await incrementKey(ipKey, WINDOW_SECONDS);

  if (emailAttempts >= MAX_EMAIL_ATTEMPTS) {
    await setLockoutKey(getEmailLockoutKey(email), LOCKOUT_SECONDS);
  }

  if (ipAttempts >= MAX_IP_ATTEMPTS) {
    await setLockoutKey(getIpLockoutKey(ip), LOCKOUT_SECONDS);
  }

  const emailLock = await isLocked(getEmailLockoutKey(email));
  const ipLock = await isLocked(getIpLockoutKey(ip));

  return {
    emailAttempts,
    ipAttempts,
    blocked: emailLock.locked || ipLock.locked,
    retryAfter: Math.max(emailLock.retryAfter, ipLock.retryAfter),
  };
}

export async function clearLoginFailures(request: Request, email: string) {
  const ip = getTrustedClientIp(request);
  await Promise.all([
    deleteKey(getEmailKey(email)),
    deleteKey(getIpKey(ip)),
    deleteKey(getEmailLockoutKey(email)),
    deleteKey(getIpLockoutKey(ip)),
  ]);
}
