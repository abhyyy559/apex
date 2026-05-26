# Contact Form Rate Limiting Implementation

This document describes the production-grade rate limiting implementation for the `/api/contact` endpoint to prevent spam and abuse.

## Overview

The contact form now includes multiple layers of protection:

1. **IP-based Rate Limiting**: 5 requests per hour per IP address
2. **Enhanced Honeypot Validation**: Multiple hidden fields to trap bots
3. **Suspicious Pattern Detection**: Blocks common spam patterns
4. **CAPTCHA Support**: Future-ready hooks for reCAPTCHA, hCaptcha, or Cloudflare Turnstile

## Components

### 1. Rate Limiter (`frontend/src/lib/rate-limiter.ts`)

A Supabase-based rate limiter that tracks request counts per IP address.

**Features:**
- IP address detection from various headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
- Configurable rate limits (default: 5 requests per hour)
- Automatic cleanup of old records
- Proper HTTP 429 responses with retry-after headers
- Fails open on database errors to avoid blocking legitimate users

### 2. CAPTCHA Utility (`frontend/src/lib/captcha.ts`)

Future-ready CAPTCHA validation supporting multiple providers.

**Supported Providers:**
- Google reCAPTCHA (v2 and v3)
- hCaptcha
- Cloudflare Turnstile
- Custom implementations

### 3. Enhanced Contact Route (`frontend/src/app/api/contact/route.ts`)

Updated contact endpoint with integrated security layers.

## Setup Instructions

### Step 1: Create Supabase Rate Limits Table

Run the SQL script in your Supabase SQL editor:

```bash
# Execute the SQL migration
cat docs/supabase/rate_limits_table.sql
```

Or manually run this SQL in Supabase:

```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
```

### Step 2: Configure Rate Limiting (Optional)

The rate limiter uses sensible defaults, but you can customize:

**Default Configuration:**
- Max requests: 5 per hour
- Window: 1 hour
- Storage: Supabase

**To customize**, edit the rate limit check in `route.ts`:

```typescript
const rateLimitResult = await rateLimitMiddleware(request, {
  maxRequests: 10,  // Increase to 10 requests
  windowMs: 30 * 60 * 1000,  // 30 minutes
});
```

### Step 3: Enable CAPTCHA (Optional)

CAPTCHA is disabled by default. To enable:

1. **Add environment variables:**

```bash
# Enable CAPTCHA
CAPTCHA_ENABLED=true

# Choose provider: recaptcha, hcaptcha, or turnstile
CAPTCHA_PROVIDER=recaptcha

# Secret key from your CAPTCHA provider
CAPTCHA_SECRET_KEY=your_secret_key_here

# Optional: Minimum score for reCAPTCHA v3 (0.0 - 1.0)
CAPTCHA_MIN_SCORE=0.5
```

2. **Add CAPTCHA to your frontend form:**

```typescript
// Example with reCAPTCHA v2
import { useRef } from 'react';

function ContactForm() {
  const captchaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (formData) => {
    // Get CAPTCHA token
    const token = grecaptcha.getResponse();
    
    // Include token in form submission
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        captchaToken: token,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <div ref={captchaRef} className="g-recaptcha" 
           data-sitekey="your_site_key"></div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Step 4: Add Honeypot Fields to Frontend (Recommended)

Add hidden honeypot fields to your contact form to trap bots:

```tsx
<input
  type="text"
  name="website"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>
<input
  type="text"
  name="phone2"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>
```

These fields are invisible to humans but bots often fill them, triggering rejection.

## Security Features

### Rate Limiting

- **Default Limit**: 5 requests per hour per IP
- **Response**: HTTP 429 Too Many Requests
- **Headers**: Includes retry-after time and rate limit info
- **Storage**: Supabase table (serverless-compatible)
- **Cleanup**: Automatic removal of records older than 2 hours

### Honeypot Fields

- **Fields Checked**: `website`, `phone2`, `address`, `fax`
- **Logic**: If any hidden field contains data, reject as spam
- **Implementation**: Invisible form fields that bots fill but humans don't

### Pattern Detection

Blocks messages containing:
- HTTP links (`http`, `www`, `.com`)
- HTML tags (`<a`, `<script`)
- Common spam patterns

### Length Limits

- **Maximum message length**: 5,000 characters
- Prevents DoS attacks via oversized payloads

## API Response Codes

| Status | Meaning |
|--------|---------|
| 201 | Success |
| 400 | Invalid form data (honeypot triggered, patterns detected, etc.) |
| 429 | Rate limit exceeded |
| 500 | Server error (Supabase issue, email failure, etc.) |

## Error Responses

### Rate Limit Exceeded (429)

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

Headers:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: Tue, 26 May 2026 18:00:00 GMT
Retry-After: 3600
```

### Invalid Form (400)

```json
{
  "error": "Invalid form submission. Please fill in all required fields."
}
```

### CAPTCHA Validation Failed (400)

```json
{
  "error": "CAPTCHA validation failed"
}
```

## Monitoring and Maintenance

### Check Rate Limit Status

You can monitor rate limit usage in Supabase:

```sql
-- Check current rate limits
SELECT ip_address, request_count, window_start, last_request
FROM rate_limits
ORDER BY last_request DESC;

-- Check IPs hitting limits
SELECT ip_address, request_count, window_start
FROM rate_limits
WHERE request_count >= 5
ORDER BY last_request DESC;
```

### Manual Cleanup

If automatic cleanup isn't working:

```sql
-- Clean up records older than 2 hours
DELETE FROM rate_limits
WHERE window_start < NOW() - INTERVAL '2 hours';
```

### Adjust Rate Limits

If legitimate users are being blocked:

1. Increase `maxRequests` in the route handler
2. Decrease `windowMs` for a shorter window
3. Consider whitelisting known IPs

## Deployment Considerations

### Vercel/Edge Compatibility

✅ **Serverless Compatible**: Uses Supabase instead of in-memory cache
✅ **Edge Compatible**: No node-specific dependencies
✅ **Cold Start Safe**: Lazy initialization of Supabase client

### Environment Variables

Required:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional (for CAPTCHA):
```
CAPTCHA_ENABLED=true
CAPTCHA_PROVIDER=recaptcha
CAPTCHA_SECRET_KEY=your_secret_key
CAPTCHA_MIN_SCORE=0.5
```

## Testing

### Test Rate Limiting

```bash
# Make 6 rapid requests (should fail on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"web","message":"Test message"}'
  echo "Request $i completed"
done
```

### Test Honeypot

```bash
# Request with honeypot field filled (should fail)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"web","message":"Test message","website":"spam"}'
```

### Test CAPTCHA

```bash
# Request without CAPTCHA token (when enabled)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"web","message":"Test message"}'
```

## Troubleshooting

### Rate Limiting Not Working

1. **Check Supabase table exists**: Ensure `rate_limits` table was created
2. **Check Supabase credentials**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. **Check IP detection**: Ensure headers are being passed correctly

### Legitimate Users Blocked

1. **Increase rate limits**: Adjust `maxRequests` and `windowMs`
2. **Check for shared IPs**: Office/VPN users might share IPs
3. **Consider authentication**: Add user authentication for higher limits

### CAPTCHA Issues

1. **Verify secret key**: Ensure `CAPTCHA_SECRET_KEY` is correct
2. **Check provider**: Ensure `CAPTCHA_PROVIDER` matches your setup
3. **Test token validation**: Verify tokens are being generated correctly

## Files Modified

- `frontend/src/app/api/contact/route.ts` - Enhanced with rate limiting and CAPTCHA
- `frontend/src/lib/rate-limiter.ts` - New rate limiting utility
- `frontend/src/lib/captcha.ts` - New CAPTCHA validation utility
- `docs/supabase/rate_limits_table.sql` - Supabase table schema

## Future Enhancements

- [ ] Add user authentication for higher rate limits
- [ ] Implement IP whitelisting for trusted users
- [ ] Add analytics dashboard for spam detection
- [ ] Implement machine learning for spam detection
- [ ] Add geographic rate limiting
- [ ] Implement time-based rate limiting (stricter during peak spam hours)
