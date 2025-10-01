/**
 * Modals Module
 * Handles modal UI interactions and form submissions
 */

import { ajaxRequest } from './api.js';
import { showSwal, setSummarySubmitBtn } from './utils.js';
import { requestOTP, verifyOTP, checkAuthToken, logout } from './auth.js';
import { addMember, updateMember, updateMemberModal, setMemberName } from './member.js';
import { decodeToken } from './utils.js';

/**
 * Update summary modal with member and unit data
 * @param {Object} member - Member data
 * @param {Object} unit - Unit data
 */
export function updateSummaryModal(member, unit) {
  const summaryFirstName = document.getElementById('summaryFirstName');
  const summaryLastName = document.getElementById('summaryLastName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryPhone = document.getElementById('summaryPhone');
  const summaryLineId = document.getElementById('summaryLineId');
  const summaryProject = document.getElementById('summaryProject');
  const summaryUnit = document.getElementById('summaryUnit');
  const summaryProjectID = document.getElementById('projectID');

  if (summaryFirstName) summaryFirstName.value = member.Firstname;
  if (summaryLastName) summaryLastName.value = member.Lastname;
  if (summaryEmail) summaryEmail.value = member.Email;
  if (summaryPhone) summaryPhone.value = member.Tel;
  if (summaryLineId) summaryLineId.value = member.LineID;

  if (summaryProject) summaryProject.textContent = unit.project;
  if (summaryUnit) summaryUnit.textContent = unit.unit;
  if (summaryProjectID) summaryProjectID.value = unit.cisid;
}

/**
 * Initialize all modal event listeners
 */
export function initModalListeners() {
  const memberBtn = document.getElementById('memberBtn');
  const loginModal = document.getElementById('loginModal');
  const memberModal = document.getElementById('memberModal');
  const requestOTPBtn = document.getElementById('requestOTPBtn');
  const verifyOTPBtn = document.getElementById('verifyOTPBtn');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');
  const updateMemberBtn = document.getElementById('updateMemberBtn');
  const summarySubmitBtn = document.getElementById('summarySubmitBtn');
  const summaryCancelBtn = document.getElementById('summaryCancelBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Member button - Open login or member modal
  if (memberBtn) {
    memberBtn.addEventListener('click', function() {
      const isAuth = checkAuthToken();
      if (isAuth) {
        let user = decodeToken(localStorage.getItem('hotdeal_token'));
        if (!user.ID) {
          console.log('user not found');
        } else {
          updateMemberModal(user);
          if (memberModal) memberModal.showModal();
        }
      } else {
        if (loginModal) loginModal.showModal();
      }
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // OTP method radio button changes
  const otpMethodRadios = document.querySelectorAll('input[name="otp_method"]');
  const emailInputGroup = document.getElementById('email-input-group');
  const phoneInputGroup = document.getElementById('phone-input-group');
  const emailInput = document.getElementById('otp_email');
  const phoneInput = document.getElementById('otp_phone');

  otpMethodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'email') {
        // Show email input, hide phone input
        if (emailInputGroup) emailInputGroup.classList.remove('hidden');
        if (phoneInputGroup) phoneInputGroup.classList.add('hidden');
        if (emailInput) emailInput.required = true;
        if (phoneInput) {
          phoneInput.required = false;
          phoneInput.value = '';
        }
      } else if (this.value === 'phone') {
        // Show phone input, hide email input
        if (phoneInputGroup) phoneInputGroup.classList.remove('hidden');
        if (emailInputGroup) emailInputGroup.classList.add('hidden');
        if (phoneInput) phoneInput.required = true;
        if (emailInput) {
          emailInput.required = false;
          emailInput.value = '';
        }
      }
    });
  });

  // Request OTP button
  if (requestOTPBtn) {
    requestOTPBtn.addEventListener('click', function() {
      const selectedMethod = document.querySelector('input[name="otp_method"]:checked').value;
      let contactValue = '';
      
      if (selectedMethod === 'email') {
        contactValue = document.getElementById('otp_email').value;
      } else if (selectedMethod === 'phone') {
        contactValue = document.getElementById('otp_phone').value;
      }
      
      try {
        requestOTP(contactValue, selectedMethod);
      } catch (error) {
        console.log(error);
      }
    });
  }

  // Verify OTP button
  if (verifyOTPBtn) {
    verifyOTPBtn.addEventListener('click', function() {
      const otp = document.getElementById('otp').value;
      const selectedMethod = document.querySelector('input[name="otp_method"]:checked').value;
      let contactValue = '';
      
      if (selectedMethod === 'email') {
        contactValue = document.getElementById('otp_email').value;
      } else if (selectedMethod === 'phone') {
        contactValue = document.getElementById('otp_phone').value;
      }
      
      try {
        verifyOTP(contactValue, otp, selectedMethod);
      } catch (error) {
        console.log(error);
      }
    });
  }

  // Register submit button
  if (registerSubmitBtn) {
    registerSubmitBtn.addEventListener('click', function() {
      const registerFirstName = document.getElementById('registerFirstName');
      const registerLastName = document.getElementById('registerLastName');
      const registerPhone = document.getElementById('registerPhone');
      const registerLineId = document.getElementById('registerLineId');
      const registerEmail = document.getElementById('registerEmail');    

      const data = {
        firstname: registerFirstName.value,
        lastname: registerLastName.value,
        tel: registerPhone.value,
        lineID: registerLineId.value,
        email: registerEmail.value,
        token: sessionStorage.getItem('tmp_hotdeal_token')
      };

      try {
        addMember(data);
        
        if (localStorage.getItem('tmp_p')) {
          const project = JSON.parse(localStorage.getItem('tmp_p'));
          updateSummaryModal(data, project);
          const summaryModal = document.getElementById('summaryModal');
          if (summaryModal) summaryModal.showModal();
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  // Update member button
  if (updateMemberBtn) {
    updateMemberBtn.addEventListener('click', function() {
      const modalFirstName = document.getElementById('firstName');
      const modalLastName = document.getElementById('lastName');
      const modalPhone = document.getElementById('phone');
      const modalLineId = document.getElementById('lineId');
      const modalEmail = document.getElementById('email');

      const userData = {
        firstname: modalFirstName.value,
        lastname: modalLastName.value,
        tel: modalPhone.value,
        lineID: modalLineId.value,
        email: modalEmail.value,
        id: decodeToken(localStorage.getItem('hotdeal_token')).ID,
        token: localStorage.getItem('hotdeal_token')
      };

      try {
        updateMember(userData);
        setMemberName(userData);
      } catch (error) {
        console.log(error);
      }
    });
  }

  // Summary submit button (CIS registration)
  if (summarySubmitBtn) {
    summarySubmitBtn.addEventListener('click', function() {
      const summaryFirstName = document.getElementById('summaryFirstName');
      const summaryLastName = document.getElementById('summaryLastName');
      const summaryEmail = document.getElementById('summaryEmail');
      const summaryPhone = document.getElementById('summaryPhone');
      const summaryLineId = document.getElementById('summaryLineId');
      const summaryUnit = document.getElementById('summaryUnit');
      const summaryProjectID = document.getElementById('projectID');
      const summaryProjectName = document.getElementById('summaryProject');
      const summaryModal = document.getElementById('summaryModal');

      setSummarySubmitBtn(summarySubmitBtn, 'sending');
      
      // Create FormData to send as form data, not JSON
      const data = new FormData();
      data.append('Fname', summaryFirstName.value);
      data.append('Lname', summaryLastName.value);
      data.append('Tel', summaryPhone.value);
      data.append('Email', summaryEmail.value);
      data.append('ProjectID', summaryProjectID.value);
      data.append('LineID', summaryLineId.value);
      data.append('unitID', summaryUnit.textContent);
      data.append('projectName', summaryProjectName.textContent);
      data.append('RefID', new Date().getTime());
      data.append('Ref', "Register from AssetWise Hot Deal Website : interested in unit " + summaryUnit.textContent);

      try {
        ajaxRequest(`${window.BASE_URL}utils/cis.php`, function(response) {
          if (response.error) {
            showSwal('เกิดข้อผิดพลาด', response.message, 'error');
            if (summaryModal) summaryModal.close();
            
            if (localStorage.getItem('tmp_p')) {
              localStorage.removeItem('tmp_p');
            }
          } else {
            if (summaryModal) summaryModal.close();
            showSwal('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับการลงทะเบียน\nกรุณารอการติดต่อกลับจากโครงการ', 'success');
            setSummarySubmitBtn(summarySubmitBtn, 'success');
          }
        }, 'POST', data);
      } catch (error) {
        console.log('CIS Error:', error);
        showSwal('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อมูลได้', 'error');
        setSummarySubmitBtn(summarySubmitBtn, 'failed');
      }
    });
  }

  // Summary cancel button
  if (summaryCancelBtn) {
    summaryCancelBtn.addEventListener('click', function() {
      const summaryModal = document.getElementById('summaryModal');
      if (summaryModal) summaryModal.close();
    });
  }
}

