import type { ContactFormPayload } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  data: Partial<ContactFormPayload>
): { ok: true; data: ContactFormPayload } | { ok: false; error: string } {
  const firstName = data.firstName?.trim() ?? "";
  const lastName = data.lastName?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const service = data.service?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (data.website?.trim()) {
    return { ok: false, error: "Invalid submission." };
  }

  if (!firstName || firstName.length < 2) {
    return { ok: false, error: "Please enter your first name." };
  }
  if (!lastName || lastName.length < 2) {
    return { ok: false, error: "Please enter your last name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!service) {
    return { ok: false, error: "Please select a service." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Please describe your project (at least 10 characters)." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, service, message },
  };
}
