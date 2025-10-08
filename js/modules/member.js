/**
 * Member Module
 * Handles member CRUD operations (Create, Read, Update, Delete)
 */

import { ajaxRequest } from './api.js';
import { decodeToken, showSwal } from './utils.js';

/**
 * Add new member (registration)
 * @param {Object} userData - User data object
 */
export function addMember(userData) {
  const memberName = document.getElementById('memberName');
  const registerModal = document.getElementById('registerModal');
  
  if (!userData.token) {
    return;
  }

  var data = new FormData();
  data.append('data', JSON.stringify(userData));
  data.append('action', 'add_member');
  
  try {
    ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      if (response.token != null) {
        localStorage.setItem('hotdeal_token', response.token);
        let user = decodeToken(response.token);
        
        if (memberName) memberName.textContent = user.Firstname;
        if (registerModal) registerModal.close();
        
        showSwal('ลงทะเบียนสำเร็จ', '', 'success');
      } else {
        showSwal('เกิดข้อผิดพลาด', response.message, 'error');
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Update existing member information
 * @param {Object} userData - User data object
 */
export function updateMember(userData) {
  const memberModal = document.getElementById('memberModal');
  
  if (!userData.token) {
    return;
  }

  var data = new FormData();
  data.append('data', JSON.stringify(userData));
  data.append('action', 'update_member');
  
  try {
    ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      localStorage.setItem('hotdeal_token', response.token);
      if (memberModal) memberModal.close();
      showSwal('อัพเดตข้อมูลสำเร็จ', '', 'success');
    }, 'POST', data);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Update member modal with user data
 * @param {Object} member - Member data
 */
export function updateMemberModal(member) {
  if (!member) {
    return;
  }

  const modalFirstName = document.getElementById('firstName');
  const modalLastName = document.getElementById('lastName');
  const modalPhone = document.getElementById('phone');
  const modalEmail = document.getElementById('email');
  const modalLineId = document.getElementById('lineId');

  if (modalFirstName) modalFirstName.value = member.Firstname;
  if (modalLastName) modalLastName.value = member.Lastname;
  if (modalPhone) modalPhone.value = member.Tel;
  if (modalEmail) modalEmail.value = member.Email;
  if (modalLineId) modalLineId.value = member.LineID;
}

/**
 * Set member name in UI
 * @param {Object} member - Member data
 */
export function setMemberName(member) {
  const memberName = document.getElementById('memberName');
  if (memberName && member.firstname) {
    memberName.textContent = member.firstname;
  }
}

