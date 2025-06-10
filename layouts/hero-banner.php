<?php
  $bannerDataDesktop = get_home_banners(['resourceTypeID' => 1]);
  $bannerDataMobile = get_home_banners(['resourceTypeID' => 2]);

  // echo "<pre>";
  // print_r($bannerDataDesktop);
  // print_r($bannerDataMobile);
  // echo "</pre>";
?>

<section id="heroBanner">
  <div id="desktopBanner" class="swiper w-full before:content-[''] before:absolute before:top-0 before:left-0 before:w-1/4 before:h-full before:bg-gradient-to-r before:from-black/60 before:via-black/20 before:to-transparent before:z-10 after:content-[''] after:absolute after:top-0 after:right-0 after:w-1/4 after:h-full after:bg-gradient-to-l after:from-black/60 after:via-black/20 after:to-transparent after:z-9">
    <div class="swiper-wrapper h-full">
      <?php foreach($bannerDataDesktop['data'] as $banner): ?>
        <div class="hero-banner swiper-slide w-full">
          <img class="w-full" src="https://aswservice.com/hotdeal/<?= $banner['resource']['filePath']; ?>" alt="">
        </div>
      <?php endforeach; ?>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next z-11 after:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-right-icon lucide-circle-chevron-right"><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/></svg>
    </div>
    <div class="swiper-button-prev after:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-left-icon lucide-circle-chevron-left"><circle cx="12" cy="12" r="10"/><path d="m14 16-4-4 4-4"/></svg>
    </div>
  </div>


  <div id="mobileBanner" class="swiper w-full before:content-[''] before:absolute before:top-0 before:left-0 before:w-1/5 before:h-full before:bg-gradient-to-r before:from-black/50 before:via-black/20 before:to-transparent before:z-10 after:content-[''] after:absolute after:top-0 after:right-0 after:w-1/5 after:h-full after:bg-gradient-to-l after:from-black/50 after:via-black/20 after:to-transparent after:z-9">
    <div class="swiper-wrapper h-full">
      <?php foreach($bannerDataMobile['data'] as $banner): ?>
        <div class="hero-banner swiper-slide w-full">
          <img class="w-full" src="https://aswservice.com/hotdeal/<?= $banner['resource']['filePath']; ?>" alt="">
        </div>
      <?php endforeach; ?>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next z-11 after:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-right-icon lucide-circle-chevron-right"><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/></svg>
    </div>
    <div class="swiper-button-prev after:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-left-icon lucide-circle-chevron-left"><circle cx="12" cy="12" r="10"/><path d="m14 16-4-4 4-4"/></svg>
    </div>
  </div>
</section>

<script>
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

</script>