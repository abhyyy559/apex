# Rate Limiting Quick Reference

## What Was Implemented

✅ **IP-based rate limiting** (5 requests/hour)  
✅ **Enhanced honeypot validation** (multiple hidden fields)  
✅ **Suspicious pattern detection** (links, HTML tags)  
✅ **CAPTCHA support hooks** (reCAPTCHA, hCaptcha, Turnstile)  
✅ **Proper error responses** (HTTP 429 with retry headers)  
✅ **Supabase storage** (serverless-compatible)  

## Immediate Actions Required

### 1. Run SQL Migration

Execute in Supabase SQL Editor:

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

### 2. Update Frontend Form (Recommended)

Add hidden honeypot fields:

```tsx
<input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
<input type="text" name="phone2" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
```

### 3. Optional: Enable CAPTCHA

Add environment variables:

```bash
CAPTCHA_ENABLED=true
CAPTCHA_PROVIDER=recaptcha
CAPTCHA_SECRET_KEY=your_secret_key
CAPTCHA_MIN_SCORE=0.5
```

## Configuration

### Rate Limit Settings (in `route.ts`)

```typescript
const rateLimitResult = await rateLimitMiddleware(request, {
  maxRequests: 5,                    // Default: 5 requests
  windowMs: 60 * 60 * 1000,         // Default: 1 hour
});
```

### Security Features

- **Honeypot fields**: `website`, `phone2`, `address`, `fax`
- **Blocked patterns**: `http`, `www.`, `.com`, `href`, `<a`, `<script`
- **Max message length**: 5,000 characters

## Testing

```bash
# Test rate limiting (6 requests - should fail on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"web","message":"Test"}'
done
```

## Troubleshooting

**Rate limiting not working?**
- Check Supabase table exists
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- Ensure IP headers are being passed

**Users blocked?**
- Increase `maxRequests` in route.ts
- Decrease `windowMs` for shorter window
- Check for shared IPs (VPN, office)

## Files Created/Modified

- ✅ `frontend/src/lib/rate-limiter.ts` (new)
- ✅ `frontend/src/lib/captcha.ts` (new)  
- ✅ `frontend/src/app/api/contact/route.ts` (updated)
- ✅ `docs/supabase/rate_limits_table.sql` (new)
- ✅ `docs/rate-limiting-setup.md` (new)

## Status

🟢 **Ready for deployment** after SQL migration is applied.

The implementation is production-ready and will immediately start protecting your contact form once the Supabase table is created.
