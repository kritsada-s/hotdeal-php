import { animate, stagger, utils, onScroll } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

// Function to make AJAX requests
function ajaxRequest(url, callback, method = 'GET', data = null, token = null) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  // Set appropriate headers based on data type
  if (method === 'POST') {
    if (data instanceof FormData) {
      // Don't set Content-Type for FormData, browser will handle it
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          callback(response);
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          callback({ error: true, message: 'Invalid JSON response' });
        }
      } else {
        console.error('Request failed with status:', xhr.status, 'URL:', url);
        callback({ error: true, message: `Request failed: ${xhr.status}` });
      }
    }
  };

  xhr.onerror = function() {
    console.error('Request failed');
    callback({ error: true, message: 'Network error occurred' });
  };

  // Send the request with appropriate data
  if (data instanceof FormData) {
    xhr.send(data);
  } else if (data) {
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }
}

// Function to fetch units using the API
function fetchUnits(params = {}, callback) {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  ajaxRequest(`${window.BASE_URL}utils/api.php?action=get_units&${queryString}`, callback);
}

function checkLogin() {
  const token = localStorage.getItem('token');
  //console.log(token);
}

function decodeToken(token) {
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
function getProjectName(projectCode) {
  return new Promise((resolve) => {
    const qs = `action=get_project_name&projectID=${encodeURIComponent(projectCode)}`;
    ajaxRequest(`${window.BASE_URL}utils/api.php?${qs}`, function(res) {
      const name = (res && res.data && res.data.projectNameTH) || projectCode;
      resolve(name);
    }, 'GET');
  });
}

function getCmpUtmByID(cmpID) {
  return new Promise((resolve) => {
    const qs = `action=get_cmp_utm_by_id&cmpID=${encodeURIComponent(cmpID)}`;
    ajaxRequest(`${window.BASE_URL}utils/api.php?${qs}`, function(res) {
      resolve(res);
    }, 'GET');
  });
}


function verifyMember(memberId, token) {
  const params = {
    memberID: memberId,
    token: token,
    action: 'get_member'
  }

  // Build query string for GET request
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  try {
    const response = ajaxRequest(
      `${window.BASE_URL}utils/api.php?${queryString}`, 
      function(response) {
        if (response.error) {
          localStorage.removeItem('hotdeal_token');
          document.getElementById('memberName').innerHTML = 'เข้าสู่ระบบ';
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

// Handle case user are deleted
function addMember(userData) {
  //console.log(userData);
  if (!userData.token) {
    return;
  }

  var data = new FormData();
  data.append('data', JSON.stringify(userData));
  data.append('action', 'add_member');
  
  try {
    const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      //console.log(response);
      if (response.token != null) {
        localStorage.setItem('hotdeal_token', response.token);
        let user = decodeToken(response.token);
        memberName.innerHTML = user.Firstname;
        registerModal.close();
        Swal.fire({
          title: 'ลงทะเบียนสำเร็จ',
          icon: 'success',
          confirmButtonColor: '#123f6d',
          confirmButtonText: 'ตกลง'
        });
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: response.message,
          icon: 'error',
        });
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
  }
}

function updateMember(userData) {
  if (!userData.token) {
    return;
  }

  var data = new FormData();
  data.append('data', JSON.stringify(userData));
  data.append('action', 'update_member');
  
  try {
    const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      //console.log(response.token);
      localStorage.setItem('hotdeal_token', response.token);
      memberModal.close();
      Swal.fire({
        title: 'อัพเดตข้อมูลสำเร็จ',
        icon: 'success',
        confirmButtonColor: '#123f6d',
        confirmButtonText: 'ตกลง'
      });
    }, 'POST', data);
  } catch (error) {
    console.log(error);
  }
}

function checkAuthToken() {
  const token = localStorage.getItem('hotdeal_token');

  if (!token) {
    return false;
  }

  const decodedData = decodeToken(token);

  if (decodedData.ID) {
    //console.log('verifyMember');
    if (verifyMember(decodedData.ID, token)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function showSwal(title, text, icon, confirmButtonColor, confirmButtonText) {
  if (confirmButtonColor == null) {
    confirmButtonColor = '#123f6d';
  }
  if (confirmButtonText == null) {
    confirmButtonText = 'ตกลง';
  }
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: confirmButtonColor,
    confirmButtonText: confirmButtonText
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const loadingAnimation = document.getElementById('loadingAnimation');
  const unitsContainer = document.getElementById('unitsContainer');
  const memberBtn = document.getElementById('memberBtn');
  //const unitBtn = document.querySelectorAll('.unitBtn');
  const memberModal = document.getElementById('memberModal');
  const loginModal = document.getElementById('loginModal');
  const otpModal = document.getElementById('otpModal');
  const summaryModal = document.getElementById('summaryModal');
  const requestOTPBtn = document.getElementById('requestOTPBtn');
  const verifyOTPBtn = document.getElementById('verifyOTPBtn');
  const registerModal = document.getElementById('registerModal');
  const logoutBtn = document.getElementById('logoutBtn');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');
  const updateMemberBtn = document.getElementById('updateMemberBtn');
  const summarySubmitBtn = document.getElementById('summarySubmitBtn');
  const summaryCancelBtn = document.getElementById('summaryCancelBtn');
  const modalFirstName = document.getElementById('firstName');
  const modalLastName = document.getElementById('lastName');
  const modalPhone = document.getElementById('phone');
  const modalLineId = document.getElementById('lineId');
  const modalEmail = document.getElementById('email');

  const desktopBanner = document.getElementById('desktopBanner');
  const mobileBanner = document.getElementById('mobileBanner');

  const memberName = document.getElementById('memberName');
  const sortingForm = document.getElementById('sortingForm');
  const unitsListed = document.getElementById('unitsListed');
  const searchForm = document.getElementById('searchForm');
  const sortingUnit = document.getElementById('sortingUnit');
  const projectSelector = document.getElementById('project_selector');

  function attachUnitButtonEvents() {
    const unitBtn = document.querySelectorAll('.unitBtn');
    unitBtn.forEach(btn => {
      btn.addEventListener('click', function() {
      //console.log('clicked', btn);
      const isAuth = checkAuthToken();
      let project = {
        cisid: btn.dataset.cisid,
        project: btn.dataset.project,
        unit: btn.dataset.unit,
        utm: btn.dataset.utmCmp,
      }
      if (isAuth) {
        let user = decodeToken(localStorage.getItem('hotdeal_token'));
        updateSummaryModal(user, project);
        summaryModal.showModal();
      } else {
        localStorage.setItem('tmp_p', JSON.stringify(project));
        loginModal.showModal();
      }
      });
    });
  }

  function unitBox(unit, nameMap, cmpUtm) {
    return `
      <div class="rounded-lg overflow-hidden shadow-lg border border-neutral-200 relative">
        ${unit.isSoldOut ? `<span class="text-white text-[12px] lg:text-xl font-medium flex items-center justify-center px-5 py-2 w-full bg-red-500 rotate-45 absolute top-[20px] lg:top-[10%] left-[40px] lg:left-[30%]">SOLD OUT</span>` : ''}
        <div class="unit-wrapper ${unit.isSoldOut ? 'sold-out' : ''}">
          <a href="${window.BASE_URL}unit/?id=${unit.id}">
            <img src="https://aswservice.com/hotdeal/${unit.headerImage.resource.filePath}" class="w-full aspect-square object-cover">
          </a>
          <div class="unit-detail px-2 py-3 lg:px-4 lg:py-6 relative">
            ${unit.highlightText ? `<div class="bg-accent text-[10px] lg:text-[16px] lg:mb-2 text-white font-medium px-3 py-1 lg:px-5 lg:py-2 rounded-full absolute -top-3 -lg:top-5 right-3 lg:right-5">${unit.highlightText}</div>` : ''}
            <p class="text-[#00a9a5] mb-2 lg:font-medium text-[11px] lg:text-base">${unit.projectName}</p>
            <h3 class="leading-none font-medium mb-2 text-[18px] lg:text-3xl">${unit.unitCode}</h3>
            <p class="text-primary">
              <span class="text-neutral-500 relative line-through text-[10px] lg:text-xl">ปกติ ${(unit.sellingPrice/1000000).toFixed(2)} ล้าน</span>
            </p>
            <p class="text-primary mb-4 lg:mb-7">
              <span class="text-accent text-[14px] lg:text-xl">พิเศษ</span> <span class="text-accent font-bold text-[18px] lg:text-4xl">${(unit.discountPrice/1000000).toFixed(2)}</span> <span class="text-accent text-[16px] lg:text-xl">ล้าน</span>
            </p>
            <div class="btn-group flex flex-col lg:flex-row justify-between lg:items-center gap-4 lg:gap-0">
              <a href="${window.BASE_URL}unit/?id=${unit.id}" class="text-neutral-500 hover:text-neutral-800 text-[12px] lg:text-base font-light">ดูรายละเอียด</a>
              <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2 hover:shadow-lg transition-all duration-300 text-[14px] lg:text-base" data-unit="${unit.unitCode}" data-project="${nameMap[unit.projectID] ?? unit.projectID}" data-cisid="${unit.projectCode}" data-utm-cmp="${cmpUtm}">สนใจยูนิตนี้</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachUnitButtonEvents();

  if (checkAuthToken()) {
    let user = decodeToken(localStorage.getItem('hotdeal_token'));
    //console.log(user.Firstname);
    memberName.innerHTML = user.Firstname;
  } else {
    memberName.innerHTML = 'เข้าสู่ระบบ';
  }

  function clearAllModalInput() {
    clearEmailModalInputs();
    clearOTPModalInputs();
  }

  function clearEmailModalInputs() {
    document.getElementById('otp_email').value = '';
    document.getElementById('otp_phone').value = '';
  } 

  function resetRequestOTPBtn() {
    requestOTPBtn.disabled = false;
    requestOTPBtn.innerHTML = 'ส่งรหัส OTP';
  }

  function clearOTPModalInputs() {
    document.getElementById('otp').value = '';
  }

  function resetVerifyOTPBtn() {
    verifyOTPBtn.disabled = false;
    verifyOTPBtn.innerHTML = 'ยืนยันรหัส OTP';
  }
  
  function requestOTP(contactValue, method = 'phone') {
    //console.log('--- requestOTP ---');
    
    var data = new FormData();
    
    // Validate input based on method
    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue)) {
        return;
      }
      data.append('email', contactValue);
    } else if (method === 'phone') {
      // Basic phone validation (Thai phone numbers)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(contactValue.replace(/[-\s]/g, ''))) {
        return;
      }
      data.append('phone', contactValue);
    }
    
    data.append('action', 'send_otp');
    data.append('method', method);

    requestOTPBtn.disabled = true;
    requestOTPBtn.innerHTML = 'กำลังส่งรหัส OTP...';
  
    try {
      const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
        const res = JSON.parse(response);
        if (res.status == 200) {
          // Update OTP modal title based on method
          const otpModalTitle = document.getElementById('otp-modal-title');
          const otpModalSubtitle = document.getElementById('otp-modal-subtitle');
          if (method === 'email') {
            otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล';
          } else if (method === 'phone') {
            otpModalTitle.textContent = 'กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์';
            otpModalSubtitle.textContent = `รหัสอ้างอิง : ${res.data}`;
          }
          
          loginModal.close();
          resetRequestOTPBtn();
          resetVerifyOTPBtn();
          otpModal.showModal();
          verifyOTPBtn.focus();
        }
      }, 'POST', data);
    } catch (error) {
      console.log(error);
      resetRequestOTPBtn();
    }
  }

  function verifyOTP(contactValue, otp, method = 'phone') {
    //console.log('--- verifyOTP ---');
    
    var data = new FormData();
    
    if (method === 'email') {
      data.append('email', contactValue);
    } else if (method === 'phone') {
      data.append('phone', contactValue);
    }
    
    data.append('otp', otp);
    data.append('action', 'verify_otp');
    data.append('method', method);

    verifyOTPBtn.disabled = true;
    verifyOTPBtn.innerHTML = 'กำลังยืนยันรหัส OTP...';

    try {
      const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
        const res = JSON.parse(response);
        console.log(res);
        if (res.status == 400) {
          otpModal.close();
          clearOTPModalInputs();
          const errorMessage = JSON.parse(res.raw_response);
          console.log(errorMessage);
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: errorMessage.message,
            icon: 'error',
            confirmButtonColor: '#123f6d',
            confirmButtonText: 'ตกลง',
            customClass: {
              title: 'text-xl'
            }
          });
          return;
        }

        if (res.status == 200) {
          const decodedData = decodeToken(res.data);        
          if (decodedData.ID) {
            // Login Success
            localStorage.setItem('hotdeal_token', res.data);
            otpModal.close();
            clearAllModalInput();
            Swal.fire({
              title: 'เข้าสู่ระบบสำเร็จ',
              icon: 'success',
              confirmButtonColor: '#123f6d',
              confirmButtonText: 'ตกลง'
            }).then(() => {
              clearAllModalInput();
              memberName.innerHTML = decodedData.Firstname;
              if (localStorage.getItem('tmp_p')) {
                const project = JSON.parse(localStorage.getItem('tmp_p'));
                updateSummaryModal(decodedData, project);
                summaryModal.showModal();
              }
            });
          } else {
            // Register New Member
            otpModal.close();
            sessionStorage.setItem('tmp_hotdeal_token', res.data);
            Swal.fire({
              title: 'ยืนยันรหัส OTP สำเร็จ',
              icon: 'success',
              confirmButtonColor: '#123f6d',
              confirmButtonText: 'ตกลง'
            }).then(() => {
              if (method === 'email') {
                document.getElementById('registerEmail').value = contactValue;
                document.getElementById('registerEmail').readOnly = true;
              } else if (method === 'phone') {
                document.getElementById('registerPhone').value = contactValue;
                document.getElementById('registerPhone').readOnly = true;
              }
              registerModal.showModal();
            });
          }
        }
      }, 'POST', data);
    } catch (error) {
      console.log(error);
      resetVerifyOTPBtn();
      clearOTPModalInputs();
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันรหัส OTP ได้',
        icon: 'error',
        confirmButtonColor: '#123f6d',
        confirmButtonText: 'ตกลง'
      });
    }
  }

  // check is this function is used?
  function updateMemberModal(member) {
    if (!member) {
      return;
    }

    //console.log(member);
  
    modalFirstName.value = member.Firstname;
    modalLastName.value = member.Lastname;
    modalPhone.value = member.Tel;
    modalEmail.value = member.Email;
    modalLineId.value = member.LineID;
  }

  function setMemberName(member) {
    memberName.innerHTML = member.firstname;
  }

  function updateSummaryModal(member, unit) {
    //console.log(unit.project);
    const summaryFirstName = document.getElementById('summaryFirstName');
    const summaryLastName = document.getElementById('summaryLastName');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');
    const summaryLineId = document.getElementById('summaryLineId');
    const summaryProject = document.getElementById('summaryProject');
    const summaryUnit = document.getElementById('summaryUnit');
    const summaryProjectID = document.getElementById('projectID');
    //const summaryCISId = document.getElementById('summaryCISId');

    summaryFirstName.value = member.Firstname;
    summaryLastName.value = member.Lastname;
    summaryEmail.value = member.Email;
    summaryPhone.value = member.Tel;
    summaryLineId.value = member.LineID;

    summaryProject.innerHTML = unit.project;
    summaryUnit.innerHTML = unit.unit;
    summaryProjectID.value = unit.cisid;
    //summaryCISId.innerHTML = unit.cisid;
  }

  const args = {
    loop: true,
    autoHeight: true,
    // autoplay: {
    //   delay: 6000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  }

  if (desktopBanner && mobileBanner) {
    if (window.innerWidth >= 768) {
      mobileBanner.style.display = 'none';
      new Swiper(desktopBanner, args);
    } else {
      desktopBanner.style.display = 'none';
      new Swiper(mobileBanner, args);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mobileBanner.style.display = 'none';
        desktopBanner.style.display = 'block';
        new Swiper(desktopBanner, args);
      } else {
        desktopBanner.style.display = 'none';
        mobileBanner.style.display = 'block';
        new Swiper(mobileBanner, args);
      }
    });
  }

  memberBtn.addEventListener('click', function() {
    const isAuth = checkAuthToken();
    if (isAuth) {
      let user = decodeToken(localStorage.getItem('hotdeal_token'));
      if (!user.ID) {
        console.log('user not found');
      } else {
        updateMemberModal(user);
        memberModal.showModal();
      }
    } else {
      loginModal.showModal();
    }
  });

  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('hotdeal_token');
    memberModal.close();
    Swal.fire({
      title: 'ออกจากระบบสำเร็จ',
      icon: 'info',
      confirmButtonColor: '#123f6d',
      confirmButtonText: 'ตกลง'
    });
  memberName.innerHTML = 'เข้าสู่ระบบ';
});

  // Handle OTP method radio button changes
  const otpMethodRadios = document.querySelectorAll('input[name="otp_method"]');
  const emailInputGroup = document.getElementById('email-input-group');
  const phoneInputGroup = document.getElementById('phone-input-group');
  const emailInput = document.getElementById('otp_email');
  const phoneInput = document.getElementById('otp_phone');

  otpMethodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'email') {
        // Show email input, hide phone input
        emailInputGroup.classList.remove('hidden');
        phoneInputGroup.classList.add('hidden');
        emailInput.required = true;
        phoneInput.required = false;
        phoneInput.value = ''; // Clear phone input
      } else if (this.value === 'phone') {
        // Show phone input, hide email input
        phoneInputGroup.classList.remove('hidden');
        emailInputGroup.classList.add('hidden');
        phoneInput.required = true;
        emailInput.required = false;
        emailInput.value = ''; // Clear email input
      }
    });
  });

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
    }

    try {
      addMember(data);
      if (localStorage.getItem('tmp_p')) {
        const project = JSON.parse(localStorage.getItem('tmp_p'));
        updateSummaryModal(data, project);
        summaryModal.showModal();
      }
    } catch (error) {
      console.log(error);
    }
  });

  updateMemberBtn.addEventListener('click', function() {
    const userData = {
      firstname: modalFirstName.value,
      lastname: modalLastName.value,
      tel: modalPhone.value,
      lineID: modalLineId.value,
      email: modalEmail.value,
      id: decodeToken(localStorage.getItem('hotdeal_token')).ID,
      token: localStorage.getItem('hotdeal_token')
    }

    try {
      updateMember(userData);
      setMemberName(userData);
    } catch (error) {
      console.log(error);
    }
  });

  function setSummarySubmitBtn(el, mode = 'sending') {
    if (mode == 'sending') {
      el.disabled = true;
      el.querySelector('.loading').classList.remove('hidden');
      el.querySelector('svg').classList.add('hidden');
    } else {
      el.disabled = false;
      el.querySelector('.loading').classList.add('hidden');
      el.querySelector('svg').classList.remove('hidden');
    }
  }

  summarySubmitBtn.addEventListener('click', function() {
    const summaryFirstName = document.getElementById('summaryFirstName');
    const summaryLastName = document.getElementById('summaryLastName');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');
    const summaryLineId = document.getElementById('summaryLineId');
    const summaryUnit = document.getElementById('summaryUnit').innerHTML;
    const summaryProjectID = document.getElementById('projectID').value;
    const summaryProjectName = document.getElementById('summaryProject').innerHTML;

    setSummarySubmitBtn(summarySubmitBtn, 'sending');
    
    // Create FormData to send as form data, not JSON
    const data = new FormData();
    data.append('Fname', summaryFirstName.value);
    data.append('Lname', summaryLastName.value);
    data.append('Tel', summaryPhone.value);
    data.append('Email', summaryEmail.value);
    data.append('ProjectID', summaryProjectID);
    data.append('LineID', summaryLineId.value);
    data.append('unitID', summaryUnit); // Fixed field name
    data.append('projectName', summaryProjectName);
    data.append('RefID', new Date().getTime()); // Using unit as RefID
    data.append('Ref', "Register from AssetWise Hot Deal Website : interested in unit " + summaryUnit);

    // console.log('Sending CIS data:', {
    //   Fname: summaryFirstName.value,
    //   Lname: summaryLastName.value,
    //   Tel: summaryPhone.value,
    //   Email: summaryEmail.value,
    //   ProjectID: summaryProjectID,
    //   unitID: summaryUnit,
    //   RefID: new Date().getTime(),
    //   Ref: "Register from AssetWise Hot Deal Website : interested in unit " + summaryUnit
    // });

    try {
      const response = ajaxRequest(`${window.BASE_URL}utils/cis.php`, function(response) {
        //console.log('CIS Response:', response);
        if (response.error) {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: response.message,
            icon: 'error',
            confirmButtonColor: '#123f6d',
            confirmButtonText: 'ตกลง'
          });
          summaryModal.close();
          if (localStorage.getItem('tmp_p')) {
            localStorage.removeItem('tmp_p');
          }
        } else {
          summaryModal.close();
          showSwal('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับการลงทะเบียน\nกรุณารอการติดต่อกลับจากโครงการ', 'success', '#123f6d', 'ตกลง');
          setSummarySubmitBtn(summarySubmitBtn, 'success');
        }
      }, 'POST', data);
    } catch (error) {
      console.log('CIS Error:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งข้อมูลได้',
        icon: 'error',
        confirmButtonColor: '#123f6d',
        confirmButtonText: 'ตกลง'
      });
      setSummarySubmitBtn(summarySubmitBtn, 'failed');
    }
  });

  summaryCancelBtn.addEventListener('click', function() {
    summaryModal.close();
  });

  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const search = document.getElementById('searchUnit').value;
      if (search) {
        fetchUnits({
          searchStr: search
        }, async function(response) {
          if (response.data && response.data.units && response.data.units.length > 0) {
            const unitsContainer = document.getElementById('unitsContainer');
            unitsContainer.innerHTML = '';
            // Prefetch project names
            const ids = [...new Set(response.data.units.map(u => u.projectID))];
            const nameMap = Object.fromEntries(await Promise.all(ids.map(async id => [id, await getProjectName(id)])));

            response.data.units.forEach(unit => {
              const unitBox = `
                <div class="${unit.isSoldOut ? 'grayscale' : ''} unit rounded-lg overflow-hidden shadow-lg border border-neutral-200">
                  ${unit.isSoldOut ? `<div class="absolute top-0 left-0 w-full h-full bg-neutral-900/40 flex items-center justify-center z-[1]">
                    <span class="text-white text-2xl font-medium flex items-center justify-center px-5 py-2 w-full h-20 bg-red-500">SOLD OUT</span>
                  </div>` : ''}
                  <img src="https://aswservice.com/hotdeal/${unit.headerImage.resource.filePath}" class="w-full aspect-square object-cover">
                  <div class="unit-detail px-4 py-6 relative">
                    ${unit.highlightText ? `<div class="bg-accent text-[18px] mb-2 text-white font-medium px-5 py-2 rounded-full absolute -top-5 right-5">${unit.highlightText}</div>` : ''}
                    <p class="text-primary mb-2">${unit.projectName}</p>
                    <h3 class="leading-none font-medium text-3xl">${unit.unitCode}</h3>
                    <p class="text-primary mb-7">
                      <span class="text-neutral-500 relative line-through">ปกติ ${(unit.sellingPrice/1000000).toFixed(2)} ล้าน</span>
                      <span class="text-accent text-3xl">พิเศษ</span> <span class="text-accent font-medium text-5xl">${(unit.discountPrice/1000000).toFixed(2)}</span> <span class="text-accent text-3xl">ล้าน</span>
                    </p>
                    <div class="btn-group flex justify-between items-center">
                      <a href="${window.BASE_URL}unit/?id=${unit.id}" class="text-neutral-500 hover:text-neutral-800 font-light">ดูรายละเอียด</a>
                      <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2" data-unit="${unit.unitCode}" data-project="${nameMap[unit.projectID] ?? unit.projectID}" data-cisid="${unit.projectID}" data-utm-cmp="${cmpUtm}">สนใจยูนิตนี้</button>
                    </div>
                  </div>
                </div>
              `;
              unitsContainer.appendChild(unitBox);
            });
            
            // Re-attach event listeners to new unit buttons
            //attachUnitButtonEvents();
          } else {
            // Show no data message
            const unitsContainer = document.getElementById('unitsContainer');
            unitsContainer.innerHTML = `
              <div class="flex flex-col items-center justify-center gap-5 min-h-[500px] col-span-full">
                <img src="${window.BASE_URL}/images/warning-o.webp" alt="no data" class="w-[140px]">
                <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
                <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
              </div>
            `;
          }
        });
      }
    });
  }

  if (sortingUnit) {
    sortingUnit.addEventListener('change', async function() {
      const sort = sortingUnit.value;
      const project = projectSelector.value;
      const locations = locationInput.value;

      unitsContainer.style.opacity = '0';
      unitsContainer.style.transform = 'translateY(20px)';
      unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      loadingAnimation.style.display = 'flex';
      fetchUnits({
        sortingUnit: sort,
        projectIDs: project,
        locationIDs: locations
      }, async function(response) {
        loadingAnimation.style.display = 'none';
        console.log('response', response);
        if (response.data && response.data.units && response.data.units.length > 0) {
          unitsContainer.innerHTML = '';
          // Prefetch project names
          const ids = [...new Set(response.data.units.map(u => u.projectID))];
          const nameMap = Object.fromEntries(await Promise.all(ids.map(async id => [id, await getProjectName(id)])));

          response.data.units.forEach(async unit => {
            const cmpUtm = await getCmpUtmByID(unit.campaignID);
            const unitBoxHtml = unitBox(unit, nameMap, cmpUtm);
            unitsContainer.innerHTML += unitBoxHtml;
          });

          setTimeout(() => {
            unitsContainer.style.opacity = '1';
            unitsContainer.style.transform = 'translateY(0)';
          }, 50);
          
          // Re-attach event listeners to new unit buttons
          //attachUnitButtonEvents();
        } else {
          // Show no data message
          const unitsContainer = document.getElementById('unitsContainer');
          unitsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-5 min-h-[500px] col-span-full">
              <img src="${window.BASE_URL}/images/warning-o.webp" alt="no data" class="w-[140px]">
              <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
              <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
            </div>
          `;
        }
      });
    });
  }

  if (projectSelector) {
    projectSelector.addEventListener('change', function() {
      const project = projectSelector.value;
      
      // Smooth fade out animation
      unitsContainer.style.opacity = '0';
      unitsContainer.style.transform = 'translateY(20px)';
      unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        unitsContainer.innerHTML = '';
        loadingAnimation.style.display = 'flex';
        
        fetchUnits({
          projectIDs: project
        }, async function(response) {
          loadingAnimation.style.display = 'none';
          
          if (response.data && response.data.units && response.data.units.length > 0) {
            unitsContainer.innerHTML = '';
            // Prefetch project names
            const ids = [...new Set(response.data.units.map(u => u.projectID))];
            const nameMap = Object.fromEntries(await Promise.all(ids.map(async id => [id, await getProjectName(id)])));
            console.log(nameMap);

            response.data.units.forEach(async unit => {
              const cmpUtm = await getCmpUtmByID(unit.campaignID);
              const unitBoxHtml = unitBox(unit, nameMap, cmpUtm);
              unitsContainer.innerHTML += unitBoxHtml;
            });
          } else {
            unitsContainer.innerHTML = `
              <div class="flex flex-col items-center justify-center gap-5 min-h-[500px] col-span-full">
                <img src="${window.BASE_URL}/images/warning-o.webp" alt="no data" class="w-[140px]">
                <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
                <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
              </div>
            `;
          }

          // Re-attach event listeners to new unit buttons
          attachUnitButtonEvents();

          // Smooth fade in animation
          setTimeout(() => {
            unitsContainer.style.opacity = '1';
            unitsContainer.style.transform = 'translateY(0)';
          }, 50);
        });
      }, 300);
    });
  }

  // Initialize Swiper for unit detail page
  if (document.getElementById('mainGallerySwiper')) {
    console.log('Initializing main gallery swiper');
    
    // Initialize main gallery swiper
    new Swiper('#mainGallerySwiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.main-gallery-next',
        prevEl: '.main-gallery-prev',
      },
    });

    // Initialize facility thumbnail swiper first
    const facilityThumbSwiper = new Swiper('#facilityThumbSwiper', {
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      loop: true,
      watchSlidesProgress: true,
      breakpoints: {
        320: {
          slidesPerView: 3,
          spaceBetween: 10
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 15
        }
      }
    });

    // Initialize main facility swiper with thumbnail sync
    const facilityMainSwiper = new Swiper('#facilityMainSwiper', {
      loop: true,
      spaceBetween: 10,
      thumbs: {
        swiper: facilityThumbSwiper,
      },
      navigation: {
        nextEl: '.facility-main-next',
        prevEl: '.facility-main-prev',
      },
    });
  }

  const locationInput = document.getElementById('location_selector');
  const searchBtn = document.getElementById('searchBtn');
  const locationCheckboxAll = document.getElementById('locationCheckboxAll');
  const locationDropdownToggler = document.getElementById('locationDropdownToggler');
  const projectsDropdownToggler = document.getElementById('projectsDropdownToggler');
  const sortingUnitDropdownToggler = document.getElementById('sortingUnitDropdownToggler');
  const sortingUnitDropdownMenu = document.getElementById('sortingUnitDropdownMenu');

  if (projectsDropdownToggler) {
    projectsDropdownToggler.addEventListener('click', function() {
      projectsDropdownMenu.classList.toggle('hidden');
    });
  }

  if (locationDropdownToggler) {
    locationDropdownToggler.addEventListener('click', function() {
      locationDropdownMenu.classList.toggle('hidden');
    });

    const locationCheckboxes = Array.from(locationDropdownMenu.querySelectorAll('input[type="checkbox"]'));
    const locationItemCheckboxes = locationCheckboxes.filter(cb => cb !== locationCheckboxAll);

    function syncLocationSelectionUI() {
      const selectedValues = locationItemCheckboxes
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      locationInput.value = selectedValues.join(',');

      if (selectedValues.length === 0) {
        locationCheckboxAll.checked = true;
        locationDropdownTogglerText.innerHTML = 'ทั้งหมด';
      } else {
        locationCheckboxAll.checked = false;
        locationDropdownTogglerText.innerHTML = 'เลือกแล้ว ' + selectedValues.length;
      }
    }

    // Listener for "All" checkbox
    if (locationCheckboxAll) {
      locationCheckboxAll.addEventListener('change', function(event) {
        if (event.target.checked) {
          // Uncheck all specific location checkboxes
          locationItemCheckboxes.forEach(cb => { cb.checked = false; });
        } else {
          // If none selected, keep All checked by default
          const anySelected = locationItemCheckboxes.some(cb => cb.checked);
          if (!anySelected) {
            locationCheckboxAll.checked = true;
          }
        }
        syncLocationSelectionUI();
      });
    }

    // Listeners for individual location checkboxes
    locationItemCheckboxes.forEach(cb => {
      cb.addEventListener('change', function() {
        if (this.checked) {
          locationCheckboxAll.checked = false;
        } else {
          const anySelected = locationItemCheckboxes.some(c => c.checked);
          if (!anySelected) {
            locationCheckboxAll.checked = true;
          }
        }
        syncLocationSelectionUI();
      });
    });

    // Initialize UI based on current state
    syncLocationSelectionUI();

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {  
      if (locationDropdownMenu && locationDropdownToggler) {
        const isClickInsideToggler = locationDropdownToggler.contains(event.target);
        const isClickInsideMenu = locationDropdownMenu.contains(event.target);
        
        if (!isClickInsideToggler && !isClickInsideMenu) {
          locationDropdownMenu.classList.add('hidden');
        }
      }
    });
  }

  if (sortingUnitDropdownToggler) {
    sortingUnitDropdownToggler.addEventListener('click', function() {
      sortingUnitDropdownMenu.classList.toggle('hidden');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const project = projectSelector.value;
      const locations = locationInput.value;
      // const search = searchUnit.value;
      // Smooth fade out animation
      unitsContainer.style.opacity = '0';
      unitsContainer.style.transform = 'translateY(20px)';
      unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        unitsContainer.innerHTML = '';
        loadingAnimation.style.display = 'flex';
        
        fetchUnits({
          projectIDs: project,
          locationIDs: locations,
          // searchStr: search
        }, async function(response) {
          loadingAnimation.style.display = 'none';
          
          if (response.data && response.data.units && response.data.units.length > 0) {
            unitsContainer.innerHTML = '';
            // Prefetch project names
            const ids = [...new Set(response.data.units.map(u => u.projectID))];
            const nameMap = Object.fromEntries(await Promise.all(ids.map(async id => [id, await getProjectName(id)])));

            console.log(nameMap);

            response.data.units.forEach(async unit => {
              const cmpUtm = await getCmpUtmByID(unit.campaignID);
              const unitBoxHtml = unitBox(unit, nameMap, cmpUtm);
              unitsContainer.innerHTML += unitBoxHtml;
            });
          } else {
            unitsContainer.innerHTML = `
              <div class="flex flex-col items-center justify-center gap-5 min-h-[500px] col-span-full">
                <img src="${window.BASE_URL}/images/warning-o.webp" alt="no data" class="w-[140px]">
                <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
                <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
              </div>
            `;
          }

          // Re-attach event listeners to new unit buttons
          attachUnitButtonEvents();

          // Smooth fade in animation
          setTimeout(() => {
            unitsContainer.style.opacity = '1';
            unitsContainer.style.transform = 'translateY(0)';
          }, 50);
        });
      }, 300);
    });
  }

  const container = utils.$('#unitsContainer');

  animate('#unitsContainer .unit', {
    translateY: ['100px', '0px'],
    opacity: [0, 1],
    duration: 1000,
    easing: 'out(3)',
    delay: stagger(100),
  });
});