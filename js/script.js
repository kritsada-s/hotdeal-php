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
  console.log(token);
}

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedData = JSON.parse(window.atob(base64));
  return decodedData;
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
      localStorage.setItem('hotdeal_token', response.token);
      memberModal.close();
      Swal.fire({
        title: 'ลงทะเบียนสำเร็จ',
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
    console.log('verifyMember');
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
  const memberBtn = document.getElementById('memberBtn');
  const unitBtn = document.querySelectorAll('.unitBtn');
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

  function clearAllModalInput() {
    clearEmailModalInputs();
    clearOTPModalInputs();
  }

  function clearEmailModalInputs() {
    document.getElementById('otp_email').value = '';
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
  
  function requestOTP(email) {
    console.log('--- requestOTP ---');
    
    var data = new FormData();
    data.append('email', email);
    data.append('action', 'send_otp');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    requestOTPBtn.disabled = true;
    requestOTPBtn.innerHTML = 'กำลังส่งรหัส OTP...';
  
    try {
      const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
        if (response.data) {
          loginModal.close();
          resetRequestOTPBtn();
          resetVerifyOTPBtn();
          otpModal.showModal();
        }
      }, 'POST', data);
    } catch (error) {
      console.log(error);
      resetRequestOTPBtn();
    }
  }

  function verifyOTP(email, otp) {
    console.log('--- verifyOTP ---');
    
    var data = new FormData();
    data.append('email', email);
    data.append('otp', otp);
    data.append('action', 'verify_otp');

    verifyOTPBtn.disabled = true;
    verifyOTPBtn.innerHTML = 'กำลังยืนยันรหัส OTP...';

    try {
      const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
        if (response.error) {
          otpModal.close();
          clearOTPModalInputs();
          const errorMessage = JSON.parse(response.raw_response);
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

        if (response.data) {
          const decodedData = decodeToken(response.data);        
          if (decodedData.ID) {
            // Login Success
            localStorage.setItem('hotdeal_token', response.data);
            otpModal.close();
            clearAllModalInput();
            Swal.fire({
              title: 'เข้าสู่ระบบสำเร็จ',
              icon: 'success',
              confirmButtonColor: '#123f6d',
              confirmButtonText: 'ตกลง'
            }).then(() => {
              clearAllModalInput();
            });
          } else {
            // Register New Member
            otpModal.close();
            sessionStorage.setItem('tmp_hotdeal_token', response.data);
            Swal.fire({
              title: 'ยืนยันรหัส OTP สำเร็จ',
              icon: 'success',
              confirmButtonColor: '#123f6d',
              confirmButtonText: 'ตกลง'
            }).then(() => {
              clearAllModalInput();
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
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  }

  if (desktopBanner && mobileBanner) {
    if (window.innerWidth > 768) {
      mobileBanner.style.display = 'none';
      new Swiper(desktopBanner, args);
    } else {
      desktopBanner.style.display = 'none';
      new Swiper(mobileBanner, args);
    }
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
  });

  unitBtn.forEach(btn => {
    btn.addEventListener('click', function() {
    const isAuth = checkAuthToken();
    let project = {
      cisid: btn.dataset.cisid,
      project: btn.dataset.project,
      unit: btn.dataset.unit,
    }
    if (isAuth) {
      let user = decodeToken(localStorage.getItem('hotdeal_token'));
      updateSummaryModal(user, project);
      summaryModal.showModal();
    } else {
      loginModal.showModal();
    }
    });
  });

  requestOTPBtn.addEventListener('click', function() {
    const email = document.getElementById('otp_email').value;
    try {
      requestOTP(email);
    } catch (error) {
      console.log(error);
    }
  });

  verifyOTPBtn.addEventListener('click', function() {
    const otp = document.getElementById('otp').value;
    const memberEmail = document.getElementById('otp_email').value;
    try {
      verifyOTP(memberEmail, otp);
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
      firstName: registerFirstName.value,
      lastName: registerLastName.value,
      tel: registerPhone.value,
      lineId: registerLineId.value,
      email: registerEmail.value,
      token: sessionStorage.getItem('tmp_hotdeal_token')
    }

    try {
      addMember(data);
    } catch (error) {
      console.log(error);
    }
  });

  updateMemberBtn.addEventListener('click', function() {
    const data = {
      firstName: modalFirstName.value,
      lastName: modalLastName.value,
      tel: modalPhone.value,
      lineId: modalLineId.value,
      email: modalEmail.value,
      //token: sessionStorage.getItem('tmp_hotdeal_token')
    }

    try {
      console.log('updateMember');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });

  summarySubmitBtn.addEventListener('click', function() {
    const summaryFirstName = document.getElementById('summaryFirstName');
    const summaryLastName = document.getElementById('summaryLastName');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');
    const summaryLineId = document.getElementById('summaryLineId');
    const summaryUnit = document.getElementById('summaryUnit').innerHTML;
    const summaryProjectID = document.getElementById('projectID').value;

    // Create FormData to send as form data, not JSON
    const data = new FormData();
    data.append('Fname', summaryFirstName.value);
    data.append('Lname', summaryLastName.value);
    data.append('Tel', summaryPhone.value);
    data.append('Email', summaryEmail.value);
    data.append('ProjectID', summaryProjectID);
    data.append('LineID', summaryLineId.value);
    data.append('unitID', summaryUnit); // Fixed field name
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
        } else {
          summaryModal.close();
          showSwal('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับการลงทะเบียน<br/>กรุณารอการติดต่อกลับจากโครงการ', 'success', '#123f6d', 'ตกลง');
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
    }
  });

  summaryCancelBtn.addEventListener('click', function() {
    summaryModal.close();
  });
});