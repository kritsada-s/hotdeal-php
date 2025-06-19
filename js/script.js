// Function to make AJAX requests
function ajaxRequest(url, callback, method = 'GET', data = null) {
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

function addMember(userData) {
  var data = new FormData();
  data.append('data', JSON.stringify(userData));
  data.append('action', 'add_member');
  
  try {
    const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      console.log(response);
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
    //console.log(decodedData);
    return true;
  } else {
    return false;
  }
}

function requestOTP(email) {
  console.log('--- requestOTP ---');
  
  var data = new FormData();
  data.append('email', email);
  data.append('action', 'send_otp');

  try {
    const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      if (response.data) {
        loginModal.close();
        otpModal.showModal();
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
  }
}

function verifyOTP(email, otp) {
  console.log('--- verifyOTP ---');
  
  var data = new FormData();
  data.append('email', email);
  data.append('otp', otp);
  data.append('action', 'verify_otp');

  const otpModal = document.getElementById('otpModal');
  const summaryModal = document.getElementById('summaryModal');

  try {
    const response = ajaxRequest(`${window.BASE_URL}utils/api.php`, function(response) {
      if (response.data) {
        const decodedData = decodeToken(response.data);        
        if (decodedData.ID) {
          localStorage.setItem('hotdeal_token', response.data);
          otpModal.close();
          showToast('เข้าสู่ระบบสำเร็จ', 'success');
        } else {
          otpModal.close();
          showToast('ลงทะเบียนสำเร็จ', 'success');
          //registerModal.showModal();
        }
      }
    }, 'POST', data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function showRegisterModal() {
  Swal.fire({
    title: 'กรุณากรอกข้อมูลส่วนตัว',
    html: `
      <div class="profile grid grid-cols-1 gap-7 mt-4 px-5 md:px-10">
        <div class="input-group text-left">
          <label for="Fname">ชื่อ</label>
          <input type="text" id="Fname" name="Fname" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]">
        </div>
        <div class="input-group text-left">
          <label for="Lname">นามสกุล</label>
          <input type="text" id="Lname" name="Lname" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]">
        </div>
        <div class="input-group text-left">
          <label for="phone">เบอร์โทรศัพท์</label>
          <input type="text" id="phone" name="phone" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]">
        </div>
        <div class="input-group text-left">
          <label for="lineId">Line ID</label>
          <input type="text" id="lineId" name="lineId" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]">
        </div>
      </div>
     `,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    showCancelButton: true,
    showCloseButton: true,
    showLoaderOnConfirm: true,
    customClass: {
      title: '!text-2xl font-medium !pt-8 !px-auto !pb-4',
      htmlContainer: '!p-0',
      //popup: '!p-2 !md:p-10 !lg:w-1/2 !mx-auto',
      cancelButton: '!bg-white !text-gray-500 !rounded-full !px-10 !py-3 !cursor-pointer',
      confirmButton: '!bg-primary !text-white !rounded-full !px-10 !py-3 !cursor-pointer',
    },
    preConfirm: async (data) => {
      console.log('--- addUser ---');
      let userData = {
        firstname: document.getElementById('Fname').value,
        lastname: document.getElementById('Lname').value,
        tel: document.getElementById('phone').value,
        lineID: document.getElementById('lineId').value,
      }
      
      addMember(userData);
    }
  });
}

function showSummaryModal() {
  const member = decodeToken(localStorage.getItem('hotdeal_token'));
  Swal.fire({
    title: 'กรุณาตรวจสอบข้อมูล',
    html: '<p class="text-sm text-gray-500">Email: ' + member.Email + '</p>',
  });
}

function showMemberModal() {
  const member = decodeToken(localStorage.getItem('hotdeal_token'));
  Swal.fire({
    width: '700px',
    html: `
    <h4 class="text-2xl font-medium">ข้อมูลส่วนตัว</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-7 mt-4">
      <div class="input-group text-left">
        <label for="email">Email</label>
        <input type="text" id="email" name="email" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]" value="${member.Email}" readonly>
      </div>
      <div class="input-group text-left">
        <label for="name">ชื่อ</label>
        <input type="text" id="name" name="name" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]" value="${member.Firstname} ${member.Lastname}" readonly>
      </div>
      <div class="input-group text-left">
        <label for="tel">เบอร์โทรศัพท์</label>
        <input type="text" id="tel" name="tel" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]" value="${member.Tel}" readonly>
      </div>
      <div class="input-group text-left">
        <label for="lineId">Line ID</label>
        <input type="text" id="lineId" name="lineId" class="w-full border-b border-gray-500 px-3 py-1 h-[45px]" value="${member.LineID}" readonly>
      </div>
    </div>
    `,
    confirmButtonText: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg> ออกจากระบบ',
    showConfirmButton: true,
    showCancelButton: false,
    showCloseButton: true,
    customClass: {
      title: '!text-2xl font-medium !pt-0',
      confirmButton: 'logout-btn',
    },
    preConfirm: async (data) => {
      localStorage.removeItem('hotdeal_token');
      window.location.reload();
    }
  });
}

function showLoginModal() {
  let memberEmail = '';
  Swal.fire({
    title: 'กรุณากรอกอีเมล',
    html: '<p class="text-sm text-gray-500">เพื่อรับรหัส OTP (One Time Password)</p>',
    input: 'email',
    confirmButtonText: 'รับรหัส OTP',
    cancelButtonText: 'ยกเลิก',
    buttonsStyling: false,
    showLoaderOnConfirm: true,
    customClass: {
      title: '!text-2xl font-medium !pt-0',
      popup: '!p-7 !md:p-10',
      input: '!mx-0',
      confirmButton: 'bg-primary text-white rounded-full px-10 py-3 cursor-pointer',
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    },
    preConfirm: async (email) => {
      try {
        requestOTP(email);
        memberEmail = email;
      } catch (error) {
        Swal.showValidationMessage(error);
      }

    }
  }).then(function(result) {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'กรุณากรอกรหัส OTP ที่ได้รับจากอีเมล',
        input: 'text',
        confirmButtonText: 'ยืนยัน OTP',
        cancelButtonText: 'ยกเลิก OTP',
        showLoaderOnConfirm: true,
        customClass: {
          title: '!text-2xl font-medium !pt-0',
          popup: '!p-7 !md:p-10',
          input: '!mx-0 text-center',
          confirmButton: 'bg-primary text-white rounded-full px-10 py-3 cursor-pointer',
        },
        preConfirm: async (otp) => {
          try { 
            verifyOTP(memberEmail, otp);
          } catch (error) {
            Swal.showValidationMessage(error);
          }
        },
      }).then(function(result) {
        window.location.reload();
      });
    }
  });
}

function updateMemberModal(member) {
  if (!member) {
    return;
  }

  const modalFirstName = document.getElementById('firstName');
  const modalLastName = document.getElementById('lastName');
  const modalPhone = document.getElementById('phone');
  const modalEmail = document.getElementById('email');
  const modalLineId = document.getElementById('lineId');
  const logoutBtn = document.getElementById('logoutBtn');

  modalFirstName.value = member.Firstname;
  modalLastName.value = member.Lastname;
  modalPhone.value = member.Tel;
  modalEmail.value = member.Email;
  modalLineId.value = member.LineID;
}

function updateSummaryModal(member, unit) {
  console.log(unit.project);
  const summaryFirstName = document.getElementById('summaryFirstName');
  const summaryLastName = document.getElementById('summaryLastName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryPhone = document.getElementById('summaryPhone');
  const summaryLineId = document.getElementById('summaryLineId');
  const summaryProject = document.getElementById('summaryProject');
  const summaryUnit = document.getElementById('summaryUnit');
  //const summaryCISId = document.getElementById('summaryCISId');

  summaryFirstName.value = member.Firstname;
  summaryLastName.value = member.Lastname;
  summaryEmail.value = member.Email;
  summaryPhone.value = member.Tel;
  summaryLineId.value = member.LineID;

  summaryProject.innerHTML = unit.project;
  summaryUnit.innerHTML = unit.unit;
  //summaryCISId.innerHTML = unit.cisid;
}

function showToast(text, type) {
  if (text === "") {
    return;
  }

  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: true,
  }).showToast();
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

  const modals = document.querySelectorAll('.modal');

  const desktopBanner = document.getElementById('desktopBanner');
  const mobileBanner = document.getElementById('mobileBanner');

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

  if (window.innerWidth > 768) {
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
    showToast('ออกจากระบบสำเร็จ', 'success');
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
});