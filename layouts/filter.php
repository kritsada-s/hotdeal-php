<?php
include_once 'utils/api.php';
$activeProjects = get_active_projects()['data'];
$locations = get_locations()['data'];
?>
<div class="units_filter_panel col-span-1 md:col-span-6 lg:col-span-3">
  <div class="sorting-search w-full bg-neutral-100 px-4 py-5 rounded-lg flex flex-col gap-5">
    <h3 class="text-lg font-medium">ค้นหายูนิต</h3>
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