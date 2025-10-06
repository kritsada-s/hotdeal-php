/**
 * Units Module
 * Handles unit listing, filtering, search, and rendering
 */

import { fetchUnits, getProjectName, getCmpUtmByID } from './api.js';
import { checkAuthToken } from './auth.js';
import { decodeToken } from './utils.js';
import { updateSummaryModal } from './modals.js';
import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

/**
 * Generate unit box HTML
 * @param {Object} unit - Unit data
 * @param {Object} nameMap - Project name mapping
 * @param {string} cmpUtm - Campaign UTM
 * @returns {string} HTML string
 */
export function unitBox(unit, nameMap, cmpUtm) {
  // Determine base URL based on domain
  const baseUrl = 'https://aswservice.com/hotdeal/';
  
  return `
    <div class="unit-box rounded-lg overflow-hidden shadow-lg border border-neutral-200 relative" style="opacity: 0;">
      ${unit.isSoldOut ? `<span class="text-white text-[12px] lg:text-[16px] font-medium flex items-center justify-center px-5 py-2 w-full bg-red-500 rotate-45 absolute top-[20px] lg:top-[5%] left-[40px] lg:left-[30%] z-[3]">SOLD OUT</span>` : ''}
      <div class="unit-wrapper flex flex-col h-full ${unit.isSoldOut ? 'sold-out' : ''}">
        <a href="${window.BASE_URL}unit/${unit.id}" class="relative">
          ${unit.campaignOverlay?.resource?.filePath ? `<img class="absolute top-0 left-0 w-full h-full object-cover z-[2]" src="https://aswservice.com/hotdealassets${unit.campaignOverlay.resource.filePath}">` : ''}
          <img src="https://aswservice.com/hotdealassets${unit.headerImage.resource.filePath}" class="w-full aspect-square object-cover z-[1]">
        </a>
        <div class="unit-detail px-2 py-3 lg:px-4 lg:pt-6 lg:pb-4 relative flex flex-col h-full justify-between">
          ${unit.highlightText ? `<div class="highlight-tag">${unit.highlightText}</div>` : ''}
          <div class="unit-info">
            <p class="text-[#00a9a5] mb-3 text-[11px] lg:text-[16px] leading-none">${unit.projectName}</p>
            <h3 class="text-primary leading-none font-medium mb-2 text-[16px] lg:text-2xl">${unit.unitCode}</h3>
            <p>
              <span class="text-neutral-500 relative line-through text-[10px] lg:text-[16px] font-light">ปกติ ${(unit.sellingPrice/1000000).toFixed(2)} ล้าน</span>
            </p>
            <p class="mb-4 lg:mb-7">
              <span class="text-accent text-[14px] lg:text-xl">พิเศษ</span> <span class="text-accent font-bold text-[18px] lg:text-4xl">${(unit.discountPrice/1000000).toFixed(2)}</span> <span class="text-accent text-[16px] lg:text-xl">ล้าน</span>
            </p>
          </div>
          <div class="unit-action btn-group flex flex-col justify-between lg:items-center gap-4">
            <a href="${window.BASE_URL}unit?id=${unit.id}" class="text-neutral-500 hover:text-neutral-800 text-[12px] lg:text-[16px] font-light">ดูรายละเอียด</a>
            <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2 hover:shadow-lg transition-all duration-300 text-[14px] lg:text-base w-full" data-unit="${unit.unitCode}" data-project="${nameMap[unit.projectID] ?? unit.projectID}" data-cisid="${unit.projectCode ?? ''}" data-utm-cmp="${cmpUtm}">สนใจยูนิตนี้</button>
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
        updateLocalStorageProject(project);
        if (summaryModal) summaryModal.showModal();
      } else {
        updateLocalStorageProject(project);
        if (loginModal) loginModal.showModal();
      }
    });
  });
}

export function updateLocalStorageProject(project) {
  localStorage.setItem('tmp_p', JSON.stringify(project));
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
 * Render pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} totalItems - Total number of items
 */
function renderPagination(currentPage, totalPages, totalItems) {
  const paginationContainer = document.getElementById('paginationContainer');
  const pageNumbers = document.getElementById('pageNumbers');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const currentPageInfo = document.getElementById('currentPageInfo');
  const totalPagesInfo = document.getElementById('totalPagesInfo');
  const totalItemsInfo = document.getElementById('totalItemsInfo');
  
  if (!paginationContainer || !pageNumbers || !prevBtn || !nextBtn) return;
  
  // Update page info display
  if (currentPageInfo) currentPageInfo.textContent = `หน้า ${currentPage}`;
  if (totalPagesInfo) totalPagesInfo.textContent = totalPages;
  if (totalItemsInfo) totalItemsInfo.textContent = totalItems;
  
  // Show/hide pagination based on total pages
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  // Update prev/next buttons
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  
  // Generate page numbers
  let pageNumbersHtml = '';
  const maxVisiblePages = 3;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pageNumbersHtml += `<button class="page-btn px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50" data-page="1">1</button>`;
    if (startPage > 2) {
      pageNumbersHtml += `<span class="px-3 py-2 text-sm text-neutral-500">...</span>`;
    }
  }
  
  // Add visible page numbers
  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    const activeClass = isActive ? 'bg-primary text-white border-primary' : 'text-neutral-700 bg-white border-neutral-300 hover:bg-neutral-50';
    pageNumbersHtml += `<button class="page-btn px-3 py-2 text-sm font-medium border rounded-md ${activeClass}" data-page="${i}">${i}</button>`;
  }
  
  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbersHtml += `<span class="px-3 py-2 text-sm text-neutral-500">...</span>`;
    }
    pageNumbersHtml += `<button class="page-btn px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50" data-page="${totalPages}">${totalPages}</button>`;
  }
  
  pageNumbers.innerHTML = pageNumbersHtml;
  
  // Add event listeners to page buttons
  const pageButtons = pageNumbers.querySelectorAll('.page-btn');
  pageButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const page = parseInt(this.dataset.page);
      if (page !== currentPage) {
        loadPage(page);
      }
    });
  });
}

/**
 * Render units to container
 * @param {Array} units - Array of unit objects
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} loadingAnimation - Loading element
 * @param {Object} paginationData - Pagination information
 */
async function renderUnits(units, container, loadingAnimation, paginationData = null) {
  if (!container) return;
  
  if (loadingAnimation) loadingAnimation.style.display = 'none';
  
  if (units && units.length > 0) {
    container.innerHTML = '';
    
    // Prefetch project names
    const ids = [...new Set(units.map(u => u.projectID))];
    const nameMap = Object.fromEntries(
      await Promise.all(ids.map(async id => [id, await getProjectName(id)]))
    );

    // Ensure container is visible first
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    container.style.transition = 'none';
    
    for (const unit of units) {
      const cmpUtm = await getCmpUtmByID(unit.campaignID);
      const unitBoxHtml = unitBox(unit, nameMap, cmpUtm);
      container.innerHTML += unitBoxHtml;
    }
    
    // Re-attach event listeners
    attachUnitButtonEvents();
    
    // Set initial state for all unit boxes immediately (before they're visible)
    const unitBoxes = container.querySelectorAll('.unit-box');
    unitBoxes.forEach(box => {
      //box.style.opacity = '0';
      box.style.transform = 'translateY(30px) scale(0.95)';
      box.style.transition = 'none';
    });
    
    // Start animation immediately with minimal delay
    requestAnimationFrame(() => {
      animate(unitBoxes, {
        opacity: [0, 1],
        translateY: ['30px', '0px'],
        scale: [0.95, 1],
        duration: 500,
        easing: 'easeOutQuart',
        delay: stagger(80, { start: 0 })
      });
    });
    
    // Update pagination if pagination data is provided
    if (paginationData) {
      renderPagination(paginationData.currentPage, paginationData.totalPages, paginationData.totalItems);
    }
  } else {
    showNoDataMessage(container);
    // Hide pagination when no data
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
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
  const projectSelectorCheckboxes = document.querySelectorAll('.project-checkbox');
  const locationInput = document.getElementById('location_selector');
  const locationsListed = document.getElementById('locationsListed');
  const searchBtn = document.getElementById('searchBtn');
  const searchForm = document.getElementById('searchForm');
  let selectedProjects = [];
  let selectedLocations = [];
  
  // Responsive helpers
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
  
  // Pagination state
  let currentPage = 1;
  let totalPages = 1;
  let totalItems = 0;
  let itemsPerPage = 6; // Default items per page
  
  /**
   * Load a specific page
   * @param {number} page - Page number to load
   */
  function loadPage(page) {
    currentPage = page;
    
    // Get current filter values
    const selectedProjectCheckboxes = document.querySelectorAll('.project-checkbox:checked');
    const project = Array.from(selectedProjectCheckboxes).map(cb => cb.value).join(',');
    const locations = locationsListed ? locationsListed.value : '';
    const sort = sortingUnit ? sortingUnit.value : 'DESC';
    
    // Fade out animation
    if (unitsContainer) {
      const unitBoxes = unitsContainer.querySelectorAll('.unit-box');
      if (unitBoxes.length > 0) {
        // Animate out with stagger
        animate(unitBoxes, {
          opacity: [1, 0],
          translateY: ['0px', '-15px'],
          scale: [1, 0.98],
          duration: 250,
          easing: 'easeInQuart',
          delay: stagger(30, { direction: 'reverse' })
        });
      }
    }
    
    if (loadingAnimation) loadingAnimation.style.display = 'flex';
    
    // Load new page
    setTimeout(() => {
      if (unitsContainer) {
        unitsContainer.innerHTML = '';
        // Reset container opacity for new content
        unitsContainer.style.opacity = '1';
        unitsContainer.style.transform = 'translateY(0)';
        unitsContainer.style.transition = 'none';
      }
      
      fetchUnits({
        sortingUnit: sort,
        projectIDs: project,
        locationIDs: locations,
        page: currentPage,
        perPage: itemsPerPage
      }, async function(response) {
        // Normalize response
        const fetchedUnits = response?.data?.units || response?.units || [];
        const normalizedTotalItems = response?.data?.totalItems || response?.totalItems || response?.data?.total || fetchedUnits.length;
        const normalizedTotalPages = response?.data?.totalPages || response?.totalPages || response?.data?.totalPage || Math.ceil(normalizedTotalItems / itemsPerPage);
        const normalizedCurrentPage = response?.data?.currentPage || response?.currentPage || response?.data?.page || currentPage;

        // Sync pagination state
        currentPage = normalizedCurrentPage;
        totalPages = normalizedTotalPages;
        totalItems = normalizedTotalItems;

        const paginationData = {
          currentPage: currentPage,
          totalPages: totalPages,
          totalItems: totalItems
        };
        await renderUnits(fetchedUnits, unitsContainer, loadingAnimation, paginationData);
      });
    }, 200);
  }

  // Sorting change handler
  if (sortingUnit) {
    sortingUnit.addEventListener('change', async function() {
      console.log('sorting: ', sortingUnit.value);
      const sort = sortingUnit.value;
      
      // Get selected projects from checkboxes
      const selectedProjectCheckboxes = document.querySelectorAll('.project-checkbox:checked');
      const project = Array.from(selectedProjectCheckboxes).map(cb => cb.value).join(',');
      
      // Get selected locations
      const locations = locationsListed ? locationsListed.value : '';

      // Fade out animation
      if (unitsContainer) {
        const unitBoxes = unitsContainer.querySelectorAll('.unit-box');
        if (unitBoxes.length > 0) {
          // Animate out with stagger
          animate(unitBoxes, {
            opacity: [1, 0],
            translateY: ['0px', '-15px'],
            scale: [1, 0.98],
            duration: 250,
            easing: 'easeInQuart',
            delay: stagger(30, { direction: 'reverse' })
          });
        } else {
          unitsContainer.style.opacity = '0';
          unitsContainer.style.transform = 'translateY(20px)';
          unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
      }

      if (loadingAnimation) loadingAnimation.style.display = 'flex';
      
      // Add small delay to ensure fade-out animation completes
      setTimeout(() => {
        if (unitsContainer) {
          unitsContainer.innerHTML = '';
          // Reset container opacity for new content
          unitsContainer.style.opacity = '1';
          unitsContainer.style.transform = 'translateY(0)';
          unitsContainer.style.transition = 'none';
        }
        
        fetchUnits({
          sortingUnit: sort,
          projectIDs: project,
          locationIDs: locations,
          page: 1, // Reset to first page when filters change
          perPage: itemsPerPage
        }, async function(response) {
          // Normalize
          const fetchedUnits = response?.data?.units || response?.units || [];
          const normalizedTotalItems = response?.data?.totalItems || response?.totalItems || response?.data?.total || fetchedUnits.length;
          const normalizedTotalPages = response?.data?.totalPages || response?.totalPages || response?.data?.totalPage || Math.ceil(normalizedTotalItems / itemsPerPage);
          const normalizedCurrentPage = response?.data?.currentPage || response?.currentPage || response?.data?.page || 1;

          // Sync pagination state
          currentPage = normalizedCurrentPage;
          totalPages = normalizedTotalPages;
          totalItems = normalizedTotalItems;

          const paginationData = {
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalItems
          };
          await renderUnits(fetchedUnits, unitsContainer, loadingAnimation, paginationData);
        });
      }, 200);
    });
  }

  // Project selector change handler
  if (projectSelectorCheckboxes) {    
    projectSelectorCheckboxes.forEach(checkbox => {
      // Disable auto-change behavior on mobile
      if (isMobile()) return;
      
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          selectedProjects.push(this.value);
        } else {
          selectedProjects = selectedProjects.filter(project => project !== this.value);
        }
        const project = selectedProjects.join(',');
        console.log('selected projects : ', project);
        
        // Trigger sorting update when projects change
        if (sortingUnit) {
          sortingUnit.dispatchEvent(new Event('change'));
        }
      });
    });
  }

  // Search button handler
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      console.log('project: ', selectedProjects);
      console.log('locations: ', locationsListed ? locationsListed.value : '');
      console.log('sorting: ', sortingUnit ? sortingUnit.value : '');
      
      // Get current filter values
      const selectedProjectCheckboxes = document.querySelectorAll('.project-checkbox:checked');
      const project = Array.from(selectedProjectCheckboxes).map(cb => cb.value).join(',');
      const locations = locationsListed ? locationsListed.value : '';
      const sort = sortingUnit ? sortingUnit.value : 'DESC';
      
      // Fade out animation
      if (unitsContainer) {
        const unitBoxes = unitsContainer.querySelectorAll('.unit-box');
        if (unitBoxes.length > 0) {
          // Animate out with stagger
          animate(unitBoxes, {
            opacity: [1, 0],
            translateY: ['0px', '-15px'],
            scale: [1, 0.98],
            duration: 250,
            easing: 'easeInQuart',
            delay: stagger(30, { direction: 'reverse' })
          });
        } else {
          unitsContainer.style.opacity = '0';
          unitsContainer.style.transform = 'translateY(20px)';
          unitsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
      }
      
      setTimeout(() => {
        if (unitsContainer) {
          unitsContainer.innerHTML = '';
          // Reset container opacity for new content
          unitsContainer.style.opacity = '1';
          unitsContainer.style.transform = 'translateY(0)';
          unitsContainer.style.transition = 'none';
        }
        if (loadingAnimation) loadingAnimation.style.display = 'flex';
        
        // Close mobile drawer after search on mobile
        const mobileFilterPanel = document.getElementById('mobile_filter_panel');
        const mobileFilterOverlay = document.getElementById('mobile_filter_overlay');
        if (mobileFilterPanel && isMobile()) mobileFilterPanel.classList.add('-translate-x-full');
        if (mobileFilterOverlay && isMobile()) mobileFilterOverlay.classList.add('hidden');
        
        fetchUnits({
          sortingUnit: sort,
          projectIDs: project,
          locationIDs: locations,
          page: 1, // Reset to first page when filters change
          perPage: itemsPerPage
        }, async function(response) {
          // Normalize
          const fetchedUnits = response?.data?.units || response?.units || [];
          const normalizedTotalItems = response?.data?.totalItems || response?.totalItems || response?.data?.total || fetchedUnits.length;
          const normalizedTotalPages = response?.data?.totalPages || response?.totalPages || response?.data?.totalPage || Math.ceil(normalizedTotalItems / itemsPerPage);
          const normalizedCurrentPage = response?.data?.currentPage || response?.currentPage || response?.data?.page || 1;

          // Sync pagination state
          currentPage = normalizedCurrentPage;
          totalPages = normalizedTotalPages;
          totalItems = normalizedTotalItems;

          const paginationData = {
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalItems
          };
          await renderUnits(fetchedUnits, unitsContainer, loadingAnimation, paginationData);
        });
      }, 200);
    });
  }

  // Search form handler
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const search = document.getElementById('searchUnit')?.value;
      
      if (search) {
        fetchUnits({
          searchStr: search,
          page: 1, // Reset to first page when searching
          perPage: itemsPerPage
        }, async function(response) {
        console.log('API Response:', response); // Debug log
        
        // Extract pagination data from various possible response structures
        const units = response.data?.units || response.units || [];
        const totalItems = response.data?.totalItems || response.totalItems || response.data?.total || units.length;
        const totalPages = response.data?.totalPages || response.totalPages || response.data?.totalPage || Math.ceil(totalItems / itemsPerPage);
        
        const paginationData = {
          currentPage: response.data?.currentPage || response.currentPage || response.data?.page || 1,
          totalPages: totalPages,
          totalItems: totalItems
        };
        
        console.log('Pagination Data:', paginationData); // Debug log
          await renderUnits(units, unitsContainer, loadingAnimation, paginationData);
        });
      }
    });
  }
  
  // Pagination event listeners
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentPage > 1) {
        loadPage(currentPage - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentPage < totalPages) {
        loadPage(currentPage + 1);
      }
    });
  }

  // Initialize pagination state from server-rendered attributes on first load
  const paginationContainer = document.getElementById('paginationContainer');
  if (paginationContainer) {
    const ssrCurrent = parseInt(paginationContainer.getAttribute('data-current-page')) || 1;
    const ssrTotalPages = parseInt(paginationContainer.getAttribute('data-total-pages')) || 1;
    const ssrTotalItems = parseInt(paginationContainer.getAttribute('data-total-items')) || 0;
    currentPage = ssrCurrent;
    totalPages = ssrTotalPages;
    totalItems = ssrTotalItems;
    // Render pagination controls only, do not refetch or re-render units (avoid glitch)
    renderPagination(currentPage, totalPages, totalItems);
  }
}

/**
 * Initialize location dropdown
 */
// export function initLocationDropdown() {
//   const locationDropdownToggler = document.getElementById('locationDropdownToggler');
//   const locationDropdownMenu = document.getElementById('locationDropdownMenu');
//   const locationInput = document.getElementById('location_selector');
//   const locationCheckboxAll = document.getElementById('locationCheckboxAll');
//   const locationDropdownTogglerText = document.getElementById('locationDropdownTogglerText');

//   if (!locationDropdownToggler || !locationDropdownMenu) return;

//   locationDropdownToggler.addEventListener('click', function() {
//     locationDropdownMenu.classList.toggle('hidden');
//   });

//   const locationCheckboxes = Array.from(locationDropdownMenu.querySelectorAll('input[type="checkbox"]'));
//   const locationItemCheckboxes = locationCheckboxes.filter(cb => cb !== locationCheckboxAll);

//   function syncLocationSelectionUI() {
//     const selectedValues = locationItemCheckboxes
//       .filter(cb => cb.checked)
//       .map(cb => cb.value);

//     if (locationInput) locationInput.value = selectedValues.join(',');

//     if (selectedValues.length === 0) {
//       if (locationCheckboxAll) locationCheckboxAll.checked = true;
//       if (locationDropdownTogglerText) locationDropdownTogglerText.textContent = 'ทั้งหมด';
//     } else {
//       if (locationCheckboxAll) locationCheckboxAll.checked = false;
//       if (locationDropdownTogglerText) locationDropdownTogglerText.textContent = 'เลือกแล้ว ' + selectedValues.length;
//     }
//   }

//   // Listener for "All" checkbox
//   if (locationCheckboxAll) {
//     locationCheckboxAll.addEventListener('change', function(event) {
//       if (event.target.checked) {
//         locationItemCheckboxes.forEach(cb => { cb.checked = false; });
//       } else {
//         const anySelected = locationItemCheckboxes.some(cb => cb.checked);
//         if (!anySelected) {
//           locationCheckboxAll.checked = true;
//         }
//       }
//       syncLocationSelectionUI();
//     });
//   }

//   // Listeners for individual location checkboxes
//   locationItemCheckboxes.forEach(cb => {
//     cb.addEventListener('change', function() {
//       if (this.checked) {
//         if (locationCheckboxAll) locationCheckboxAll.checked = false;
//       } else {
//         const anySelected = locationItemCheckboxes.some(c => c.checked);
//         if (!anySelected && locationCheckboxAll) {
//           locationCheckboxAll.checked = true;
//         }
//       }
//       syncLocationSelectionUI();
//     });
//   });

//   // Initialize UI
//   syncLocationSelectionUI();

//   // Close dropdown when clicking outside
//   document.addEventListener('click', function(event) {  
//     if (locationDropdownMenu && locationDropdownToggler) {
//       const isClickInsideToggler = locationDropdownToggler.contains(event.target);
//       const isClickInsideMenu = locationDropdownMenu.contains(event.target);
      
//       if (!isClickInsideToggler && !isClickInsideMenu) {
//         locationDropdownMenu.classList.add('hidden');
//       }
//     }
//   });
// }

/**
 * Initialize projects dropdown
 */
// export function initProjectsDropdown() {
//   const projectsDropdownToggler = document.getElementById('projectsDropdownToggler');
//   const projectsDropdownMenu = document.getElementById('projectsDropdownMenu');

//   if (projectsDropdownToggler && projectsDropdownMenu) {
//     projectsDropdownToggler.addEventListener('click', function() {
//       projectsDropdownMenu.classList.toggle('hidden');
//     });
//   }

//   document.addEventListener('click', function(event) {
//     if (projectsDropdownMenu && projectsDropdownToggler) {
//       const isClickInsideToggler = projectsDropdownToggler.contains(event.target);
//       const isClickInsideMenu = projectsDropdownMenu.contains(event.target);
//       if (!isClickInsideToggler && !isClickInsideMenu) {
//         projectsDropdownMenu.classList.add('hidden');
//       }
//     }
//   });
// }

/**
 * Initialize sorting dropdown
 */
export function initSortingDropdown() {
  const sortingOptionDropdownToggler = document.getElementById('sortingOptionDropdownToggler');
  const sortingOptionDropdownMenu = document.getElementById('sortingOptionDropdownMenu');
  const sortingText = document.getElementById('sortingText');
  const sortingInput = document.getElementById('sortingUnit');
  const mobileFilterPanelToggler = document.getElementById('mobile_filter_panel_toggler');
  const mobileFilterPanel = document.getElementById('mobile_filter_panel');
  const mobileFilterOverlay = document.getElementById('mobile_filter_overlay');
  const mobileFilterClose = document.getElementById('mobile_filter_panel_close');

  if (sortingOptionDropdownToggler && sortingOptionDropdownMenu) {
    // Set default value
    if (sortingInput) {
      sortingInput.value = 'DESC'; // Default to newest first
    }
    
    sortingOptionDropdownToggler.addEventListener('click', function() {
      sortingOptionDropdownMenu.classList.toggle('hidden');
    });
    
    const sortingOptionDropdownItems = document.querySelectorAll('.sorting-option-dropdown-item');
    sortingOptionDropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        sortingOptionDropdownMenu.classList.add('hidden');
        if (sortingText) sortingText.textContent = item.textContent;
        sortingOptionDropdownToggler.dataset.value = item.dataset.value;
        if (sortingInput) {
          sortingInput.value = item.dataset.value;
          // Trigger change event to update units
          sortingInput.dispatchEvent(new Event('change'));
        }
      });
    });
  }

  // Mobile filter panel toggle
  if (mobileFilterPanelToggler && mobileFilterPanel) {
    mobileFilterPanelToggler.addEventListener('click', function() {
      // Open drawer
      mobileFilterPanel.classList.remove('hidden');
      mobileFilterPanel.classList.remove('-translate-x-full');
      if (mobileFilterOverlay) mobileFilterOverlay.classList.remove('hidden');
    });
  }

  function closeMobileFilter() {
    // Close drawer
    mobileFilterPanel.classList.add('-translate-x-full');
    if (mobileFilterOverlay) mobileFilterOverlay.classList.add('hidden');
    // Keep element in DOM for transitions; hide after animation if desired
  }

  if (mobileFilterClose && mobileFilterPanel) {
    mobileFilterClose.addEventListener('click', closeMobileFilter);
  }

  if (mobileFilterOverlay && mobileFilterPanel) {
    mobileFilterOverlay.addEventListener('click', closeMobileFilter);
  }
}

