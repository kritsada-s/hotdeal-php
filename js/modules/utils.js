/**
 * Utils Module
 * Helper functions and utilities used throughout the application
 */

/**
 * Decode JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token data
 */
export function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Handle UTF-8 decoding properly
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const decodedString = new TextDecoder('utf-8').decode(bytes);
  const decodedData = JSON.parse(decodedString);
  return decodedData;
}

/**
 * Show SweetAlert dialog
 * @param {string} title - Dialog title
 * @param {string} text - Dialog text
 * @param {string} icon - Icon type (success, error, warning, info)
 * @param {string} confirmButtonColor - Button color (default: '#123f6d')
 * @param {string} confirmButtonText - Button text (default: 'ตกลง')
 */
export function showSwal(title, text, icon, confirmButtonColor = '#123f6d', confirmButtonText = 'ตกลง') {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: confirmButtonColor,
    confirmButtonText: confirmButtonText
  });
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Thai phone number format (10 digits)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export function validateThaiPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

/**
 * Clear all modal inputs
 */
export function clearAllModalInput() {
  clearEmailModalInputs();
  clearOTPModalInputs();
}

/**
 * Clear email modal inputs
 */
export function clearEmailModalInputs() {
  const emailInput = document.getElementById('otp_email');
  const phoneInput = document.getElementById('otp_phone');
  if (emailInput) emailInput.value = '';
  if (phoneInput) phoneInput.value = '';
}

/**
 * Clear OTP modal inputs
 */
export function clearOTPModalInputs() {
  const otpInput = document.getElementById('otp');
  if (otpInput) otpInput.value = '';
}

/**
 * Reset request OTP button state
 */
export function resetRequestOTPBtn() {
  const requestOTPBtn = document.getElementById('requestOTPBtn');
  if (requestOTPBtn) {
    requestOTPBtn.disabled = false;
    requestOTPBtn.innerHTML = 'ส่งรหัส OTP';
  }
}

/**
 * Reset verify OTP button state
 */
export function resetVerifyOTPBtn() {
  const verifyOTPBtn = document.getElementById('verifyOTPBtn');
  if (verifyOTPBtn) {
    verifyOTPBtn.disabled = false;
    verifyOTPBtn.innerHTML = 'ยืนยันรหัส OTP';
  }
}

/**
 * Set summary submit button state
 * @param {HTMLElement} el - Button element
 * @param {string} mode - 'sending' or 'success'
 */
export function setSummarySubmitBtn(el, mode = 'sending') {
  if (!el) return;
  
  if (mode === 'sending') {
    el.disabled = true;
    const loading = el.querySelector('.loading');
    const svg = el.querySelector('svg');
    if (loading) loading.classList.remove('hidden');
    if (svg) svg.classList.add('hidden');
  } else {
    el.disabled = false;
    const loading = el.querySelector('.loading');
    const svg = el.querySelector('svg');
    if (loading) loading.classList.add('hidden');
    if (svg) svg.classList.remove('hidden');
  }
}

