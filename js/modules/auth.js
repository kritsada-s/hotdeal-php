/**
 * Auth Module
 * Handles authentication, OTP verification, and token management
 */

import { ajaxRequest } from './api.js';
import { 
  decodeToken, 
  showSwal, 
  validateEmail, 
  validateThaiPhone,
  resetRequestOTPBtn,
  resetVerifyOTPBtn,
  clearAllModalInput,
  clearOTPModalInputs
} from './utils.js';

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function checkAuthToken() {
  const token = localStorage.getItem('hotdeal_token');

  if (!token) {
    return false;
  }

  const decodedData = decodeToken(token);

  if (decodedData.ID) {
    if (verifyMember(decodedData.ID, token)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Verify member with server
 * @param {string} memberId - Member ID
 * @param {string} token - JWT token
 * @returns {boolean} True if verified
 */
export function verifyMember(memberId, token) {
  const params = {
    memberID: memberId,
    token: token,
    action: 'get_member'
  };

  // Build query string for GET request
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  try {
    ajaxRequest(
      `${window.BASE_URL}utils/api.php?${queryString}`, 
      function(response) {
        if (response.error) {
          localStorage.removeItem('hotdeal_token');
          const memberNameEl = document.getElementById('memberName');
          if (memberNameEl) memberNameEl.textContent = 'เข้าสู่ระบบ';
          return false;
        } else {
          return true;
        }
      }, 
      'GET',
      null,
      token
    );
    return true;  
  } catch (error) {
    console.log('error', error);
    return false;
  }
}

/**
 * Request OTP for phone or email
 * @param {string} contactValue - Phone number or email
 * @param {string} method - 'phone' or 'email'
 */
export function requestOTP(contactValue, method = 'phone') {
  const requestOTPBtn = document.getElementById('requestOTPBtn');
  const loginModal = document.getElementById('loginModal');
  const otpModal = document.getElementById('otpModal');
  const verifyOTPBtn = document.getElementById('verifyOTPBtn');
  
  var data = new FormData();
  
  // Validate input based on method
  if (method === 'email') {
    if (!validateEmail(contactValue)) {
      showSwal('ข้อผิดพลาด', 'รูปแบบอีเมลไม่ถูกต้อง', 'error');
      return;
    }
    data.append('email', contactValue);
  } else if (method === 'phone') {
    if (!validateThaiPhone(contactValue)) {
      showSwal('ข้อผิดพลาด', 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง', 'error');
      return;
    }
    data.append('phone', contactValue);
  }
  
  data.append('action', 'send_otp');
  data.append('method', method);

  if (requestOTPBtn) {
    requestOTPBtn.disabled = true;
    requestOTPBtn.innerHTML = 'กำลังส่งรหัส OTP...';
  }

  try {
    ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      const res = JSON.parse(response);
      if (res.status == 200) {
        // Update OTP modal title based on method
        const otpModalTitle = document.getElementById('otp-modal-title');
        const otpModalSubtitle = document.getElementById('otp-modal-subtitle');
        
        if (otpModalTitle && method === 'email') {
          otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล';
        } else if (otpModalTitle && method === 'phone') {
          otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์';
          if (otpModalSubtitle) {
            otpModalSubtitle.textContent = `รหัสอ้างอิง : ${res.data}`;
          }
        }
        
        if (loginModal) loginModal.close();
        resetRequestOTPBtn();
        resetVerifyOTPBtn();
        if (otpModal) otpModal.showModal();
        if (verifyOTPBtn) verifyOTPBtn.focus();
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
    resetRequestOTPBtn();
  }
}

/**
 * Verify OTP code
 * @param {string} contactValue - Phone number or email
 * @param {string} otp - OTP code
 * @param {string} method - 'phone' or 'email'
 */
export function verifyOTP(contactValue, otp, method = 'phone') {
  const verifyOTPBtn = document.getElementById('verifyOTPBtn');
  const otpModal = document.getElementById('otpModal');
  const registerModal = document.getElementById('registerModal');
  const summaryModal = document.getElementById('summaryModal');
  const memberName = document.getElementById('memberName');
  
  var data = new FormData();
  
  if (method === 'email') {
    data.append('email', contactValue);
  } else if (method === 'phone') {
    data.append('phone', contactValue);
  }
  
  data.append('otp', otp);
  data.append('action', 'verify_otp');
  data.append('method', method);

  if (verifyOTPBtn) {
    verifyOTPBtn.disabled = true;
    verifyOTPBtn.innerHTML = 'กำลังยืนยันรหัส OTP...';
  }

  try {
    ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      const res = JSON.parse(response);
      console.log(res);
      
      if (res.status == 400) {
        if (otpModal) otpModal.close();
        clearOTPModalInputs();
        const errorMessage = JSON.parse(res.raw_response);
        console.log(errorMessage);
        showSwal('เกิดข้อผิดพลาด', errorMessage.message, 'error');
        return;
      }

      if (res.status == 200) {
        const decodedData = decodeToken(res.data);        
        
        if (decodedData.ID) {
          // Login Success - Existing user
          localStorage.setItem('hotdeal_token', res.data);
          if (otpModal) otpModal.close();
          clearAllModalInput();
          
          showSwal('เข้าสู่ระบบสำเร็จ', '', 'success').then(() => {
            clearAllModalInput();
            if (memberName) memberName.textContent = decodedData.Firstname;
            
            // Check if user clicked from unit card
            if (localStorage.getItem('tmp_p')) {
              const project = JSON.parse(localStorage.getItem('tmp_p'));
              // Import dynamically to avoid circular dependency
              import('./modals.js').then(({ updateSummaryModal }) => {
                updateSummaryModal(decodedData, project);
                if (summaryModal) summaryModal.showModal();
              });
            }
          });
        } else {
          // Register New Member
          if (otpModal) otpModal.close();
          sessionStorage.setItem('tmp_hotdeal_token', res.data);
          
          showSwal('ยืนยันรหัส OTP สำเร็จ', '', 'success').then(() => {
            if (method === 'email') {
              const registerEmail = document.getElementById('registerEmail');
              if (registerEmail) {
                registerEmail.value = contactValue;
                registerEmail.readOnly = true;
              }
            } else if (method === 'phone') {
              const registerPhone = document.getElementById('registerPhone');
              if (registerPhone) {
                registerPhone.value = contactValue;
                registerPhone.readOnly = true;
              }
            }
            if (registerModal) registerModal.showModal();
          });
        }
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
    resetVerifyOTPBtn();
    clearOTPModalInputs();
    showSwal('เกิดข้อผิดพลาด', 'ไม่สามารถยืนยันรหัส OTP ได้', 'error');
  }
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem('hotdeal_token');
  const memberModal = document.getElementById('memberModal');
  const memberName = document.getElementById('memberName');
  
  if (memberModal) memberModal.close();
  showSwal('ออกจากระบบสำเร็จ', '', 'info');
  if (memberName) memberName.textContent = 'เข้าสู่ระบบ';
}

