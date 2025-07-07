<?php include '../layouts/header.php'; ?>
<?php
  $unit_id = isset($_GET['id']) ? $_GET['id'] : '';
  $unit_detail = get_unit_detail($unit_id)['data'];
  $unitThumb = $unit_detail['headerImage'];
  $projectName = getProjectName($unit_detail['projectID']);
  $project = getProjectDetail($unit_detail['projectID'])['data'];
  $planImage = $unit_detail['planImages'];
  $unitGallery = $unit_detail['galleries'];

  $projectData = getProjectDataByCode($unit_detail['projectID']);
?>
<section id="unitDetail" class="pt-10 bg-neutral-50">
  <div class="top-panel mb-5">
    <div class="container">
      <a href="/hotdeal" class="unit-detail-header-back flex items-center gap-2 text-sky-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        ยูนิต Hot Deal ทั้งหมด
      </a>
    </div>
  </div>

  <div class="unit-detail-header">
    <div class="container no-padding">
      <div class="project-logo-wrapper w-full hidden md:block">
        <img src="<?= $projectData['ProjectLogo']; ?>" alt="<?= $projectData['ProjectNameTH'] ?>" class="w-[160px]">
      </div>
      <div class="show-unit-wrapper flex flex-col md:flex-row">
        <div class="show-unit-left w-full md:w-3/5 md:py-5">
          <h1 class="text-4xl mx-4 md:mx-0 mb-5 font-medium">
            <span class="text-accent"><?= $unit_detail['unitCode'] ?></span>
            <br class="block md:hidden">
            <span class="text-[20px] md:text-base text-neutral-700"><span class="hidden md:inline"> - </span><?= $projectData['ProjectNameTH'] ?></span>
          </h1>
          <div class="unit-thumb w-full h-auto aspect-[4/3] bg-cover bg-center" 
          style="background-image: url(<?= getImagePath($unitThumb['resource']['filePath']) ?>);"></div>
        </div>
        <div class="show-unit-right w-11/12 md:w-2/5 bg-white shadow-lg md:shadow rounded-t-xl rounded-b-md md:rounded p-5 md:p-10 flex flex-col justify-between mx-auto md:mx-0 -mt-10 md:mt-0 z-10">
          <div class="detail-box">
            <h4 class="text-2xl font-medium mb-4">ข้อมูลยูนิต</h4>
            <ul class="unit-info list-none text-neutral-700 text-lg grid gap-2">
              <li>
                <span class="text-neutral-700">อาคาร :</span>
                <span class=""><?= $unit_detail['towerName'] ?></span>
              </li>
              <li>
                <span class="text-neutral-700">ชั้น :</span>
                <span class=""><?= (Int) $unit_detail['floorName'] ?></span>
              </li>
              <li>
                <span class="text-neutral-700">แบบห้อง :</span>
                <span class=""><?= $unit_detail['modelName'] ?></span>
              </li>
              <li>
            </ul>
            <div class="h-5"></div>
            <h4 class="text-2xl font-medium mb-4">สิทธิพิเศษ Hot Deal</h4>
            <div class="benefits">
              <?php echo $unit_detail['benefits']; ?>
            </div>
          </div>
          <div class="price-box text-xl flex flex-col gap-2">
            <div class="origin-price w-full flex justify-between items-baseline">
              <span>ปกติ</span>
              <span class="text-neutral-500 line-through"><?= number_format($unit_detail['sellingPrice'], 0, '.', ',') ?> ล้าน</span>
            </div>
            <hr class="border-neutral-300 mt-4 mb-5">
            <div class="final-price w-full flex justify-between items-baseline">
              <span>พิเศษ</span>
              <span class="text-red-600 font-bold text-5xl shadow-1"><?= number_format($unit_detail['discountPrice']/1000000, 2, '.', ',') ?> ล้าน*</span>
            </div>
            <div class="reserved-price"></div>
            <div class="h-4"></div>
            <button class="unitBtn bg-accent rounded cursor-pointer w-full h-fit text-2xl text-white font-medium px-10 py-5 hover:scale-105 transition-all duration-300 hover:shadow-lg" data-unit="<?= $unit_detail['unitCode'] ?>" data-project="<?= $projectData['ProjectNameTH'] ?>" data-cisid="<?= getProjectCISId($unit_detail['projectID']) ?>">
              สนใจยูนิตนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-15"></div>
  <div id="projectDetail" class="bg-primary flex flex-col md:flex-row">
    <div class="w-full md:w-1/2 aspect-[4/3] bg-cover bg-center" style="background-image: url(<?= getImagePath($project['headerImage']['resource']['filePath']) ?>);"></div>
    <div class="w-full md:w-1/2 px-5 py-10 md:p-12 text-white flex flex-col justify-center">
      <p class="text-lg font-thin mb-1">ข้อมูลโครงการ</p>
      <h3 class="text-3xl font-medium"><?= $project['projectNameTH'] ?></h3>
      <div class="h-[4px] bg-white w-10 my-7"></div>
      <div class="project-info">
        <div class="project-info-item flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <p class="font-thin">ลักษณะโครงการ</p>
            <p class="text-lg"><?= $project['projectDescription'] ?></p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-thin">พื้นที่โครงการ</p>
            <p class="text-xl"><?= $project['areaDetail'] ?></p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-thin">จำนวนยูนิต</p>
            <p class="text-xl"><?= $project['unitDetail'] ?></p>
          </div>
        </div>
        <div class="h-7"></div>
        <a href="<?= $project['projectURL'] ?>" class="btn btn-outline btn-white hover:text-primary hover:bg-white font-normal" target="_blank">ดูเพิ่มเติม</a>
      </div>
    </div>
  </div>

  <div id="unitPlan" class="py-10 md:py-20">
    <div class="container">
      <h3 class="text-3xl font-medium mb-5 text-center text-primary">แบบแปลนห้อง</h3>
      <div class="w-10 h-[4px] bg-primary mx-auto my-10"></div>
      <div class="w-full md:w-3/4 mx-auto">
      <?php foreach ($planImage as $image) { ?>
        <a href="<?= getImagePath($image['resource']['filePath']) ?>" data-fslightbox="gallery">
          <img src="<?= getImagePath($image['resource']['filePath']) ?>" alt="Unit Plan" class="w-full h-auto border border-neutral-300">
        </a>
      <?php } ?>
      </div>
    </div>
  </div>

  <div id="unitGallery" class="py-10 md:py-20 bg-gradient-to-b from-neutral-50 to-white">
    <div class="container">
      <h3 class="text-3xl font-medium mb-5 text-center text-primary">บรรยากาศภายในห้อง</h3>
      <div class="w-10 h-[4px] bg-primary mx-auto my-10"></div>
      <div class="w-full md:w-3/4 mx-auto relative">
        <div id="unitGallerySwiper" class="swiper">
          <div class="swiper-wrapper">
            <?php foreach ($unitGallery as $image) { ?>
              <a href="<?= getImagePath($image['resource']['filePath']) ?>" data-fslightbox="gallery" class="swiper-slide aspect-video bg-cover bg-center" style="background-image: url(<?= getImagePath($image['resource']['filePath']) ?>);"></a>
            <?php } ?>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="unit-gallery-next swiper-button-next z-11 after:hidden opacity-90 hover:opacity-100 transition-all duration-300">
          <img src="<?= BASE_URL ?>images/slide-arrow-r.png" alt="next">
        </div>
        <div class="unit-gallery-prev swiper-button-prev after:hidden opacity-90 hover:opacity-100 transition-all duration-300">
          <img src="<?= BASE_URL ?>images/slide-arrow-l.png" alt="prev">
        </div>
      </div>
    </div>
  </div>
</section>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const unitGallerySwiper = document.getElementById('unitGallerySwiper');
    new Swiper(unitGallerySwiper, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.unit-gallery-next',
        prevEl: '.unit-gallery-prev',
      },
    });
  });
</script>
<script type="text/javascript" src="../js/fslightbox.js" defer></script>
<?php include '../layouts/footer.php'; ?>