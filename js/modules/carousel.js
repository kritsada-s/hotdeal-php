/**
 * Carousel Module
 * Handles Swiper carousel initialization for banners and galleries
 */

/**
 * Initialize hero banner carousels
 */
export function initHeroBanners() {
  const desktopBanner = document.getElementById('desktopBanner');
  const mobileBanner = document.getElementById('mobileBanner');

  if (!desktopBanner || !mobileBanner) return;

  const args = {
    loop: true,
    autoHeight: true,
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  // Initialize based on screen size
  if (window.innerWidth >= 768) {
    mobileBanner.style.display = 'none';
    new Swiper(desktopBanner, args);
  } else {
    desktopBanner.style.display = 'none';
    new Swiper(mobileBanner, args);
  }

  // Handle window resize
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

/**
 * Initialize unit detail page galleries
 */
export function initUnitDetailGalleries() {
  // Main gallery swiper
  if (document.getElementById('mainGallerySwiper')) {
    //console.log('Initializing main gallery swiper');
    
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

    // Facility thumbnail swiper
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

    // Main facility swiper with thumbnail sync
    new Swiper('#facilityMainSwiper', {
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
}

