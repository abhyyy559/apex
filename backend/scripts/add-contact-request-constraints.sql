-- Migration: Add length constraints to contact_requests payload columns.
-- Execute this script in the Supabase SQL Editor or add it to your deployment migration set.

ALTER TABLE public.contact_requests
  ADD CONSTRAINT contact_requests_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT contact_requests_email_length CHECK (char_length(email) <= 254),
  ADD CONSTRAINT contact_requests_phone_length CHECK (phone IS NULL OR char_length(phone) <= 30),
  ADD CONSTRAINT contact_requests_company_length CHECK (company IS NULL OR char_length(company) <= 100),
  ADD CONSTRAINT contact_requests_message_length CHECK (char_length(message) <= 5000);
