/**
 * API Module
 * Handles all AJAX requests and API communications
 */

/**
 * Make AJAX requests
 * @param {string} url - Request URL
 * @param {Function} callback - Callback function
 * @param {string} method - HTTP method (GET, POST)
 * @param {*} data - Request data (FormData or Object)
 * @param {string} token - Authorization token
 */
export function ajaxRequest(url, callback, method = 'GET', data = null, token = null) {
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

/**
 * Fetch units from API
 * @param {Object} params - Query parameters
 * @param {Function} callback - Callback function
 */
export function fetchUnits(params = {}, callback) {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  ajaxRequest(`${window.BASE_URL}utils/api.php?action=get_units&${queryString}`, callback);
}

/**
 * Get project name by project code
 * @param {string} projectCode - Project code
 * @returns {Promise<string>} Project name
 */
export function getProjectName(projectCode) {
  return new Promise((resolve) => {
    const qs = `action=get_project_name&projectID=${encodeURIComponent(projectCode)}`;
    ajaxRequest(`${window.BASE_URL}utils/api.php?${qs}`, function(res) {
      const name = (res && res.data && res.data.projectNameTH) || projectCode;
      resolve(name);
    }, 'GET');
  });
}

/**
 * Get campaign UTM by campaign ID
 * @param {string} cmpID - Campaign ID
 * @returns {Promise<Object>} Campaign UTM data
 */
export function getCmpUtmByID(cmpID) {
  return new Promise((resolve) => {
    const qs = `action=get_cmp_utm_by_id&cmpID=${encodeURIComponent(cmpID)}`;
    ajaxRequest(`${window.BASE_URL}utils/api.php?${qs}`, function(res) {
      resolve(res);
    }, 'GET');
  });
}

