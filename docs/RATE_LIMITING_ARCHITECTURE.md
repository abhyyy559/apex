---
title: Rate Limiting Architecture & Configuration
date: 2026-05-28
status: PRODUCTION_READY
---

# Rate Limiting Implementation Guide

## Overview

This project implements **layered rate limiting** across multiple touch points:

1. **Login Attempts** - Redis-backed rate limiter with fallback to in-memory store
2. **Contact Form Submissions** - Database-backed rate limiter with Supabase RLS
3. **API Rate Limits** - Trusted IP extraction with configurable time windows

---

## Architecture

### Layer 1: Login Rate Limiting (frontend/src/lib/login-rate-limiter.ts)

**Purpose**: Protect authentication endpoints from brute force attacks

**Thresholds**:
- **Email-based**: 5 failed attempts per 60 minutes
- **IP-based**: 20 failed attempts per 60 minutes
- **Lockout period**: 60 minutes after threshold exceeded

**Storage Backend**:
- **Primary**: Upstash Redis (production - scalable, distributed)
- **Fallback**: In-memory Map (development/when Redis unavailable)

**Configuration**:
```typescript
const MAX_EMAIL_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 20;
const WINDOW_SECONDS = 60 * 60; // 60 minutes
const LOCKOUT_SECONDS = 60 * 60; // 60 minutes
```

**Environment Variables** (required for production):
```bash
UPSTASH_REDIS_REST_URL=https://[region].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-auth-token]
```

**Usage**:
```typescript
import { checkLoginRateLimit, recordFailedLoginAttempt } from '@/lib/login-rate-limiter';

// In login route
const rateLimit = await checkLoginRateLimit(request, email);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: `Too many attempts. Try again in ${rateLimit.retryAfter} seconds.` },
    { status: 429 }
  );
}

// After failed login
await recordFailedLoginAttempt(request, email);
```

### Layer 2: Contact Form Rate Limiting (frontend/src/lib/rate-limiter.ts)

**Purpose**: Prevent spam and DoS attacks on public contact form

**Thresholds**:
- **Default**: 5 requests per hour per IP address
- **Configurable**: Via function parameters

**Storage Backend**:
- **Primary**: Supabase `rate_limits` table
- **Cleanup**: Automatic (10% chance on each check) removes records older than 2 hours

**Database Schema**:
```sql
CREATE TABLE rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_ip_window ON rate_limits(ip_address, window_start);
```

**Trusted IP Extraction**:
```typescript
// Priority order for IP detection:
// 1. Cloudflare: cf-connecting-ip (most reliable for Vercel + CF)
// 2. Vercel: x-vercel-forwarded-for
// 3. Standard: x-real-ip
// 4. Fallback: x-forwarded-for (first in list)
export function getTrustedClientIp(request: Request): string
```

**Usage**:
```typescript
import { rateLimitMiddleware } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  const rateLimitResult = await rateLimitMiddleware(request, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!rateLimitResult.allowed) {
    return rateLimitResult.response; // 429 Too Many Requests
  }

  // Process request...
}
```

**Response Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: <ISO timestamp>
```

---

## Security Best Practices

### 1. IP Trust Configuration

✅ **DO**:
- Trust `cf-connecting-ip` from Cloudflare
- Trust `x-vercel-forwarded-for` from Vercel
- Verify reverse proxy headers in production

❌ **DON'T**:
- Trust user-provided IP headers directly
- Skip IP validation in development
- Store PII in rate limit keys

### 2. Lockout Strategy

✅ **DO**:
- Implement exponential backoff for repeated failures
- Use time-based lockout (not permanent)
- Log rate limit violations for monitoring

❌ **DON'T**:
- Lock out users permanently
- Block entire /24 networks
- Ignore legitimate traffic patterns

### 3. Database Performance

✅ **DO**:
- Create indexes on (ip_address, window_start)
- Implement automatic cleanup of old records
- Use cursor-based pagination for dashboard

❌ **DON'T**:
- Allow unbounded record growth
- Run cleanup synchronously on every request
- Fetch all records without limits

### 4. Monitoring & Alerts

✅ **DO**:
- Log rate limit events to tracking service
- Alert on unusual spike patterns
- Monitor Redis/Upstash availability

❌ **DON'T**:
- Silently fail when rate limiter unavailable
- Ignore backend errors
- Store sensitive data in logs

---

## Configuration for Different Environments

### Development (Local)

```env
# Rate limiting uses in-memory store
# No external dependencies required
UPSTASH_REDIS_REST_URL=  # Leave empty to use fallback
UPSTASH_REDIS_REST_TOKEN= # Leave empty to use fallback
```

**Behavior**: Falls back to in-memory Map, resets on server restart

### Staging (Edge Functions)

```env
# Use Upstash Redis for distributed caching
UPSTASH_REDIS_REST_URL=https://[region].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]

# Supabase for contact form rate limiting
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[key]
```

### Production (Vercel + Supabase + Upstash)

```env
# All three services required
UPSTASH_REDIS_REST_URL=https://[region].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[key]

# Optional: High-performance Vercel KV as alternative
VERCEL_KV_REST_API_URL=https://[region].kv.vercel.app
VERCEL_KV_REST_API_TOKEN=[token]
```

---

## Migration: From DB-Only to Redis-Backed

If you want to migrate from Supabase-only rate limiting to Upstash Redis:

### Step 1: Sign up for Upstash
- Go to https://upstash.com
- Create a database (EU or US region)
- Copy REST API credentials

### Step 2: Update Environment Variables
```bash
# Add to .env.local
UPSTASH_REDIS_REST_URL=https://[region].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]
```

### Step 3: Redeploy
The application automatically detects Upstash credentials and uses Redis:
- Login rate limiting immediately uses Redis
- Contact form rate limiting still uses Supabase table but Redis is now available for future optimization

### Step 4: Monitor
```bash
# Check Redis keys
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  https://[region].upstash.io/keys

# View stats
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
  https://[region].upstash.io/info
```

---

## Testing Rate Limits

### Test Login Rate Limiting

```bash
# Simulate 6 failed login attempts
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo "Attempt $i"
  sleep 1
done

# 6th attempt should return 429 (locked out)
```

### Test Contact Form Rate Limiting

```bash
# Simulate 6 form submissions from same IP
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "firstName":"John",
      "lastName":"Doe",
      "email":"john@example.com",
      "message":"Test message"
    }'
  echo "Request $i"
  sleep 1
done

# 6th request should return 429 (rate limited)
```

---

## Troubleshooting

### Redis Connection Issues

**Symptom**: `Error: connect ECONNREFUSED`

**Solutions**:
1. Verify Upstash credentials in `.env.local`
2. Check firewall/VPN isn't blocking Upstash region
3. Test connectivity: `curl -I https://[region].upstash.io`

### Database Rate Limiting Slow

**Symptom**: Contact form requests have 300ms+ latency

**Solutions**:
1. Ensure index exists: `CREATE INDEX idx_rate_limits_ip_window ON rate_limits(ip_address, window_start);`
2. Run cleanup: `DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '2 hours';`
3. Consider migrating to Upstash Redis for contact form

### False Positives (Legitimate Users Blocked)

**Symptom**: Shared IPs (office, mobile hotspot) getting rate limited

**Solutions**:
1. Increase window `maxRequests` value
2. Increase `windowMs` duration
3. Whitelist specific IPs if needed: Add to `getTrustedClientIp()` function
4. Add CAPTCHA to contact form to supplement rate limiting

---

## Monitoring Checklist

- [ ] Redis connectivity is stable
- [ ] Rate limit cleanup runs successfully
- [ ] No legitimate users being blocked
- [ ] Failed login attempts logged
- [ ] Performance metrics within SLA
- [ ] Alerts configured for anomalies
- [ ] Database indexes exist
- [ ] Upstash quota not exceeded

---

## References

- [Upstash Documentation](https://upstash.com/docs)
- [Supabase Rate Limiting](https://supabase.com/docs)
- [OWASP Rate Limiting Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Vercel Rate Limiting Guide](https://vercel.com/docs/edge-functions/api#available-apis)
