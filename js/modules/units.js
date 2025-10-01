/**
 * Units Module
 * Handles unit listing, filtering, search, and rendering
 */

import { fetchUnits, getProjectName, getCmpUtmByID } from './api.js';
import { checkAuthToken } from './auth.js';
import { decodeToken } from './utils.js';
import { updateSummaryModal } from './modals.js';

/**
 * Generate unit box HTML
 * @param {Object} unit - Unit data
 * @param {Object} nameMap - Project name mapping
 * @param {string} cmpUtm - Campaign UTM
 * @returns {string} HTML string
 */
export function unitBox(unit, nameMap, cmpUtm) {
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

/**
 * Attach event listeners to unit buttons
 */
export function attachUnitButtonEvents() {
  const unitBtn = document.querySelectorAll('.unitBtn');
  const loginModal = document.getElementById('loginModal');
  const summaryModal = document.getElementById('summaryModal');
  
  unitBtn.forEach(btn => {
    btn.addEventListener('click', function() {
      const isAuth = checkAuthToken();
      let project = {
        cisid: btn.dataset.cisid,
        project: btn.dataset.project,
        unit: btn.dataset.unit,
        utm: btn.dataset.utmCmp,
      };
      
      if (isAuth) {
        let user = decodeToken(localStorage.getItem('hotdeal_token'));
        updateSummaryModal(user, project);
        if (summaryModal) summaryModal.showModal();
      } else {
        localStorage.setItem('tmp_p', JSON.stringify(project));
        if (loginModal) loginModal.showModal();
      }
    });
  });
}

/**
 * Show no data message
 * @param {HTMLElement} container - Container element
 */
function showNoDataMessage(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-5 min-h-[500px] col-span-full">
      <img src="${window.BASE_URL}/images/warning-o.webp" alt="no data" class="w-[140px]">
      <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
      <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
    </div>
  `;
}

/**
 * Render units to container
 * @param {Array} units - Array of unit objects
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} loadingAnimation - Loading element
 */
async function renderUnits(units, container, loadingAnimation) {
  if (!container) return;
  
  if (loadingAnimation) loadingAnimation.style.display = 'none';
  
  if (units && units.length > 0) {
    container.innerHTML = '';
    
    // Prefetch project names
    const ids = [...new Set(units.map(u => u.projectID))];
    const nameMap = Object.fromEntries(
      await Promise.all(ids.map(async id => [id, await getProjectName(id)]))
    );

    for (const unit of units) {
      const cmpUtm = await getCmpUtmByID(unit.campaignID);
      const unitBoxHtml = unitBox(unit, nameMap, cmpUtm);
      container.innerHTML += unitBoxHtml;
    }
    
    // Re-attach event listeners
    attachUnitButtonEvents();
    
    // Fade in animation
    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 50);
  } else {
    showNoDataMessage(container);
  }
}

/**
 * Initialize unit filtering and search
 */
export function initUnitFilters() {
  const unitsContainer = document.getElementById('unitsContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const sortingUnit = document.getElementById('sortingUnit');
  const projectSelector = document.getElementById('project_selector');
  const locationInput = document.getElementById('location_selector');
  const searchBtn = document.getElementById('searchBtn');
  const searchForm = document.getElementById('searchForm');

  // Sorting change handler
  if (sortingUnit) {
    sortingUnit.addEventListener('change', async function() {
      const sort = sortingUnit.value;
      const project = projectSelector ? projectSelector.value : '';
      const locations = locationInput ? locationInput.value : '';

      // Fade out animation
      if (unitsContainer) {
        unitsContainer.style.opacity = '0';
        unitsContainer.style.transform = 'translateY(20px)';
        unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }

      if (loadingAnimation) loadingAnimation.style.display = 'flex';
      
      fetchUnits({
        sortingUnit: sort,
        projectIDs: project,
        locationIDs: locations
      }, async function(response) {
        await renderUnits(response.data?.units, unitsContainer, loadingAnimation);
      });
    });
  }

  // Project selector change handler
  if (projectSelector) {
    projectSelector.addEventListener('change', function() {
      const project = projectSelector.value;
      
      // Fade out animation
      if (unitsContainer) {
        unitsContainer.style.opacity = '0';
        unitsContainer.style.transform = 'translateY(20px)';
        unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      setTimeout(() => {
        if (unitsContainer) unitsContainer.innerHTML = '';
        if (loadingAnimation) loadingAnimation.style.display = 'flex';
        
        fetchUnits({
          projectIDs: project
        }, async function(response) {
          await renderUnits(response.data?.units, unitsContainer, loadingAnimation);
        });
      }, 300);
    });
  }

  // Search button handler
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const project = projectSelector ? projectSelector.value : '';
      const locations = locationInput ? locationInput.value : '';
      
      // Fade out animation
      if (unitsContainer) {
        unitsContainer.style.opacity = '0';
        unitsContainer.style.transform = 'translateY(20px)';
        unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      setTimeout(() => {
        if (unitsContainer) unitsContainer.innerHTML = '';
        if (loadingAnimation) loadingAnimation.style.display = 'flex';
        
        fetchUnits({
          projectIDs: project,
          locationIDs: locations
        }, async function(response) {
          await renderUnits(response.data?.units, unitsContainer, loadingAnimation);
        });
      }, 300);
    });
  }

  // Search form handler
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const search = document.getElementById('searchUnit')?.value;
      
      if (search) {
        fetchUnits({
          searchStr: search
        }, async function(response) {
          await renderUnits(response.data?.units, unitsContainer, loadingAnimation);
        });
      }
    });
  }
}

/**
 * Initialize location dropdown
 */
export function initLocationDropdown() {
  const locationDropdownToggler = document.getElementById('locationDropdownToggler');
  const locationDropdownMenu = document.getElementById('locationDropdownMenu');
  const locationInput = document.getElementById('location_selector');
  const locationCheckboxAll = document.getElementById('locationCheckboxAll');
  const locationDropdownTogglerText = document.getElementById('locationDropdownTogglerText');

  if (!locationDropdownToggler || !locationDropdownMenu) return;

  locationDropdownToggler.addEventListener('click', function() {
    locationDropdownMenu.classList.toggle('hidden');
  });

  const locationCheckboxes = Array.from(locationDropdownMenu.querySelectorAll('input[type="checkbox"]'));
  const locationItemCheckboxes = locationCheckboxes.filter(cb => cb !== locationCheckboxAll);

  function syncLocationSelectionUI() {
    const selectedValues = locationItemCheckboxes
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (locationInput) locationInput.value = selectedValues.join(',');

    if (selectedValues.length === 0) {
      if (locationCheckboxAll) locationCheckboxAll.checked = true;
      if (locationDropdownTogglerText) locationDropdownTogglerText.textContent = 'ทั้งหมด';
    } else {
      if (locationCheckboxAll) locationCheckboxAll.checked = false;
      if (locationDropdownTogglerText) locationDropdownTogglerText.textContent = 'เลือกแล้ว ' + selectedValues.length;
    }
  }

  // Listener for "All" checkbox
  if (locationCheckboxAll) {
    locationCheckboxAll.addEventListener('change', function(event) {
      if (event.target.checked) {
        locationItemCheckboxes.forEach(cb => { cb.checked = false; });
      } else {
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
        if (locationCheckboxAll) locationCheckboxAll.checked = false;
      } else {
        const anySelected = locationItemCheckboxes.some(c => c.checked);
        if (!anySelected && locationCheckboxAll) {
          locationCheckboxAll.checked = true;
        }
      }
      syncLocationSelectionUI();
    });
  });

  // Initialize UI
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

/**
 * Initialize projects dropdown
 */
export function initProjectsDropdown() {
  const projectsDropdownToggler = document.getElementById('projectsDropdownToggler');
  const projectsDropdownMenu = document.getElementById('projectsDropdownMenu');

  if (projectsDropdownToggler && projectsDropdownMenu) {
    projectsDropdownToggler.addEventListener('click', function() {
      projectsDropdownMenu.classList.toggle('hidden');
    });
  }
}

/**
 * Initialize sorting dropdown
 */
export function initSortingDropdown() {
  const sortingOptionDropdownToggler = document.getElementById('sortingOptionDropdownToggler');
  const sortingOptionDropdownMenu = document.getElementById('sortingOptionDropdownMenu');
  const sortingText = document.getElementById('sortingText');

  if (sortingOptionDropdownToggler && sortingOptionDropdownMenu) {
    sortingOptionDropdownToggler.addEventListener('click', function() {
      sortingOptionDropdownMenu.classList.toggle('hidden');
    });
    
    const sortingOptionDropdownItems = document.querySelectorAll('.sorting-option-dropdown-item');
    sortingOptionDropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        sortingOptionDropdownMenu.classList.add('hidden');
        if (sortingText) sortingText.textContent = item.textContent;
        sortingOptionDropdownToggler.dataset.value = item.dataset.value;
      });
    });
  }
}

