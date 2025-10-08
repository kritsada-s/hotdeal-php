# 🔐 Login Flow Analysis - AssetWise Hot Deal

## Overview

The login system uses **OTP (One-Time Password) authentication** via SMS or Email, with **JWT tokens** for session management stored in localStorage.

---

## 📊 Complete Login Flow Diagram

```
User Action → Frontend → Backend API → External Service → Response → State Update
```

---

## 🎯 Detailed Flow Breakdown

### **1. Trigger Point: User Clicks "สนใจยูนิตนี้" (Interest Button)**

**Location:** Dynamic unit cards or [layouts/unit-box.php:24](layouts/unit-box.php#L24)

**Code:**
```html
<button class="unitBtn"
        data-unit="A101"
        data-project="Project Name"
        data-cisid="P001"
        data-utm-cmp="campaign_id">
    สนใจยูนิตนี้
</button>
```

**JavaScript Handler:** [js/script.js:266-288](js/script.js#L266-L288)
```javascript
btn.addEventListener('click', function() {
    const isAuth = checkAuthToken();  // Check if already logged in
    let project = {
        cisid: btn.dataset.cisid,
        project: btn.dataset.project,
        unit: btn.dataset.unit,
        utm: btn.dataset.utmCmp
    }

    if (isAuth) {
        // Already logged in → Go directly to summary modal
        let user = decodeToken(localStorage.getItem('hotdeal_token'));
        updateSummaryModal(user, project);
        summaryModal.showModal();
    } else {
        // Not logged in → Save project data and show login modal
        localStorage.setItem('tmp_p', JSON.stringify(project));
        loginModal.showModal();
    }
});
```

**Decision:**
- ✅ If authenticated → Jump to **Step 8** (Summary Modal)
- ❌ If not authenticated → Continue to **Step 2** (Login Modal)

---

### **2. Login Modal Opens**

**Location:** [layouts/modals.php:85-129](layouts/modals.php#L85-L129)

**UI Elements:**
- Radio buttons: Phone (default) | Email
- Input field: Phone number or Email
- Button: "ส่งรหัส OTP" (Send OTP)

**User Interaction:**
1. User selects OTP method (Phone or Email)
2. User enters contact information
3. User clicks "ส่งรหัส OTP"

**JavaScript Handler:** [js/script.js:638-652](js/script.js#L638-L652)
```javascript
requestOTPBtn.addEventListener('click', function() {
    const selectedMethod = document.querySelector('input[name="otp_method"]:checked').value;
    let contactValue = '';

    if (selectedMethod === 'email') {
        contactValue = document.getElementById('otp_email').value;
    } else if (selectedMethod === 'phone') {
        contactValue = document.getElementById('otp_phone').value;
    }

    requestOTP(contactValue, selectedMethod);
});
```

---

### **3. Request OTP**

**Function:** [js/script.js:352-404](js/script.js#L352-L404)

**Client-Side Validation:**
```javascript
function requestOTP(contactValue, method = 'phone') {
    // Validate email format
    if (method === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactValue)) {
            return;  // Stop if invalid
        }
    }

    // Validate Thai phone (10 digits)
    else if (method === 'phone') {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactValue.replace(/[-\s]/g, ''))) {
            return;  // Stop if invalid
        }
    }

    // Prepare data
    var data = new FormData();
    data.append('phone', contactValue);  // or 'email'
    data.append('action', 'send_otp');
    data.append('method', method);

    // Send AJAX request
    ajaxRequest(`${window.BASE_URL}utils/api.php`, callback, 'POST', data);
}
```

**Button State:**
```javascript
requestOTPBtn.disabled = true;
requestOTPBtn.innerHTML = 'กำลังส่งรหัส OTP...';  // "Sending OTP..."
```

---

### **4. Backend API: Send OTP**

**Endpoint:** `utils/api.php?action=send_otp`

**Location:** [utils/api.php:138-159](utils/api.php#L138-L159)

**Server-Side Processing:**
```php
case 'send_otp':
    // Get method (phone or email)
    $method = $_REQUEST['method'] ?? 'phone';

    if ($method === 'email') {
        if (empty($_REQUEST['email'])) {
            $response = ['error' => true, 'message' => 'Email is required'];
        } else {
            // Call external API to send OTP via email
            $response = send_otp($_REQUEST['email'], '', 'false');
        }
    }
    else if ($method === 'phone') {
        if (empty($_REQUEST['phone'])) {
            $response = ['error' => true, 'message' => 'Phone number is required'];
        } else {
            // Call external API to send OTP via SMS
            $response = send_otp('', $_REQUEST['phone'], 'true');
        }
    }
    break;
```

**External API Call:** [utils/api.php:354-369](utils/api.php#L354-L369)
```php
function send_otp($email, $phone, $is_phone) {
    $url = API_BASE_URL . '/Otp/RequestOtp';
    $data = [
        'Email' => $email,
        'Tel' => $phone,
        'IsPhone' => $is_phone
    ];

    return fetch_from_api('POST', $url, $data);
}
```

**Response Format:**
```json
{
    "status": 200,
    "data": "REF123456",  // Reference number (for SMS only)
    "message": "OTP sent successfully"
}
```

---

### **5. OTP Modal Opens**

**JavaScript Callback:** [js/script.js:380-398](js/script.js#L380-L398)
```javascript
if (res.status == 200) {
    // Update modal title
    const otpModalTitle = document.getElementById('otp-modal-title');
    const otpModalSubtitle = document.getElementById('otp-modal-subtitle');

    if (method === 'email') {
        otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล';
    } else if (method === 'phone') {
        otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์';
        otpModalSubtitle.textContent = `รหัสอ้างอิง : ${res.data}`;  // Show REF number
    }

    // Close login modal, open OTP modal
    loginModal.close();
    otpModal.showModal();
}
```

**UI Elements:** [layouts/modals.php:131-152](layouts/modals.php#L131-L152)
- Title: "กรุณากรอกรหัส OTP..."
- Subtitle: Reference number (for SMS)
- Input: OTP code (4-6 digits)
- Button: "ยืนยัน" (Verify)

---

### **6. Verify OTP**

**User Action:** User enters OTP code and clicks "ยืนยัน"

**JavaScript Handler:** [js/script.js:654-669](js/script.js#L654-L669)
```javascript
verifyOTPBtn.addEventListener('click', function() {
    const otp = document.getElementById('otp').value;
    const selectedMethod = document.querySelector('input[name="otp_method"]:checked').value;
    let contactValue = '';

    if (selectedMethod === 'email') {
        contactValue = document.getElementById('otp_email').value;
    } else if (selectedMethod === 'phone') {
        contactValue = document.getElementById('otp_phone').value;
    }

    verifyOTP(contactValue, otp, selectedMethod);
});
```

**Function:** [js/script.js:406-500](js/script.js#L406-L500)
```javascript
function verifyOTP(contactValue, otp, method = 'phone') {
    var data = new FormData();
    data.append('phone', contactValue);  // or 'email'
    data.append('otp', otp);
    data.append('action', 'verify_otp');
    data.append('method', method);

    verifyOTPBtn.disabled = true;
    verifyOTPBtn.innerHTML = 'กำลังยืนยันรหัส OTP...';

    ajaxRequest(`${window.BASE_URL}utils/api.php`, callback, 'POST', data);
}
```

---

### **7. Backend API: Verify OTP**

**Endpoint:** `utils/api.php?action=verify_otp`

**Location:** [utils/api.php:160-177](utils/api.php#L160-L177)

**Server-Side Processing:**
```php
case 'verify_otp':
    $method = $_REQUEST['method'] ?? 'phone';

    if ($method === 'email') {
        if (empty($_REQUEST['email']) || empty($_REQUEST['otp'])) {
            $response = ['error' => true, 'message' => 'Email and OTP are required'];
        } else {
            $response = verify_otp($_REQUEST['email'], '', $_REQUEST['otp']);
        }
    }
    else if ($method === 'phone') {
        if (empty($_REQUEST['phone']) || empty($_REQUEST['otp'])) {
            $response = ['error' => true, 'message' => 'Phone and OTP are required'];
        } else {
            $response = verify_otp('', $_REQUEST['phone'], $_REQUEST['otp']);
        }
    }
    break;
```

**External API Call:** [utils/api.php:371-387](utils/api.php#L371-L387)
```php
function verify_otp($email, $phone, $otp) {
    $url = API_BASE_URL . '/Otp/VerifyOtp';
    $data = [
        'Email' => $email,
        'Tel' => $phone,
        'Otp' => $otp
    ];

    $result = fetch_from_api('POST', $url, $data);

    // Result contains JWT token if successful
    return $result;
}
```

**Response Format:**
```json
{
    "status": 200,
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token
    "message": "OTP verified successfully"
}
```

**JWT Token Payload (decoded):**
```json
{
    "ID": "12345",           // User ID (if existing user)
    "Firstname": "John",
    "Lastname": "Doe",
    "Email": "john@example.com",
    "Tel": "0812345678",
    "LineID": "",
    "iat": 1234567890,       // Issued at
    "exp": 1234671490        // Expires at
}
```

**OR (if new user):**
```json
{
    "Email": "new@example.com",
    "Tel": "0898765432",
    "iat": 1234567890,
    "exp": 1234671490
    // No "ID" field = new user needs registration
}
```

---

### **8A. Existing User: Login Success**

**JavaScript Handler:** [js/script.js:446-466](js/script.js#L446-L466)

**Decision Logic:**
```javascript
if (res.status == 200) {
    const decodedData = decodeToken(res.data);  // Decode JWT

    if (decodedData.ID) {
        // ✅ EXISTING USER - Has ID in token

        // Store token in localStorage
        localStorage.setItem('hotdeal_token', res.data);

        // Close OTP modal
        otpModal.close();

        // Show success message
        Swal.fire({
            title: 'เข้าสู่ระบบสำเร็จ',
            icon: 'success'
        }).then(() => {
            // Update username display
            memberName.innerHTML = decodedData.Firstname;

            // Check if user clicked from unit card
            if (localStorage.getItem('tmp_p')) {
                const project = JSON.parse(localStorage.getItem('tmp_p'));
                updateSummaryModal(decodedData, project);
                summaryModal.showModal();  // Show summary modal
            }
        });
    }
}
```

**Flow:**
```
OTP Verified → JWT with ID → Store Token → Show Success →
Update Display → Check tmp_p → Show Summary Modal
```

---

### **8B. New User: Registration Required**

**JavaScript Handler:** [js/script.js:467-486](js/script.js#L467-L486)

**Decision Logic:**
```javascript
else {
    // ❌ NEW USER - No ID in token

    // Store temporary token in sessionStorage
    sessionStorage.setItem('tmp_hotdeal_token', res.data);

    // Close OTP modal
    otpModal.close();

    // Show success message
    Swal.fire({
        title: 'ยืนยันรหัส OTP สำเร็จ',
        icon: 'success'
    }).then(() => {
        // Pre-fill registration form with verified contact
        if (method === 'email') {
            document.getElementById('registerEmail').value = contactValue;
            document.getElementById('registerEmail').readOnly = true;
        } else if (method === 'phone') {
            document.getElementById('registerPhone').value = contactValue;
            document.getElementById('registerPhone').readOnly = true;
        }

        // Show registration modal
        registerModal.showModal();
    });
}
```

**Flow:**
```
OTP Verified → JWT without ID → Store in sessionStorage →
Show Success → Pre-fill Form → Show Registration Modal
```

---

### **9. Registration: New User Completes Profile**

**Modal:** [layouts/modals.php:45-83](layouts/modals.php#L45-L83)

**Form Fields:**
- First Name (required)
- Last Name (required)
- Phone (pre-filled, read-only)
- Email (pre-filled if used for OTP, read-only)
- Line ID (optional)

**JavaScript Handler:** [js/script.js:677-715](js/script.js#L677-L715)
```javascript
registerSubmitBtn.addEventListener('click', function() {
    // Get form data
    const userData = {
        token: sessionStorage.getItem('tmp_hotdeal_token'),
        Firstname: document.getElementById('registerFirstName').value,
        Lastname: document.getElementById('registerLastName').value,
        Tel: document.getElementById('registerPhone').value,
        Email: document.getElementById('registerEmail').value,
        LineID: document.getElementById('registerLineId').value
    };

    // Call add_member function
    addMember(userData);
});
```

**Backend API Call:** [js/script.js:133-168](js/script.js#L133-L168)
```javascript
function addMember(userData) {
    var data = new FormData();
    data.append('data', JSON.stringify(userData));
    data.append('action', 'add_member');

    ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
        if (response.token != null) {
            // Registration successful, received new JWT with ID
            localStorage.setItem('hotdeal_token', response.token);

            let user = decodeToken(response.token);
            memberName.innerHTML = user.Firstname;

            registerModal.close();

            Swal.fire({
                title: 'ลงทะเบียนสำเร็จ',
                icon: 'success'
            });
        }
    }, 'POST', data);
}
```

**Backend Endpoint:** `utils/api.php?action=add_member`

**Location:** [utils/api.php:178-182](utils/api.php#L178-L182)
```php
case 'add_member':
    if (empty($_REQUEST['data'])) {
        $response = ['error' => true, 'message' => 'Data is required'];
    } else {
        $response = add_member($_REQUEST['data']);
    }
    break;
```

**External API Call:** [utils/api.php:389-402](utils/api.php#L389-L402)
```php
function add_member($data) {
    $url = API_BASE_URL . '/Member/AddMember';
    $memberData = json_decode($data, true);

    return fetch_from_api('POST', $url, $memberData);
}
```

**Response:**
```json
{
    "status": 200,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // New JWT with ID
    "message": "Member added successfully"
}
```

---

### **10. Summary Modal: Express Interest in Unit**

**Triggered by:**
- Existing user after login
- New user after registration
- User clicks "สนใจยูนิตนี้" when already logged in

**Modal:** [layouts/modals.php:154-206](layouts/modals.php#L154-L206)

**Pre-filled Data:**
```javascript
function updateSummaryModal(member, unit) {
    // Member data from JWT
    summaryFirstName.value = member.Firstname;
    summaryLastName.value = member.Lastname;
    summaryEmail.value = member.Email;
    summaryPhone.value = member.Tel;
    summaryLineId.value = member.LineID;

    // Unit data from button click
    summaryProject.innerHTML = unit.project;
    summaryUnit.innerHTML = unit.unit;
    summaryProjectID.value = unit.cisid;
}
```

**User Action:** User clicks "ลงทะเบียน" (Register Interest)

**JavaScript Handler:** [js/script.js:735-783](js/script.js#L735-L783)
```javascript
summarySubmitBtn.addEventListener('click', function() {
    // Prepare data for CIS system
    const formData = {
        ProjectID: summaryProjectID.value,
        RefID: summaryProjectID.value,
        Fname: summaryFirstName.value,
        Lname: summaryLastName.value,
        Tel: summaryPhone.value,
        Email: summaryEmail.value,
        Ref: summaryUtmCmp,
        unitID: summaryUnit.innerHTML,
        projectName: summaryProjectName.innerHTML
    };

    // Submit to CIS
    fetch(`${window.BASE_URL}utils/cis.php`, {
        method: 'POST',
        body: new URLSearchParams(formData)
    });
});
```

**Backend: CIS Registration**

**File:** [utils/cis.php](utils/cis.php)

**Processing:**
1. **Validate Input:** [utils/cis.php:19-39](utils/cis.php#L19-L39)
2. **Sanitize Data:** [utils/cis.php:42-73](utils/cis.php#L42-L73)
3. **Send to CIS API:** [utils/cis.php:95-114](utils/cis.php#L95-L114)
4. **Send Thank You Email:** [utils/cis.php:152](utils/cis.php#L152)

**CIS API Call:**
```php
curl_setopt_array($curl, array(
    CURLOPT_URL => env('CIS_API_URL'),
    CURLOPT_POSTFIELDS => http_build_query($data),
    CURLOPT_HTTPHEADER => array(
        'Authorization: Basic ' . $cis_auth,
        'Content-Type: application/x-www-form-urlencoded',
    ),
));
```

**Data Sent to CIS:**
```php
$data = [
    'ProjectID' => $projectID,
    'ContactChannelID' => 21,        // Website
    'ContactTypeID' => 35,            // Register
    'RefID' => $refID,
    'Fname' => $fname,
    'Lname' => $lname,
    'Tel' => $tel,
    'Email' => $email,
    'Ref' => $ref,
    'RefDate' => date('Y-m-d H:i:s', strtotime('+7 hours')),  // GMT+7
    'FollowUpID' => 42,
    'utm_source' => 'ASW_HotDeal_New_Website_' . $unitID,
    'FlagPersonalAccept' => 1,
    'FlagContactAccept' => 1,
];
```

**Thank You Email:** [utils/mail.php:6-96](utils/mail.php#L6-L96)

**Email Content:**
```
Subject: ขอบคุณสำหรับการลงทะเบียน AssetWise Hot Deals

ยูนิตเลขที่: A101
โครงการ: Example Project
เจ้าหน้าที่ของเราจะติดต่อกลับไปเพื่อให้ข้อมูลเพิ่มเติมในเร็ว ๆ นี้
```

---

## 🔄 Complete Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  USER CLICKS "สนใจยูนิตนี้" (INTEREST BUTTON)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  Check Authentication  │
          │  checkAuthToken()      │
          └────────┬───────────────┘
                   │
        ┌──────────┴───────────┐
        │                      │
        ▼ NO                   ▼ YES
┌──────────────┐       ┌──────────────────┐
│ Login Modal  │       │  Summary Modal   │
│ (Choose OTP) │       │  (Go to Step 10) │
└──────┬───────┘       └──────────────────┘
       │
       ▼
┌─────────────────┐
│  Request OTP    │
│  send_otp()     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   OTP Modal     │
│ (Enter Code)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verify OTP     │
│  verify_otp()   │
└────────┬────────┘
         │
         ▼
   ┌────────────┐
   │ Check JWT  │
   └─────┬──────┘
         │
    ┌────┴────┐
    │         │
    ▼ Has ID  ▼ No ID
┌────────┐  ┌──────────────┐
│ Login  │  │ Registration │
│Success │  │    Modal     │
└───┬────┘  └──────┬───────┘
    │              │
    │              ▼
    │      ┌──────────────┐
    │      │  add_member  │
    │      └──────┬───────┘
    │             │
    └─────────────┘
           │
           ▼
  ┌─────────────────┐
  │  Summary Modal  │
  │ (Express        │
  │  Interest)      │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Submit to     │
  │   CIS System    │
  │ + Send Email    │
  └─────────────────┘
           │
           ▼
  ┌─────────────────┐
  │ Success Message │
  │   Complete!     │
  └─────────────────┘
```

---

## 🗂️ Key Files Reference

### **Frontend (JavaScript):**
| File | Key Functions | Lines |
|------|---------------|-------|
| [js/script.js](js/script.js) | `checkAuthToken()` | 196-215 |
| | `decodeToken()` | 63-77 |
| | `requestOTP()` | 352-404 |
| | `verifyOTP()` | 406-500 |
| | `addMember()` | 133-168 |
| | Unit button handler | 266-288 |
| | Request OTP button | 638-652 |
| | Verify OTP button | 654-669 |
| | Register submit | 677-715 |
| | Summary submit | 735-783 |

### **Backend (PHP):**
| File | Purpose | Key Sections |
|------|---------|--------------|
| [utils/api.php](utils/api.php) | API router | Lines 130-226 |
| | `send_otp()` | 354-369 |
| | `verify_otp()` | 371-387 |
| | `add_member()` | 389-402 |
| [utils/cis.php](utils/cis.php) | CIS integration | Full file |
| [utils/mail.php](utils/mail.php) | Email sender | 6-96 |

### **UI (HTML/PHP):**
| File | Component | Lines |
|------|-----------|-------|
| [layouts/modals.php](layouts/modals.php) | Login Modal | 85-129 |
| | OTP Modal | 131-152 |
| | Register Modal | 45-83 |
| | Summary Modal | 154-206 |
| [layouts/unit-box.php](layouts/unit-box.php) | Unit button | 24 |

---

## 🔐 Security Considerations

### **Current Implementation:**

1. **OTP Validation:**
   - ✅ Client-side regex validation
   - ⚠️ Server-side validation needs enhancement
   - ✅ One-time use tokens

2. **JWT Token:**
   - ✅ Stored in localStorage
   - ⚠️ No expiration check client-side
   - ⚠️ Vulnerable to XSS (localStorage accessible)
   - ✅ Server validates signature

3. **CSRF Protection:**
   - ⚠️ System created but not integrated
   - ❌ No tokens in OTP requests
   - ❌ No tokens in registration

4. **Rate Limiting:**
   - ⚠️ System created but not integrated
   - ❌ No limits on OTP requests
   - ❌ Potential for abuse

### **Recommended Improvements:**

1. **Add CSRF Tokens:**
   ```javascript
   // Include in all API requests
   const token = document.querySelector('meta[name="csrf-token"]').content;
   data.append('csrf_token', token);
   ```

2. **Implement Rate Limiting:**
   ```php
   // In utils/api.php, case 'send_otp':
   RateLimiter::checkAndHandle('otp_request', $phone, 3, 3600);
   ```

3. **Add JWT Expiration Check:**
   ```javascript
   function checkAuthToken() {
       const token = localStorage.getItem('hotdeal_token');
       if (!token) return false;

       const decoded = decodeToken(token);
       // Check expiration
       if (decoded.exp && decoded.exp < Date.now() / 1000) {
           localStorage.removeItem('hotdeal_token');
           return false;
       }
       return verifyMember(decoded.ID, token);
   }
   ```

4. **Use HttpOnly Cookies (Best Practice):**
   - Move JWT from localStorage to HttpOnly cookie
   - Prevents XSS access to tokens
   - Requires server-side session management

---

## 📊 State Management

### **localStorage:**
- `hotdeal_token` - JWT token for authenticated users
- `tmp_p` - Temporary project data when not authenticated

### **sessionStorage:**
- `tmp_hotdeal_token` - Temporary JWT for new users during registration

### **Token Lifecycle:**
```
OTP Verified → sessionStorage (tmp_hotdeal_token)
                        ↓
                Register Complete
                        ↓
                localStorage (hotdeal_token)
                        ↓
                Page Refresh → checkAuthToken()
                        ↓
                Still Valid? → Continue
                Invalid/Expired → Remove token
```

---

## 🧪 Testing the Flow

### **Test Scenarios:**

1. **Existing User Login:**
   - Click unit button
   - Enter registered phone/email
   - Enter OTP
   - Should go directly to summary modal

2. **New User Registration:**
   - Click unit button
   - Enter new phone/email
   - Enter OTP
   - Fill registration form
   - Submit interest

3. **Already Logged In:**
   - Have valid token in localStorage
   - Click unit button
   - Should skip login, go to summary

4. **Token Expiration:**
   - Clear localStorage
   - Try to access protected action
   - Should redirect to login

5. **OTP Errors:**
   - Wrong OTP code
   - Expired OTP
   - Network errors

---

## 🐛 Common Issues & Solutions

### **Issue 1: "OTP not sent"**
**Cause:** External API error or rate limiting
**Solution:** Check `utils/api_debug.log`

### **Issue 2: "Invalid token"**
**Cause:** Token expired or tampered
**Solution:** Clear localStorage and re-login

### **Issue 3: "Registration fails"**
**Cause:** Missing required fields
**Solution:** Validate all form fields before submit

### **Issue 4: "Summary modal doesn't show"**
**Cause:** `tmp_p` not stored correctly
**Solution:** Check localStorage.setItem in unit button handler

---

**Last Updated:** 2025-01-29
**Version:** 1.0