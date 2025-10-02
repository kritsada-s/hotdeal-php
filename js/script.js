/**
 * AssetWise Hot Deal - Main Application Entry Point
 * Orchestrates all modules and initializes the application
 */

import { animate, stagger, utils, onScroll } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

// Import modules
import { decodeToken } from './modules/utils.js';
import { checkAuthToken } from './modules/auth.js';
import { initModalListeners } from './modules/modals.js';
import { 
  attachUnitButtonEvents, 
  initUnitFilters,
  //initLocationDropdown,
  //initProjectsDropdown,
  initSortingDropdown
} from './modules/units.js';
import { 
  initHeroBanners, 
  initUnitDetailGalleries 
} from './modules/carousel.js';

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 AssetWise Hot Deal Application Starting...');

  // Initialize authentication state
  initAuthState();

  // Initialize local storage project
  initLocalStorageProject();

  // Initialize modal event listeners
  initModalListeners();

  // Initialize unit-related functionality
  initUnitFunctionality();

  // Initialize carousels/banners
  initHeroBanners();
  initUnitDetailGalleries();

  // Initialize dropdowns
  //initLocationDropdown();
  //initProjectsDropdown();
  initSortingDropdown();

  // Initialize animations
  initAnimations();

  console.log('✅ Application Initialized Successfully');
});

$(document).ready(function() {
  const locationSelector = $('#location_selector');
  const locationsListed = $('#locationsListed');
  if (locationSelector) {
    locationSelector.select2({
      placeholder: 'พิมพ์เพื่อเลือก...',
    });
  }

  locationSelector.on('select2:select', function(e) {
    console.log('selected locations : ', e.params.data.id);
    let loc = locationsListed.val();
    if (loc) {
      loc = loc + ',' + e.params.data.id;
    } else {
      loc = e.params.data.id;
    }
    locationsListed.val(loc);
  });
});

/**
 * Initialize authentication state and update UI
 */
function initAuthState() {
  const memberName = document.getElementById('memberName');  
  
  if (checkAuthToken()) {
    const token = localStorage.getItem('hotdeal_token');
    const user = decodeToken(token);
    if (memberName) memberName.textContent = user.Firstname;
  } else {
    if (memberName) memberName.textContent = 'เข้าสู่ระบบ';
    if (localStorage.getItem('tmp_p')) {
      localStorage.removeItem('tmp_p');
    }
  }
}

/**
 * Initialize local storage project
 */
function initLocalStorageProject() {
  if (localStorage.getItem('tmp_p')) {
    localStorage.removeItem('tmp_p');
  }
}

/**
 * Initialize unit-related functionality
 */
function initUnitFunctionality() {
  // Attach event listeners to existing unit buttons
  attachUnitButtonEvents();
  
  // Initialize filtering and search
  initUnitFilters();
}

/**
 * Initialize animations
 */
function initAnimations() {
  // const unitsContainer = document.getElementById('unitsContainer');
  
  // if (unitsContainer) {
  //   animate('#unitsContainer .unit', {
  //     translateY: ['100px', '0px'],
  //     opacity: [0, 1],
  //     duration: 1000,
  //     easing: 'out(3)',
  //     delay: stagger(100),
  //   });
  // }
}

