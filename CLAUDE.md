# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AssetWise Hot Deal is a Thai real estate property listing platform built with PHP and Tailwind CSS. It displays condominium units ("Hot Deals") with special pricing, allowing users to browse, filter by project/location, and register interest via OTP verification.

## Tech Stack

- **Backend**: PHP 7.4+ with Composer
- **Frontend**: Tailwind CSS v4.1.10 + DaisyUI v5.0.43
- **Email**: PHPMailer 6.10
- **CSS Processing**: Tailwind CLI
- **JavaScript**: ES6 modules with Swiper.js, jQuery, SweetAlert2
- **APIs**: External AssetWise API (aswservice.com) and CIS system

## Development Commands

### CSS Development
```bash
npm run dev
```
Watch mode for Tailwind CSS compilation from `css/input.css` to `css/output.css`

### PHP Dependencies
```bash
composer install
```
Install PHPMailer and other PHP dependencies

## Architecture

### Directory Structure

- **`/layouts/`** - Reusable PHP layout components (header, footer, hero-banner, unit-box, modals)
- **`/utils/`** - Core utilities:
  - `api.php` - Main API wrapper for external services, handles AJAX requests via `?action=` parameter
  - `mail.php` - PHPMailer email sending (SMTP config for ASW-NoReply@assetwise.co.th)
  - `cis.php` - CIS system integration for customer registration
- **`/unit/`** - Individual unit detail page
- **`/css/`** - Tailwind input/output files
- **`/js/`** - JavaScript modules:
  - `script.js` - Main entry point (orchestration)
  - `modules/` - Modular code structure:
    - `api.js` - AJAX requests & API calls
    - `auth.js` - Authentication & OTP handling
    - `member.js` - Member CRUD operations
    - `modals.js` - Modal UI interactions
    - `units.js` - Unit listing & filtering
    - `carousel.js` - Swiper initialization
    - `utils.js` - Helper functions & utilities

### Key Architecture Patterns

1. **PHP Include-Based Routing**: Each page includes layout components (`header.php`, `footer.php`, etc.)
2. **AJAX API Pattern**: All API requests go through `utils/api.php?action=<action_name>` with centralized error handling
3. **External API Integration**:
   - Unit data from `https://aswservice.com/hotdealapi`
   - CIS registration at `https://aswinno.assetwise.co.th/CISUAT/api/Customer/SaveOtherSource`
   - WordPress API for project facilities/gallery
4. **JWT Authentication**: Member login uses JWT tokens stored in localStorage
5. **Base URL Management**: `BASE_URL` constant set to `/hotdeal/` for relative paths
6. **Modular JavaScript**: ES6 modules with clear separation of concerns (see `/js/modules/README.md`)
   - Each module has single responsibility
   - Import/export pattern for code reusability
   - Main `script.js` orchestrates all modules

### Important Configuration

- **Base URL**: Defined in [layouts/header.php](layouts/header.php) as `BASE_URL = '/hotdeal/'`
- **API Endpoints**: Defined in [utils/api.php](utils/api.php) (API_BASE_URL, ASSETS_PATH)
- **Email SMTP**: Configured in [utils/mail.php](utils/mail.php) with Office365 credentials
- **Tailwind Config**: Uses `@source` directive in [css/input.css](css/input.css) to scan `./**/*.{php,html,js,css}`

### API Actions Available

Access via `utils/api.php?action=<action>`:
- `get_units` - Fetch units with filtering (searchStr, projectIDs, locationIDs, sortingUnit)
- `send_otp` / `verify_otp` - Phone/email OTP verification
- `add_member` / `update_member` / `get_member` - Member management
- `get_project_name` - Fetch project details
- `get_cmp_utm_by_id` - Campaign UTM tracking

### Member Registration Flow

1. User clicks "สนใจยูนิตนี้" (Interest button)
2. Login/register modal opens with OTP verification
3. After verification, form submits to [utils/cis.php](utils/cis.php)
4. CIS saves customer data + sends thank you email via PHPMailer
5. UTM tracking includes unit ID: `ASW_HotDeal_New_Website_{unitID}`

## Development Notes

- Thai language (UTF-8) throughout - ensure proper charset handling
- Time zone: GMT+7 (Bangkok) for CIS RefDate
- Uses custom DBHeavent font (loaded via `fonts/style.css`)
- DaisyUI theming with custom CSS variables in [css/input.css](css/input.css)
- All unit images served from external CDN (ASSETS_PATH)
- Debug logs written to `utils/api_debug.log` and `utils/cis_debug.log` (gitignored)

## Security Guidelines

**CRITICAL:** All credentials are stored in `.env` file (never commit!)

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in actual credentials
3. Set permissions: `chmod 600 .env`
4. Load with: `require_once __DIR__ . '/utils/bootstrap.php';`

### Input Validation
```php
// Always validate and sanitize user input
use InputValidator;

$email = InputValidator::sanitizeEmail($_POST['email']);
if (!InputValidator::validateEmail($email)) {
    // Handle error
}

$phone = InputValidator::sanitizePhone($_POST['phone']);
if (!InputValidator::validateThaiPhone($phone)) {
    // Handle error
}
```

### CSRF Protection
```php
// In forms
<?php echo CSRF::tokenField(); ?>

// In API endpoints
CSRF::verifyRequest(); // Throws 403 if invalid

// In JavaScript AJAX
const token = document.querySelector('meta[name="csrf-token"]').content;
fetch(url, {
    headers: { 'X-CSRF-Token': token }
});
```

### Rate Limiting
```php
// Limit OTP requests
RateLimiter::checkAndHandle('otp_request', $phone, 3, 3600);
RateLimiter::record('otp_request', $phone);
```

### XSS Prevention
```php
// Always escape output
echo htmlspecialchars($data, ENT_QUOTES, 'UTF-8');

// In JavaScript: Use textContent instead of innerHTML
element.textContent = userInput; // Safe
element.innerHTML = userInput;   // Unsafe!
```

### Security Headers
All security headers are set in [layouts/header.php](layouts/header.php):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content-Security-Policy (configured)

**See [docs/SECURITY.md](docs/SECURITY.md) for complete security documentation**