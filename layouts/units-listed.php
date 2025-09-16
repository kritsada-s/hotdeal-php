<?php
include_once 'utils/api.php';
$units = get_units()['data']['units'];
$activeProjects = get_active_projects()['data'];
$locations = get_locations()['data'];

// echo "<pre>";
// print_r($locations);
// echo "</pre>";

?>
<section id="unitsListed" class="pt-10 pb-8">
  <div class="container">

    <div class="flex flex-col justify-between items-center sorting-wrapper gap-4 mb-10">
      <div class="intro flex flex-col gap-2">
        <h2 class="text-center text-neutral-900 text-2xl md:text-4xl font-bold">ASSETWISE HOT DEAL</h2>
        <p class="text-center text-neutral-700 text-sm md:text-base">รวมยูนิตฮอต ทำเลดีจากแอสเซทไวส์ <br/>ซื้ออยู่เองก็ดี ซื้อไว้ลงทุนก็คุ้ม พร้อมรับสิทธิประโยชน์มากมาย</p>
      </div>

      <div class="h-3"></div>

      <div class="sorting-search w-full">
        <div class="sorting-search w-full bg-neutral-100 p-4 rounded-lg flex flex-col md:flex-row gap-5 justify-between">
          <div class="flex items-start md:items-center gap-2 flex-col md:flex-row">
            <div class="flex items-center gap-2">
              <span class="font-medium text-[14px] flex-shrink-0">เลือกโครงการที่คุณสนใจ</span>
              <select name="project" id="project_selector" class="select">
                <option value="">ทั้งหมด</option>
                <?php foreach ($activeProjects as $project) : ?>
                  <option value="<?= $project['projectID'] ?>"><?= $project['projectNameTH'] ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-[14px] flex-shrink-0">เลือกพื้นที่</span>
              <div class="relative">
                <input type="hidden" name="locations" id="location_selector" value="">
                
                <div class="location-dropdown relative">
                  <button type="button" class="location-dropdown-toggle flex items-center justify-between min-w-[250px] bg-white rounded px-4 py-2 border border-neutral-300" id="locationDropdownToggler">
                    <span id="locationDropdownTogglerText" class="selected-text text-[14px]">ทั้งหมด</span>
                    <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div class="location-dropdown-menu absolute top-[45px] left-0 right-0 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto hidden" id="locationDropdownMenu">
                    <div class="p-2">
                      <label class="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer">
                        <input type="checkbox" id="locationCheckboxAll" class="location-checkbox-all" checked>
                        <span class="text-sm">ทั้งหมด</span>
                      </label>
                      <?php foreach ($locations as $location) : ?>
                        <label class="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer">
                          <input type="checkbox" class="location-checkbox" value="<?= $location['id'] ?>">
                          <span class="text-sm"><?= $location['name'] ?></span>
                        </label>
                      <?php endforeach; ?>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button id="searchBtn" type="button" class="btn btn-primary text-white rounded-full w-[80px] text-[16px] font-medium">ค้นหา</button>
          </div>
          <form action="" id="searchForm" class="hidden items-center gap-2">
            <input type="text" id="searchUnit" name="search" placeholder="ค้นหายูนิตที่คุณสนใจ" class="md:min-w-[250px] w-full border border-neutral-500 rounded-full px-4 py-2 text-neutral-700 focus:bg-white transition">
            <button type="submit" class="btn btn-primary text-white rounded-full w-[80px] text-[16px] font-medium">ค้นหา</button>
          </form>
          <div class="flex items-center gap-2">
              <span class="shrink-0 text-[14px] font-medium">เรียงลำดับตาม : </span>
              <select name="unit" id="sortingUnit" class="select">
                <option value="DESC">ใหม่ - เก่า</option>
                <option value="ASC">เก่า - ใหม่</option>
              </select>
          </div>
        </div>
      </div>
    </div>


    <!-- Loading Animation -->
    <div id="loadingAnimation" class="inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300" style="display: none;">
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <div class="loader"></div>
        </div>
        <p class="text-neutral-600 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <div class="unit-container-wrapper">
      <?php if (count($units) > 0) : ?>
        <div id="unitsContainer" class="grid grid-cols-1 md:grid-cols-3 gap-7">
          <?php foreach ($units as $unit) : ?>
            <?php include 'unit-box.php'; ?>
          <?php endforeach; ?>
        </div>
      <?php else : ?>
        <div class="flex flex-col items-center justify-center gap-5 min-h-[500px]">
          <img src="<?php echo BASE_URL; ?>/images/warning-o.webp" alt="no data" class="w-[140px]">
          <h3 class="text-center text-neutral-900 text-2xl font-medium">ไม่พบข้อมูล</h3>
          <p class="text-center text-neutral-500">กรุณาลองใหม่อีกครั้งภายหลัง</p>
        </div>
      <?php endif; ?>
    </div>
  </div>
</section>