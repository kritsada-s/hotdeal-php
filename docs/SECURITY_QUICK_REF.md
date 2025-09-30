# 🔐 Security Quick Reference Card

**Print this and keep it handy!**

---

## ⚡ Quick Commands

### Check .env is NOT in Git
```bash
git status | grep .env  # Should be empty
```

### Secure File Permissions
```bash
chmod 600 .env
chmod 600 utils/*.log
```

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Test SMTP Connection
```bash
telnet smtp.office365.com 587
```

---

## 🔑 Environment Variables

**Location:** `.env` (root directory)

**Critical Settings:**
```ini
SMTP_USERNAME=your-email@assetwise.co.th
SMTP_PASSWORD=your-password
CIS_API_USERNAME=your-username
CIS_API_PASSWORD=your-password
JWT_SECRET=random-32-char-string
```

**Access in Code:**
```php
$value = env('KEY_NAME');
```

---

## ✅ Input Validation

```php
use InputValidator;

// Email
$email = InputValidator::sanitizeEmail($_POST['email']);
if (!InputValidator::validateEmail($email)) {
    // Error
}

// Phone
$phone = InputValidator::sanitizePhone($_POST['phone']);
if (!InputValidator::validateThaiPhone($phone)) {
    // Error
}

// String
$name = InputValidator::sanitizeString($_POST['name']);
```

---

## 🛡️ CSRF Protection

### In PHP Forms:
```php
<?php echo CSRF::tokenField(); ?>
```

### In API Endpoints:
```php
CSRF::verifyRequest();
```

### In JavaScript AJAX:
```javascript
const token = document.querySelector('meta[name="csrf-token"]').content;
fetch(url, {
    method: 'POST',
    headers: {
        'X-CSRF-Token': token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

---

## ⏱️ Rate Limiting

```php
// Check and enforce (returns 429 if exceeded)
RateLimiter::checkAndHandle('action_name', $identifier, 3, 3600);
// 3 attempts per hour (3600 seconds)

// Record attempt
RateLimiter::record('action_name', $identifier);
```

**Common Limits:**
- OTP: 3 per phone per hour
- Login: 5 per IP per 15 min
- API: 100 per IP per hour

---

## 🔒 XSS Prevention

### PHP Output:
```php
// SAFE
echo htmlspecialchars($data, ENT_QUOTES, 'UTF-8');

// UNSAFE
echo $data;  // ❌ NEVER!
```

### JavaScript:
```javascript
// SAFE
element.textContent = userInput;

// UNSAFE
element.innerHTML = userInput;  // ❌ NEVER!
```

---

## 📋 Pre-Deployment Checklist

```
[ ] All credentials rotated
[ ] .env secured (chmod 600)
[ ] .env NOT in Git
[ ] HTTPS configured
[ ] Security headers enabled
[ ] CSRF tokens on all forms
[ ] Rate limiting active
[ ] All tests passed
[ ] Backups automated
[ ] Monitoring configured
```

---

## 🚨 Emergency Response

### Security Breach Detected

**Immediate Actions:**
1. Take site offline
2. Rotate ALL credentials
3. Review access logs: `tail -f /var/log/nginx/access.log`
4. Contact: security@assetwise.co.th

### Common Attacks

**Brute Force:**
```bash
# Check failed attempts
grep "403\|401" /var/log/nginx/access.log | wc -l
```

**SQL Injection:**
```bash
# Check for suspicious patterns
grep -i "union\|select\|drop\|insert" /var/log/nginx/access.log
```

**XSS Attempts:**
```bash
# Check for script tags
grep -i "<script" utils/*.log
```

---

## 📞 Quick Contacts

- **Security Team:** security@assetwise.co.th
- **DevOps:** devops@assetwise.co.th
- **Emergency:** +66-XX-XXX-XXXX

---

## 🔗 Documentation Links

- **Full Guide:** [SECURITY.md](SECURITY.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Summary:** [SECURITY_FIXES_SUMMARY.md](SECURITY_FIXES_SUMMARY.md)
- **Architecture:** [CLAUDE.md](CLAUDE.md)

---

**Version:** 1.0
**Last Updated:** 2025-01-29