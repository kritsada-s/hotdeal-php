<?php
include_once 'utils/api.php';
$activeProjects = get_active_projects()['data'];
$locations = get_locations()['data'];
?>
<div class="units_filter_panel col-span-1 md:col-span-6 lg:col-span-3">
  <!-- Mobile overlay -->
  <div id="mobile_filter_overlay" class="fixed inset-0 bg-black/40 z-40 hidden md:hidden"></div>

  <div id="mobile_filter_panel" class="sorting-search bg-neutral-100 px-4 py-5 rounded-lg flex flex-col gap-5 fixed inset-y-0 left-0 z-50 max-w-[360px] w-full shadow-xl transform -translate-x-full transition-transform duration-300 md:static md:translate-x-0 md:transform-none md:shadow-none md:max-w-none md:w-auto md:block">
    <!-- Close button (mobile only) -->
    <button id="mobile_filter_panel_close" type="button" class="md:hidden absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-neutral-300 shadow-sm">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h3 class="text-lg font-medium mb-3">ค้นหายูนิต</h3>
    <div class="flex items-start gap-5 flex-col">
      <div class="flex flex-col w-full">
        <div class="border bg-primary border-primary text-white rounded-tl-lg rounded-tr-lg p-4 leading-none">
          <span class="font-medium text-[18px]">เลือกดูตามโครงการ</span>
        </div>
        <?php if (count($activeProjects) > 0) : ?>
          <div id="projectSelectorList" class="border border-t-0 border-primary bg-white rounded-bl-lg rounded-br-lg px-2 py-4">
            <?php foreach ($activeProjects as $project) : ?>
              <label class="flex items-center gap-2 p-2 hover:bg-neutral-50 cursor-pointer">
                <input type="checkbox" class="project-checkbox w-4 h-4" value="<?= $project['projectID'] ?>">
                <span class="text-[16px]"><?= $project['projectNameTH'] ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        <?php else : ?>
          <span class="text-sm">ไม่มีโครงการ</span>
        <?php endif; ?>
      </div>
      <div class="flex flex-col w-full">
        <div class="border bg-primary border-primary text-white rounded-tl-lg rounded-tr-lg p-4 leading-none">
          <span class="font-medium text-[18px]">เลือกดูตามพื้นที่</span>
        </div>
        <input type="hidden" id="locationsListed" name="locationsListed" value="">
        <div class="border border-t-0 border-primary bg-white rounded-bl-lg rounded-br-lg px-2 py-4">
          <?php if (count($locations) > 0) : ?>
            <select id="location_selector" class="w-full" name="locations[]" multiple>
              <option value="">ทั้งหมด</option>
              <?php foreach ($locations as $location) : ?>
                <option value="<?= $location['id'] ?>"><?= $location['name'] ?></option>
              <?php endforeach; ?>
            </select>
          <?php else : ?>
            <span class="text-sm">ไม่มีพื้นที่</span>
          <?php endif; ?>
        </div>
      </div>
      <button id="searchBtn" type="button" class="btn btn-primary text-white rounded-full w-[80px] text-[16px] font-medium">ค้นหา</button>
    </div>
    <form action="" id="searchForm" class="hidden items-center gap-2">
      <input type="text" id="searchUnit" name="search" placeholder="ค้นหายูนิตที่คุณสนใจ" class="md:min-w-[250px] w-full border border-neutral-500 rounded-full px-4 py-2 text-neutral-700 focus:bg-white transition">
      <button type="submit" class="btn btn-primary text-white rounded-full w-[80px] text-[16px] font-medium">ค้นหา</button>
    </form>
  </div>
</div>