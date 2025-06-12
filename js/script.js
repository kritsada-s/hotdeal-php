// Function to make AJAX requests
function ajaxRequest(url, callback, method = 'GET', data = null) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

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

  if (data) {
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

document.addEventListener('DOMContentLoaded', function() {
  const memberModal = document.getElementById('memberModal');
  memberModal.addEventListener('click', function() {
    Swal.fire({
      title: 'กรุณากรอกอีเมล',
      html: '<p class="text-sm text-gray-500">เพื่อรับรหัส OTP (One Time Password)</p>',
      input: 'email',
      confirmButtonText: 'รับรหัส OTP',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      //padding: '2rem 2.5rem',
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
      }
    });
  });
});