import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendContactNotificationEmails } from "@/lib/resend";
import { rateLimitMiddleware } from "@/lib/rate-limiter";
import { captchaMiddleware, extractCaptchaToken } from "@/lib/captcha";
import { contactFormSchema } from "@/lib/validation/contact";
import type { ContactFormPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const rateLimitResult = await rateLimitMiddleware(request, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response;
    }
  } catch (rateLimitError) {
    console.error("Rate limiting error, allowing request to proceed:", rateLimitError);
    // Fail open on rate limiting errors to prevent blocking legitimate requests
  }

  const body = await request.json();

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Invalid form submission." },
      { status: 400 }
    );
  }

  const payload = parsed.data as ContactFormPayload;

  const captchaEnabled = process.env.CAPTCHA_ENABLED === "true";
  if (captchaEnabled) {
    const captchaToken = extractCaptchaToken(body, "captchaToken");
    const captchaConfig = {
      enabled: true,
      provider: (process.env.CAPTCHA_PROVIDER as "recaptcha" | "hcaptcha" | "turnstile") || "recaptcha",
      secretKey: process.env.CAPTCHA_SECRET_KEY,
      minScore: process.env.CAPTCHA_MIN_SCORE ? parseFloat(process.env.CAPTCHA_MIN_SCORE) : undefined,
    };

    const captchaResult = await captchaMiddleware(captchaToken, captchaConfig);
    if (!captchaResult.valid && captchaResult.response) {
      return captchaResult.response;
    }
  }

  const tableName = process.env.SUPABASE_CONTACT_TABLE || "contact_requests";

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin.from(tableName).insert([
    {
      name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      message: payload.message.trim(),
    },
  ]);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save contact request." },
      { status: 500 }
    );
  }

  try {
    await sendContactNotificationEmails(payload);
  } catch (sendError: unknown) {
    const message = sendError instanceof Error ? sendError.message : String(sendError);
    console.error('Contact notification email failed:', sendError);
    return NextResponse.json(
      { error: `Contact request saved, but email delivery failed: ${message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
