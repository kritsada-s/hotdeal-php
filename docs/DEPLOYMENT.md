# 🚀 Deployment & Security Checklist

## ⚠️ CRITICAL: Pre-Deployment Security Actions

**DO NOT deploy to production without completing ALL items below!**

---

## 1. Rotate ALL Credentials

### A. Generate New JWT Secret
```bash
# Generate random secret key
openssl rand -base64 32

# Copy output and paste into .env
```

### B. Change SMTP Password
1. Log into Office 365 Admin Center
2. Reset password for `ASW-NoReply@assetwise.co.th`
3. Update `.env` with new password:
   ```
   SMTP_PASSWORD=YOUR_NEW_PASSWORD_HERE
   ```

### C. Change CIS API Credentials
1. Contact CIS admin to rotate credentials
2. Update `.env` with new values:
   ```
   CIS_API_USERNAME=new_username
   CIS_API_PASSWORD=new_password
   ```

### D. Rotate Supabase Key (if used)
1. Go to Supabase Project Settings
2. Generate new anon key
3. Update `.env`:
   ```
   SUPABASE_KEY=new_key_here
   ```

---

## 2. File Permissions

```bash
cd /path/to/hotdeal

# Secure .env file
chmod 600 .env

# Secure log files
chmod 600 utils/*.log

# Make bootstrap readable
chmod 644 utils/bootstrap.php

# Verify ownership (replace www-data with your web server user)
chown -R www-data:www-data .
```

---

## 3. Git Repository Cleanup

```bash
# Ensure .env is NOT in repository
git status
# Should NOT show .env

# If .env is tracked, remove it:
git rm --cached .env
git add .gitignore
git commit -m "Remove .env from version control"

# Check commit history for leaked secrets
git log --all --full-history --source -- .env

# If .env was committed, purge history:
# WARNING: This rewrites history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team)
git push origin --force --all
git push origin --force --tags
```

---

## 4. Environment Configuration

### Production .env Settings
```ini
APP_ENV=production
DEBUG_MODE=false
```

### Test Credentials Work
```bash
# Test SMTP
php -r "
require 'vendor/autoload.php';
\$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
\$dotenv->load();
echo 'SMTP_HOST: ' . \$_ENV['SMTP_HOST'] . PHP_EOL;
echo 'Connection test: ';
try {
    \$mail = new PHPMailer\PHPMailer\PHPMailer();
    \$mail->isSMTP();
    \$mail->Host = \$_ENV['SMTP_HOST'];
    \$mail->SMTPAuth = true;
    \$mail->Username = \$_ENV['SMTP_USERNAME'];
    \$mail->Password = \$_ENV['SMTP_PASSWORD'];
    \$mail->Port = \$_ENV['SMTP_PORT'];
    \$mail->SMTPDebug = 0;
    \$mail->Timeout = 10;
    if (\$mail->smtpConnect()) {
        echo 'SUCCESS' . PHP_EOL;
        \$mail->smtpClose();
    } else {
        echo 'FAILED' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'ERROR: ' . \$e->getMessage() . PHP_EOL;
}
"
```

---

## 5. Web Server Configuration

### Apache (.htaccess)
```apache
# Add to .htaccess in root directory

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent .env access
<Files ".env">
    Require all denied
</Files>

# Prevent log file access
<FilesMatch "\.(log)$">
    Require all denied
</FilesMatch>

# Security headers (backup if PHP fails)
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Nginx (nginx.conf)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/hotdeal;
    index index.php;

    # Deny access to .env
    location ~ /\.env {
        deny all;
        return 404;
    }

    # Deny access to log files
    location ~ \.log$ {
        deny all;
        return 404;
    }

    # PHP handling
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

---

## 6. PHP Configuration

Edit `php.ini`:
```ini
# Security settings
expose_php = Off
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php/error.log

# Session security
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"
session.use_strict_mode = 1

# Upload limits
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 30
memory_limit = 128M

# Disable dangerous functions
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

Restart PHP-FPM:
```bash
sudo systemctl restart php8.1-fpm
```

---

## 7. Database Security (if applicable)

```sql
-- Create dedicated user with minimal privileges
CREATE USER 'hotdeal_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE ON hotdeal_db.* TO 'hotdeal_user'@'localhost';
FLUSH PRIVILEGES;

-- Update .env
DATABASE_USER=hotdeal_user
DATABASE_PASSWORD=strong_password_here
```

---

## 8. Monitoring & Logging

### A. Set Up Log Rotation
```bash
# Create /etc/logrotate.d/hotdeal
sudo nano /etc/logrotate.d/hotdeal
```

```
/path/to/hotdeal/utils/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0600 www-data www-data
}
```

### B. Monitor Failed Requests
```bash
# Check for suspicious activity
tail -f /var/log/nginx/error.log | grep -i "403\|401\|429"
```

### C. Set Up Alerts (Optional)
Use services like:
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **Uptime Robot** - Uptime monitoring

---

## 9. SSL/TLS Certificate

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (runs twice daily)
sudo certbot renew --dry-run
```

### Verify SSL Grade
Test at: https://www.ssllabs.com/ssltest/

Target: **A+ rating**

---

## 10. Backup Strategy

### A. Automated Backups
```bash
#!/bin/bash
# /usr/local/bin/backup-hotdeal.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/hotdeal"
SOURCE_DIR="/var/www/hotdeal"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup files (excluding logs and cache)
tar -czf $BACKUP_DIR/hotdeal_$DATE.tar.gz \
    --exclude='*.log' \
    --exclude='node_modules' \
    --exclude='vendor' \
    $SOURCE_DIR

# Backup .env separately (encrypted)
gpg --encrypt --recipient your-email@example.com \
    -o $BACKUP_DIR/env_$DATE.gpg \
    $SOURCE_DIR/.env

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.gpg" -mtime +30 -delete
```

### B. Schedule with Cron
```bash
crontab -e
# Add line:
0 2 * * * /usr/local/bin/backup-hotdeal.sh
```

---

## 11. Testing Checklist

### Manual Security Tests

- [ ] **HTTPS Redirect:** Visit http://your-domain.com → Should redirect to https://
- [ ] **.env Access:** Visit https://your-domain.com/.env → Should return 404
- [ ] **Log Access:** Visit https://your-domain.com/utils/api_debug.log → Should return 404
- [ ] **CSRF Test:** Submit form without token → Should return 403
- [ ] **Rate Limiting:** Request OTP 4 times quickly → 4th should fail with 429
- [ ] **XSS Test:** Submit `<script>alert('XSS')</script>` in name → Should escape
- [ ] **SQL Injection Test:** Submit `' OR '1'='1` in input → Should sanitize
- [ ] **Email Test:** Register with valid email → Should receive thank you email
- [ ] **OTP Test:** Request OTP → Should receive SMS/email
- [ ] **Security Headers:** Check with https://securityheaders.com/

### Automated Tests
```bash
# Run security scanner
composer require --dev vimeo/psalm
./vendor/bin/psalm --init
./vendor/bin/psalm
```

---

## 12. Post-Deployment Verification

### A. Smoke Tests
```bash
# Test homepage
curl -I https://your-domain.com/hotdeal/

# Test API endpoint
curl -X POST https://your-domain.com/hotdeal/utils/api.php \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}'
```

### B. Performance Test
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://your-domain.com/hotdeal/
```

### C. Security Scan
Use tools like:
- **OWASP ZAP** - Vulnerability scanner
- **Nikto** - Web server scanner
- **Nmap** - Port scanner

---

## 13. Incident Response Plan

### If Breach Detected:

1. **Immediately:**
   - Take site offline (`maintenance mode`)
   - Rotate ALL credentials
   - Review access logs

2. **Investigation:**
   - Identify attack vector
   - Assess data exposure
   - Document timeline

3. **Remediation:**
   - Patch vulnerability
   - Restore from clean backup
   - Deploy fixes

4. **Post-Incident:**
   - Notify affected users (if required by law)
   - Update security measures
   - Conduct post-mortem

### Emergency Contacts
```
Security Team: security@assetwise.co.th
Server Admin: sysadmin@assetwise.co.th
On-Call Phone: +66-XX-XXX-XXXX
```

---

## 14. Maintenance Schedule

### Weekly
- [ ] Review error logs
- [ ] Check failed login attempts
- [ ] Verify backups completed

### Monthly
- [ ] Update dependencies (`composer update`, `npm update`)
- [ ] Review security advisories
- [ ] Rotate API keys

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Disaster recovery drill

---

## ✅ Final Checklist

**Before going live, verify ALL items are complete:**

- [ ] All credentials rotated
- [ ] `.env` file secured (chmod 600)
- [ ] `.env` removed from git history
- [ ] HTTPS configured with valid certificate
- [ ] Security headers enabled
- [ ] Web server hardened
- [ ] PHP configured securely
- [ ] Backups automated
- [ ] Monitoring configured
- [ ] All security tests passed
- [ ] Performance tested
- [ ] Team trained on security procedures
- [ ] Incident response plan documented
- [ ] Emergency contacts updated

---

**Deployment Date:** __________________
**Deployed By:** __________________
**Verified By:** __________________

**Last Updated:** 2025-01-29
**Version:** 1.0