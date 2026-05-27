import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUSPICIOUS_PATTERNS = [/http/i, /www\./i, /\.com/i, /href/i, /<a /i, /<script/i];

export const contactFormSchema = z
  .object({
    firstName: z.string().trim().min(2).max(100),
    lastName: z.string().trim().min(2).max(100),
    email: z.string().trim().max(254).regex(EMAIL_RE, "Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .or(z.literal("")),
    company: z.string().trim().max(100).optional().or(z.literal("")),
    service: z.string().trim().min(1).max(100),
    message: z.string().trim().min(10).max(5000),
    website: z.string().trim().max(300).optional().or(z.literal("")),
    captchaToken: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.website && data.website.trim() !== "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid submission.",
      });
    }

    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(data.message)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Message contains unsupported content.",
        });
        break;
      }
    }
  });

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

export function validateContactForm(
  data: unknown
): { ok: true; data: ContactFormPayload } | { ok: false; error: string } {
  const result = contactFormSchema.safeParse(data);
  if (!result.success) {
    return { ok: false, error: result.error.errors[0]?.message || "Invalid form submission." };
  }
  return { ok: true, data: result.data };
}
