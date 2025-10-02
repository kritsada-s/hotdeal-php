<?php include '../layouts/header.php'; ?>
<?php
  $unit_id = isset($_GET['id']) ? $_GET['id'] : '';
  $unit_detail = get_unit_detail($unit_id)['data'];
  if (empty($unit_detail)) {
    header('Location: /hotdeal/404');
    exit;
  }
  $unitThumb = $unit_detail['headerImage'];
  $projectName = getProjectName($unit_detail['projectID']);
  $project = getProjectDetail($unit_detail['projectID'])['data'];
  $planImage = $unit_detail['planImages'];
  $unitGallery = $unit_detail['galleries'];
  $projectURL = $project['projectURL'];

  $projectData = getProjectDataByCode($unit_detail['projectID']);
  $projectGallery = get_project_gallery($projectURL);

  $gallery[] = $unitThumb;
  foreach ($unitGallery as $image) {
    $gallery[] = $image;
  }
  foreach ($planImage as $image) {
    $gallery[] = $image;
  }
?>

<style>
  :root {
    --swiper-pagination-progressbar-size: 8px;
    --swiper-pagination-color: #F1683B;
  }
  
  /* Facility Swiper Styles */
  /* .facility-main-wrapper {
    height: 550px;
  } */

  @media screen and (max-width: 480px) {
    .facility-main-wrapper {
      height: auto;
      min-height: 220px;
    }
  }
  
  .facility-thumb-wrapper {
    /* height: 120px; */
    margin-top: 10px;
  }
  
  .facility-thumb-wrapper .swiper-slide {
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }

  @media screen and (max-width: 480px) {
    .facility-thumb-wrapper .swiper-slide {
      height: 75px;
    }
  }
  
  .facility-thumb-wrapper .swiper-slide-thumb-active {
    border-color: #F1683B;
    opacity: 1 !important;
  }
  
  .facility-thumb-wrapper .swiper-slide img {
    opacity: 0.5;
    background-color: #fff;
    transition: opacity 0.3s ease;
  }
  
  .facility-thumb-wrapper .swiper-slide-thumb-active img {
    opacity: 1;
  }
  
  .facility-thumb-wrapper .swiper-slide:hover img {
    opacity: 1;
  }
</style>

<section id="unitDetail" class="pt-10 bg-[#edf2f6]">
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
        <img src="https://assetwise.co.th/wp-content/uploads/<?= $projectData['logo']; ?>" alt="<?= $projectData['nameTH'] ?>" class="w-[160px]">
      </div>
      <div class="show-unit-wrapper flex flex-col md:flex-row">
        <div class="show-unit-left w-full md:w-3/5 md:py-5">
          <h1 class="text-4xl mx-4 md:mx-0 mb-5 font-medium">
            <span class="text-accent"><?= $unit_detail['unitCode'] ?></span>
            <br class="block md:hidden">
            <span class="text-[20px] md:text-base text-neutral-700"><span class="hidden md:inline"></span><?= $projectData['nameTH'] ?></span>
          </h1>
          <div class="gallery-wrapper w-full h-auto aspect-[4/3] bg-neutral-900">
            <div class="swiper" id="mainGallerySwiper">
              <div class="swiper-wrapper">
                <?php foreach ($gallery as $image) { ?>
                  <a href="<?= getImagePath($image['resource']['filePath']) ?>" class="gallery-item swiper-slide md:aspect-[4/3] aspect-square bg-cover bg-center" data-lity>
                    <img src="<?= getImagePath($image['resource']['filePath']) ?>" alt="<?= $unit_detail['unitCode'] ?>" class="w-auto h-full mx-auto object-contain">
                  </a>
                <?php } ?>
              </div>
              <div class="swiper-pagination"></div>
              <div class="main-gallery-next swiper-button-next z-11 after:hidden opacity-90 hover:opacity-100 transition-all duration-300">
                <div class="h-18 aspect-square p-5 bg-gray-200/60 rounded-full flex items-center justify-center scale-75 md:scale-100">
                <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 185.343 185.343" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path> </g> </g> </g></svg>
                </div>
              </div>
              <div class="main-gallery-prev swiper-button-prev after:hidden opacity-90 hover:opacity-100 transition-all duration-300">
                <div class="h-18 aspect-square p-5 bg-gray-200/60 rounded-full flex items-center justify-center scale-75 md:scale-100">
                  <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 185.343 185.343" xml:space="preserve" fill="#000000" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path> </g> </g> </g></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="show-unit-right w-11/12 md:w-2/5 bg-white shadow-lg md:shadow rounded-t-xl rounded-b-md md:rounded pt-7 px-5 pb-5 md:p-10 flex flex-col gap-7 md:gap-0 justify-between mx-auto md:mx-0 -mt-10 md:mt-0 z-10">
          <div class="detail-box">
            <div class="project-logo-wrapper w-full md:hidden mb-5">
              <img src="https://assetwise.co.th/wp-content/uploads/<?= $projectData['logo']; ?>" alt="<?= $projectData['nameTH'] ?>" class="w-[140px]">
            </div>
            <h4 class="text-xl font-medium bg-linear-[10deg,#268b88,#71efeb] text-white rounded-t-md px-5 py-3">ข้อมูลยูนิต</h4>
            <ul class="unit-info list-none text-neutral-700 text-lg grid gap-2 border border-x-[#2b918e] border-b-[#2b918e] border-t-0 rounded-b-md px-5 py-3">
              <li>
                <span class="text-neutral-700 font-medium">อาคาร :</span>
                <span class=""><?= $unit_detail['towerName'] ?></span>
              </li>
              <li>
                <span class="text-neutral-700 font-medium">ชั้น :</span>
                <span class=""><?= (Int) $unit_detail['floorName'] ?></span>
              </li>
              <li>
                <span class="text-neutral-700 font-medium">แบบห้อง :</span>
                <span class=""><?= $unit_detail['modelName'] ?></span>
              </li>
              <li>
                <span class="text-neutral-700 font-medium">พื้นที่ :</span>
                <span class="lowercase"><?= $unit_detail['unitArea'] ?> <?= $unit_detail['unit_Measure'] ?></span>
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
              <span class="text-neutral-500 line-through"><?= number_format($unit_detail['sellingPrice'], 0, '.', ',') ?> บาท</span>
            </div>
            <hr class="border-neutral-300 mt-4 mb-5">
            <div class="final-price w-full flex justify-between items-baseline">
              <span>พิเศษ</span>
              <span class="text-red-600 font-bold text-5xl shadow-1"><?= number_format($unit_detail['discountPrice'], 0, '.', ',') ?></span>
            </div>
            <div class="reserved-price"></div>
            <div class="h-4"></div>
            <button class="unitBtn bg-accent rounded cursor-pointer w-full h-fit text-2xl text-white font-medium px-10 py-5 hover:scale-105 transition-all duration-300 hover:shadow-lg" data-unit="<?= $unit_detail['unitCode'] ?>" data-project="<?= $projectData['nameTH'] ?>" data-cisid="<?= $projectData['ProjectID'] ?>" data-utm-cmp="<?= getCmpUtmByID($unit_detail['campaignID']) ?>">
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
      <h3 class="text-3xl font-medium"><?= $projectData['nameTH'] ?></h3>
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
          <?php if (isset($project['moreDetail']) && $project['moreDetail'] !== '') : ?>
            <div class="h-5"></div>
            <div class="flex flex-col gap-2">
              <p class="font-thin">รายละเอียดเพิ่มเติม</p>
              <?= $project['moreDetail'] ?>
            </div>
          <?php endif; ?>
        </div>
        <div class="h-7"></div>
        <a href="<?= $project['projectURL'] ?>" class="btn btn-outline btn-white hover:text-primary hover:bg-white font-normal" target="_blank">ดูเพิ่มเติม</i></a>
      </div>
    </div>
  </div>

  <?php if (!isset($gallery['error']) || $gallery['error'] != 1) : ?>
  <div id="facility" class="py-10 md:py-20">
    <div class="container">
      <h3 class="text-3xl font-medium mb-5 text-center text-primary">สิ่งอำนวยความสะดวก</h3>
      <div class="w-10 h-[4px] bg-primary mx-auto my-10"></div>
      <div class="w-full md:w-3/4 mx-auto">
        <!-- Main Facility Swiper -->
        <div id="facilityMainSwiper" class="facility-main-wrapper swiper mb-4">
          <div class="swiper-wrapper">
            <?php foreach ($projectGallery as $item) { ?>
            <div class="facility-item swiper-slide">
              <a href="<?= $item['image'] ?>" class="w-full h-full rounded-lg" data-lity>
                <img src="<?= $item['image'] ?>" alt="<?= $item['title'] ?>" class="w-full h-full rounded-lg aspect-video object-cover">
              </a>
            </div>
            <?php } ?>
          </div>
          <div class="swiper-button-prev facility-main-prev after:hidden opacity-90 hover:opacity-100 transition-all duration-300 rotate-180 scale-75 md:scale-100">
            <div class="h-18 aspect-square p-5 bg-gray-200/80 rounded-full flex items-center justify-center">
            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 185.343 185.343" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path> </g> </g> </g></svg>
            </div>
          </div>
          <div class="swiper-button-next facility-main-next after:hidden opacity-90 hover:opacity-100 transition-all duration-300 scale-75 md:scale-100">
            <div class="h-18 aspect-square p-5 bg-gray-200/80 rounded-full flex items-center justify-center">
            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 185.343 185.343" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path> </g> </g> </g></svg>
            </div>
          </div>
        </div>
        
        <!-- Thumbnail Swiper -->
        <div id="facilityThumbSwiper" class="facility-thumb-wrapper swiper">
          <div class="swiper-wrapper">
            <?php foreach ($projectGallery as $item) { ?>
            <div class="facility-thumb-item swiper-slide cursor-pointer">
              <img src="<?= $item['image'] ?>" alt="<?= $item['title'] ?>" class="w-full h-full object-cover rounded opacity-60 hover:opacity-100 transition-opacity duration-300">
            </div>
            <?php } ?>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php endif; ?>  

</section>

<?php include '../layouts/footer.php'; ?>
<script type="text/javascript" src="../js/fslightbox.js" defer></script>