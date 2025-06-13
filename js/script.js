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
        console.error('Request failed with status:', xhr.status);
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
    
  ajaxRequest(`utils/api.php?action=get_units&${queryString}`, callback);
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
    const response = ajaxRequest('hotdeal/utils/api.php', function(response) {
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
    const response = ajaxRequest('hotdeal/utils/api.php', function(response) {
      if (response.data) {
        const decodedData = decodeToken(response.data);
        if (decodedData.ID) {
          localStorage.setItem('hotdeal_token', response.data);
        } else {
          showRegisterModal();
        }
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

  try {
    const response = ajaxRequest('hotdeal/utils/api.php', function(response) {
      if (response.data) {
        const decodedData = decodeToken(response.data);        
        if (decodedData.ID) {
          localStorage.setItem('hotdeal_token', response.data);
        } else {
          showRegisterModal();
        }
      }
    }, 'POST', data);
  } catch (error) {
    console.log(error);
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
    title: 'ข้อมูลส่วนตัว',
    html: `<p class="text-sm text-gray-500">ยินดีต้อนรับกลับ ${member.Email}</p>`,
    confirmButtonText: 'ยกเลิก',
    cancelButtonText: 'ออกจากระบบ',
    showCancelButton: true,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      title: '!text-2xl font-medium !pt-0',
      popup: '!p-7 !md:p-10',
      confirmButton: 'bg-primary text-white rounded-full px-10 py-3 cursor-pointer',
    },
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
        if (result.isConfirmed) {
          const isAuth = checkAuthToken();
          if (isAuth) {
            showMemberModal();
          } else {
            showLoginModal();
          }
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const memberBtn = document.getElementById('memberBtn');
  const unitBtn = document.querySelectorAll('.unitBtn');

  memberBtn.addEventListener('click', function() {
    const isAuth = checkAuthToken();

    if (isAuth) {
      let user = decodeToken(localStorage.getItem('hotdeal_token'));
      if (!user.ID) {
        showRegisterModal();
      } else {
        showMemberModal();
      }
    } else {
      showLoginModal();
    }
  });

  unitBtn.forEach(btn => {
    btn.addEventListener('click', function() {
    const isAuth = checkAuthToken();
    if (isAuth) {
      showSummaryModal();
    } else {
      showLoginModal();
    }
    });
  });
});