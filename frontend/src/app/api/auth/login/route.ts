import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-auth';
import { isAdmin } from '@/lib/auth';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginFailures,
} from '@/lib/login-rate-limiter';

interface LoginRequest {
  email: string;
  password: string;
}

function validatePayload(data: unknown): data is LoginRequest {
  if (typeof data !== 'object' || data === null) return false;
  const payload = data as Record<string, unknown>;
  return (
    typeof payload.email === 'string' && payload.email.trim() !== '' &&
    typeof payload.password === 'string' && payload.password.trim() !== ''
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!validatePayload(body)) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const email = body.email.trim();
  const rateLimitStatus = await checkLoginRateLimit(request, email);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { error: 'Too many failed login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: body.password.trim(),
  });

  if (error || !data?.session) {
    await recordFailedLoginAttempt(request, email);
    const message = error?.message || 'Authentication failed.';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const userForCheck = data.user
    ? {
        id: data.user.id ?? undefined,
        email: data.user.email ?? undefined,
      }
    : null;
  const adminCheck = await isAdmin(userForCheck);
  if (!adminCheck) {
    await recordFailedLoginAttempt(request, email);
    return NextResponse.json({ error: 'Unauthorized admin user.' }, { status: 403 });
  }

  await clearLoginFailures(request, email);
  return NextResponse.json({ success: true });
}
