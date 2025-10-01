# JavaScript Modules Documentation

This directory contains modular JavaScript code for the AssetWise Hot Deal application. The code has been refactored from a single 1191-line file into maintainable, focused modules.

## 📁 Module Structure

```
/js/
├── script.js               # Main entry point (orchestration)
└── modules/
    ├── README.md          # This file
    ├── api.js             # AJAX requests & API calls
    ├── auth.js            # Authentication & OTP handling
    ├── carousel.js        # Swiper carousel initialization
    ├── member.js          # Member CRUD operations
    ├── modals.js          # Modal UI interactions
    ├── units.js           # Unit listing & filtering
    └── utils.js           # Helper functions & utilities
```

## 📦 Module Descriptions

### **script.js** (Main Entry Point)
**Purpose:** Orchestrates all modules and initializes the application

**Functions:**
- `initAuthState()` - Initialize authentication and update UI
- `initUnitFunctionality()` - Set up unit-related features
- `initAnimations()` - Initialize Anime.js animations

**Dependencies:** All modules

---

### **utils.js** (Utilities)
**Purpose:** Common helper functions used throughout the application

**Exports:**
- `decodeToken(token)` - Decode JWT token
- `showSwal(title, text, icon, ...)` - Show SweetAlert dialog
- `validateEmail(email)` - Validate email format
- `validateThaiPhone(phone)` - Validate Thai phone number
- `clearAllModalInput()` - Clear all modal inputs
- `clearEmailModalInputs()` - Clear email modal inputs
- `clearOTPModalInputs()` - Clear OTP modal inputs
- `resetRequestOTPBtn()` - Reset request OTP button state
- `resetVerifyOTPBtn()` - Reset verify OTP button state
- `setSummarySubmitBtn(el, mode)` - Set summary submit button state

**Dependencies:** None

---

### **api.js** (API Communication)
**Purpose:** Handle all AJAX requests and API communications

**Exports:**
- `ajaxRequest(url, callback, method, data, token)` - Generic AJAX function
- `fetchUnits(params, callback)` - Fetch units from API
- `getProjectName(projectCode)` - Get project name by code
- `getCmpUtmByID(cmpID)` - Get campaign UTM by ID

**Dependencies:** None

**API Endpoints:**
- `GET /utils/api.php?action=get_units` - Fetch units
- `GET /utils/api.php?action=get_project_name` - Get project name
- `GET /utils/api.php?action=get_cmp_utm_by_id` - Get campaign UTM

---

### **auth.js** (Authentication)
**Purpose:** Handle authentication, OTP verification, and token management

**Exports:**
- `checkAuthToken()` - Check if user is authenticated
- `verifyMember(memberId, token)` - Verify member with server
- `requestOTP(contactValue, method)` - Request OTP for phone/email
- `verifyOTP(contactValue, otp, method)` - Verify OTP code
- `logout()` - Logout user

**Dependencies:** 
- `api.js` - For AJAX requests
- `utils.js` - For helper functions
- `modals.js` - For updateSummaryModal (dynamic import)

**Storage:**
- `localStorage.hotdeal_token` - JWT token for authenticated users
- `sessionStorage.tmp_hotdeal_token` - Temporary token for registration
- `localStorage.tmp_p` - Temporary project data

---

### **member.js** (Member Management)
**Purpose:** Handle member CRUD operations

**Exports:**
- `addMember(userData)` - Register new member
- `updateMember(userData)` - Update existing member
- `updateMemberModal(member)` - Populate member modal with data
- `setMemberName(member)` - Update member name in UI

**Dependencies:**
- `api.js` - For AJAX requests
- `utils.js` - For helper functions

**API Endpoints:**
- `POST /utils/api.php?action=add_member` - Add new member
- `POST /utils/api.php?action=update_member` - Update member
- `GET /utils/api.php?action=get_member` - Get member data

---

### **modals.js** (Modal Interactions)
**Purpose:** Handle all modal UI interactions and form submissions

**Exports:**
- `updateSummaryModal(member, unit)` - Update summary modal with data
- `initModalListeners()` - Initialize all modal event listeners

**Event Listeners:**
- Member button click (login/member modal)
- Logout button click
- OTP method radio changes
- Request OTP button click
- Verify OTP button click
- Register submit button click
- Update member button click
- Summary submit button click (CIS registration)
- Summary cancel button click

**Dependencies:**
- All other modules (orchestrates interactions)

**CIS Integration:**
- `POST /utils/cis.php` - Submit lead to CIS system

---

### **units.js** (Unit Listing)
**Purpose:** Handle unit rendering, filtering, and search functionality

**Exports:**
- `unitBox(unit, nameMap, cmpUtm)` - Generate unit card HTML
- `attachUnitButtonEvents()` - Attach click events to unit buttons
- `initUnitFilters()` - Initialize filtering and search
- `initLocationDropdown()` - Initialize location dropdown
- `initProjectsDropdown()` - Initialize projects dropdown
- `initSortingDropdown()` - Initialize sorting dropdown

**Features:**
- Unit card rendering with dynamic data
- Project filtering
- Location filtering
- Sorting (price, date, etc.)
- Search by unit code
- Smooth animations on filter changes

**Dependencies:**
- `api.js` - For fetching units
- `auth.js` - For authentication checks
- `utils.js` - For helper functions
- `modals.js` - For summary modal

---

### **carousel.js** (Carousels)
**Purpose:** Initialize Swiper carousels for banners and galleries

**Exports:**
- `initHeroBanners()` - Initialize hero banner carousels
- `initUnitDetailGalleries()` - Initialize unit detail page galleries

**Features:**
- Responsive desktop/mobile banner switching
- Unit detail main gallery
- Facility thumbnail gallery with sync

**Dependencies:** 
- Swiper.js (external library)

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION                                           │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  script.js (Main Entry Point)                               │
│  - Initializes all modules on DOM ready                     │
│  - Sets up authentication state                             │
│  - Orchestrates module interactions                         │
└───────────────┬─────────────────────────────────────────────┘
                │
                ├──────────────┬────────────┬─────────────┬────────────┐
                ▼              ▼            ▼             ▼            ▼
          ┌─────────┐    ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐
          │ auth.js │    │units.js │  │modals.js│  │member.js │  │carousel.js│
          │         │    │         │  │         │  │          │  │          │
          │ - OTP   │    │ - List  │  │ - Forms │  │ - CRUD   │  │ - Swiper │
          │ - Login │    │ - Filter│  │ - Events│  │ - Update │  │ - Banners│
          └────┬────┘    └────┬────┘  └────┬────┘  └────┬─────┘  └──────────┘
               │              │            │            │
               └──────────────┴────────────┴────────────┘
                              │
                              ▼
                        ┌──────────┐
                        │ api.js   │
                        │ - AJAX   │
                        │ - Fetch  │
                        └────┬─────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ External APIs   │
                    │ - AssetWise API │
                    │ - CIS System    │
                    └─────────────────┘
```

## 🛠️ Development Guidelines

### **Adding New Features**

1. **Determine the appropriate module** based on feature type
2. **Add the function** to the module with JSDoc comments
3. **Export the function** if it needs to be used in other modules
4. **Import in script.js** if initialization is needed
5. **Update this README** with the new function

### **Module Import/Export Pattern**

```javascript
// In module file (e.g., utils.js)
export function myFunction(param) {
  // Implementation
}

// In script.js or other module
import { myFunction } from './modules/utils.js';
```

### **Avoiding Circular Dependencies**

⚠️ **Important:** Be careful with circular imports!

**Example of circular dependency issue:**
```javascript
// auth.js imports modals.js
// modals.js imports auth.js
// ❌ This creates a circular dependency
```

**Solution:** Use dynamic imports when needed
```javascript
// In auth.js
import('./modals.js').then(({ updateSummaryModal }) => {
  updateSummaryModal(data, project);
});
```

### **Code Style**

- ✅ Use ES6+ features (arrow functions, const/let, template literals)
- ✅ Add JSDoc comments for all exported functions
- ✅ Use meaningful variable and function names
- ✅ Keep functions focused and single-purpose
- ✅ Handle errors gracefully with try-catch
- ✅ Use null checks before DOM manipulation
- ✅ Prefer `textContent` over `innerHTML` for security (XSS prevention)

### **Testing Changes**

After making changes, test:

1. ✅ User authentication flow (OTP login)
2. ✅ New member registration
3. ✅ Unit listing and filtering
4. ✅ Project and location dropdowns
5. ✅ Search functionality
6. ✅ Interest button → Summary modal → CIS submission
7. ✅ Member profile update
8. ✅ Banner carousels
9. ✅ Unit detail page galleries

---

## 📊 File Size Comparison

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| **script.js** | 1,191 lines | 97 lines | **91.9%** ↓ |
| **Total (with modules)** | 1,191 lines | ~1,300 lines | +9% (better organized) |

**Benefits:**
- ✅ **Maintainability:** Each module has a single responsibility
- ✅ **Readability:** Easier to find and understand code
- ✅ **Reusability:** Functions can be imported where needed
- ✅ **Testability:** Modules can be tested independently
- ✅ **Collaboration:** Multiple developers can work on different modules
- ✅ **Debugging:** Easier to isolate issues

---

## 🔐 Security Notes

### **XSS Prevention**
- Use `textContent` instead of `innerHTML` when setting user data
- All user input is validated before processing
- Output is sanitized in PHP backend

### **CSRF Protection**
- ⚠️ **TODO:** Integrate CSRF tokens in AJAX requests
- CSRF module exists in `/utils/csrf.php` but not yet integrated

### **Rate Limiting**
- ⚠️ **TODO:** Integrate rate limiting in OTP requests
- RateLimiter class exists in `/utils/rate-limiter.php`

---

## 📝 Change Log

**2025-10-01 - Initial Modular Refactoring**
- ✅ Split 1,191-line script.js into 7 focused modules
- ✅ Created utils.js for common utilities
- ✅ Created api.js for API communications
- ✅ Created auth.js for authentication logic
- ✅ Created member.js for member management
- ✅ Created modals.js for UI interactions
- ✅ Created units.js for unit listing features
- ✅ Created carousel.js for Swiper initialization
- ✅ Refactored main script.js as orchestrator

---

## 🚀 Future Improvements

### **Phase 1: Security (High Priority)**
- [ ] Integrate CSRF tokens in all AJAX requests
- [ ] Implement rate limiting on OTP endpoints
- [ ] Add JWT expiration check on client-side
- [ ] Replace all `innerHTML` with `textContent` or DOMPurify

### **Phase 2: Features (Medium Priority)**
- [ ] Add OTP resend functionality
- [ ] Implement "Remember Me" option
- [ ] Add loading states and animations
- [ ] Implement input masking for phone numbers

### **Phase 3: Advanced (Low Priority)**
- [ ] Add unit testing with Jest
- [ ] Implement refresh token system
- [ ] Add biometric authentication (WebAuthn)
- [ ] Add social login options

---

**Last Updated:** October 1, 2025  
**Maintained By:** Development Team  
**Version:** 2.0.0 (Modular Architecture)

