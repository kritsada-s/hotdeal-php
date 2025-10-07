<div class="unit-box rounded-lg overflow-hidden shadow-lg border border-neutral-200 relative">
  <?php if ($unit['isSoldOut']) : ?>
    <!-- <div class="absolute top-0 left-0 w-full h-full bg-neutral-900/10 flex items-center justify-center z-[1]"> -->
    <span class="text-white text-[12px] lg:text-[16px] font-medium flex items-center justify-center px-5 py-2 w-full bg-red-500 rotate-45 absolute top-[20px] lg:top-[5%] left-[56px] lg:left-[30%] z-[3]">SOLD OUT</span>
  <?php endif; ?>
  <div class="unit-wrapper flex flex-col h-full <?= $unit['isSoldOut'] ? 'sold-out' : '' ?>">
    <a href="<?php echo BASE_URL; ?>unit/<?= $unit['id'] ?>" class="relative">
      <?php if ($unit['campaignOverlay']['resource']['filePath']) : ?>
        <img class="absolute top-0 left-0 w-full h-full object-cover z-[2]" src="<?= env('HOTDEAL_ASSETS_PATH'); ?><?= $unit['campaignOverlay']['resource']['filePath'] ?>">
      <?php endif; ?>
      <img src="<?= env('HOTDEAL_ASSETS_PATH'); ?><?= $unit['headerImage']['resource']['filePath'] ?>" class="w-full aspect-square object-cover z-[1]">
    </a>
    <div class="unit-detail px-2 pb-4 pt-6 lg:px-4 lg:pt-6 lg:pb-4 relative flex flex-col h-full justify-between">
      <?php if ($unit['highlightText']) : ?>
        <div class="highlight-tag"><?= $unit['highlightText']; ?></div>
      <?php endif; ?>
      <div class="unit-info">
        <p class="text-[#00a9a5] mb-3 text-[14px] lg:text-[16px] leading-none"><?= $unit['projectName'] ?></p>
        <h3 class="text-primary leading-none font-medium mb-2 text-[22px] lg:text-2xl"><?= $unit['unitCode'] ?></h3>
        <p>
          <span class="text-neutral-500 relative line-through text-[14px] lg:text-[16px] font-light">ปกติ <?= number_format($unit['sellingPrice']/1000000, 2, '.', '') ?> ล้าน</span>
        </p>
        <p class="mb-4 lg:mb-7">
          <span class="text-accent text-[18px] lg:text-xl">พิเศษ</span> <span class="text-accent font-bold text-[22px] lg:text-4xl"><?= number_format($unit['discountPrice']/1000000, 2, '.', '') ?></span> <span class="text-accent text-[18px] lg:text-xl">ล้าน</span>
        </p>
      </div>
      <div class="unit-action btn-group flex flex-col justify-between lg:items-center gap-4">
        <a href="<?php echo BASE_URL; ?>unit?id=<?= $unit['id'] ?>" class="text-neutral-500 hover:text-neutral-800 text-[12px] lg:text-[16px] font-light">ดูรายละเอียด</a>
        <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2 hover:shadow-lg transition-all duration-300 text-[14px] lg:text-base w-full" data-unit="<?= $unit['unitCode'] ?>" data-project="<?= getProjectName($unit['projectID']) ?>" data-cisid="<?= getProjectCISId($unit['projectID']) ?>" data-utm-cmp="<?= getCmpUtmByID($unit['campaignID']) ?>">สนใจยูนิตนี้</button>
      </div>
    </div>
  </div>
</div>