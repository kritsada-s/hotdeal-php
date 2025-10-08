# Security Implementation Guide

## 🔐 Security Measures Implemented

This document outlines the security improvements implemented in the AssetWise Hot Deal application.

---

## ✅ Implemented Security Features

### 1. **Environment Variables (.env)**

**What:** All sensitive credentials moved from code to `.env` file

**Files:**
- `.env` - Contains actual credentials (NEVER commit!)
- `.env.example` - Template for developers
- `utils/bootstrap.php` - Loads environment variables

**Usage:**
```php
// Access env variables
$smtp_host = env('SMTP_HOST');
$api_url = env('HOTDEAL_API_URL');
```

**Critical:** After deployment, you MUST:
1. Change ALL passwords in `.env`
2. Rotate SMTP password
3. Rotate CIS API password
4. Generate new JWT_SECRET: `openssl rand -base64 32`
5. Set file permissions: `chmod 600 .env`

---

### 2. **Input Validation & Sanitization**

**What:** All user input is validated and sanitized before processing

**Files:**
- `utils/validator.php` - Validation helper class
- `utils/cis.php` - Implements validation
- `utils/mail.php` - Sanitizes email data

**Examples:**
```php
// Validate email
if (!InputValidator::validateEmail($email)) {
    // Handle error
}

// Sanitize phone
$phone = InputValidator::sanitizePhone($_POST['phone']);

// Validate Thai phone format
if (!InputValidator::validateThaiPhone($phone)) {
    // Handle error
}
```

**Validation Rules:**
- **Email:** RFC 5322 compliant
- **Thai Phone:** 10 digits starting with 0 (e.g., 0812345678)
- **Name:** 2-50 characters
- **OTP:** 4-6 digits

---

### 3. **CSRF Protection**

**What:** Prevents Cross-Site Request Forgery attacks

**Files:**
- `utils/csrf.php` - CSRF token management
- `layouts/header.php` - Meta tag with CSRF token
- All forms should include CSRF tokens

**Usage:**

**In PHP (forms):**
```php
<form action="submit.php" method="POST">
    <?php echo CSRF::tokenField(); ?>
    <!-- Other form fields -->
</form>
```

**In JavaScript (AJAX):**
```javascript
// Get token from meta tag
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Include in AJAX requests
fetch(url, {
    method: 'POST',
    headers: {
        'X-CSRF-Token': token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

**Verify in API:**
```php
// In utils/api.php
CSRF::verifyRequest(); // Throws 403 if invalid
```

---

### 4. **Rate Limiting**

**What:** Prevents abuse by limiting requests per user/IP

**Files:**
- `utils/rate-limiter.php` - Rate limiting logic

**Usage:**
```php
// Check and enforce rate limit
RateLimiter::checkAndHandle('otp_request', $phone, 3, 3600);
// 3 attempts per phone per hour (3600 seconds)

// Record attempt
RateLimiter::record('otp_request', $phone);
```

**Default Limits:**
- **OTP Requests:** 3 per phone/email per hour
- **Token:** Stored in session, auto-cleanup after 2 hours

---

### 5. **Security Headers**

**What:** HTTP headers that protect against common attacks

**Files:**
- `layouts/header.php` - Sets security headers

**Headers Implemented:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [see below]
```

**CSP Policy:**
- `default-src 'self'` - Only allow same-origin by default
- `script-src` - Allow scripts from CDNs (jQuery, Swiper, etc.)
- `style-src` - Allow styles from CDNs
- `img-src` - Allow images from https and data URIs
- `connect-src` - Allow AJAX to approved APIs only

---

### 6. **XSS Prevention**

**What:** Prevents malicious script injection

**Implementation:**
- ✅ All output escaped with `htmlspecialchars()`
- ✅ Email templates sanitized
- ⚠️ JavaScript still needs updating (see TODO)

**Safe Output:**
```php
// SAFE
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// UNSAFE - NEVER DO THIS
echo $_POST['name']; // ❌ Vulnerable to XSS
```

**JavaScript TODO:**
```javascript
// UNSAFE (current)
element.innerHTML = userInput; // ❌

// SAFE (should use)
element.textContent = userInput; // ✅
```

---

### 7. **Secure Logging**

**What:** Debug logs exclude sensitive data

**Files:**
- `utils/cis.php` - Sanitized logging
- `utils/api.php` - Sanitized logging

**Best Practices:**
- ❌ NEVER log passwords, credit cards, OTPs
- ✅ Log request metadata only
- ✅ Set restrictive file permissions (chmod 600)
- ✅ Rotate logs regularly

---

## 🚨 Critical Actions Required

### Immediate (Before Production Deploy):

1. **Rotate ALL Credentials**
   ```bash
   # Generate new JWT secret
   openssl rand -base64 32

   # Update .env with new values
   nano .env
   ```

2. **Change Passwords:**
   - SMTP password (Office 365)
   - CIS API password
   - Supabase key (if needed)
   - JWT secret

3. **File Permissions:**
   ```bash
   chmod 600 .env
   chmod 600 utils/*.log
   ```

4. **Git Check:**
   ```bash
   # Ensure .env is never committed
   git status
   # Should NOT show .env file

   # If .env is tracked, remove from history:
   git rm --cached .env
   git commit -m "Remove .env from version control"
   ```

---

## 📋 Integration Checklist

### For Existing Forms:

- [ ] Add CSRF token field
- [ ] Validate all input server-side
- [ ] Sanitize all output
- [ ] Implement rate limiting (if applicable)
- [ ] Add error handling

### For New API Endpoints:

- [ ] Verify CSRF token
- [ ] Validate input with `InputValidator`
- [ ] Sanitize all data
- [ ] Implement rate limiting
- [ ] Return generic error messages (hide internal details)
- [ ] Log securely (exclude sensitive data)

### For JavaScript:

- [ ] Include CSRF token in AJAX requests
- [ ] Use `textContent` instead of `innerHTML`
- [ ] Validate data client-side (user convenience)
- [ ] Always validate server-side (security)

---

## 🔍 Testing Security

### Manual Tests:

1. **CSRF Test:**
   - Try submitting form without token → Should fail with 403
   - Try reusing old token → Should fail

2. **Rate Limiting Test:**
   - Request OTP 4 times quickly → 4th should fail with 429
   - Wait 1 hour → Should work again

3. **Input Validation Test:**
   - Submit invalid email → Should reject
   - Submit invalid phone → Should reject
   - Submit SQL injection attempt → Should sanitize

4. **XSS Test:**
   - Submit `<script>alert('XSS')</script>` in name field
   - Should display as text, not execute

### Automated Tests (TODO):
- PHPUnit tests for validators
- Integration tests for CSRF
- Penetration testing

---

## 📚 Additional Resources

### Security Best Practices:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### Monitoring:
- Review `utils/*.log` files regularly
- Monitor failed login attempts
- Set up alerts for suspicious activity

---

## ⚠️ Known Issues & TODOs

1. **JavaScript XSS:** Replace all `innerHTML` with `textContent` or use DOMPurify
2. **JWT Expiration:** Add client-side expiration check
3. **HTTPS:** Ensure production uses HTTPS only
4. **Session Security:** Use HttpOnly, Secure, SameSite cookies
5. **Database:** If adding database, use prepared statements (PDO)

---

## 🆘 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** disclose publicly
2. Document the issue (steps to reproduce)
3. Assess severity (Critical/High/Medium/Low)
4. Notify security team immediately
5. Deploy hotfix if critical
6. Post-mortem after resolution

---

**Last Updated:** 2025-01-29
**Version:** 1.0
**Maintainer:** Development Team