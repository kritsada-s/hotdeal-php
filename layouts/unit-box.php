<div class="rounded-lg overflow-hidden shadow-lg border border-neutral-200 relative">
  <?php if ($unit['isSoldOut']) : ?>
    <div class="absolute top-0 left-0 w-full h-full bg-neutral-900/10 flex items-center justify-center z-[1]">
    <span class="text-white text-xl font-medium flex items-center justify-center px-5 py-2 w-full bg-red-500 rotate-45 absolute top-[10%] left-[30%]">SOLD OUT</span>
    </div>
  <?php endif; ?>
  <div class="unit-wrapper <?= $unit['isSoldOut'] ? 'sold-out' : '' ?>">
    <a href="<?php echo BASE_URL; ?>unit/?id=<?= $unit['id'] ?>">
      <img src="https://aswservice.com/hotdeal/<?= $unit['headerImage']['resource']['filePath'] ?>" class="w-full aspect-square object-cover">
    </a>
    <div class="unit-detail px-4 py-6 relative">
      <?php if ($unit['highlightText']) : ?>
        <div class="bg-accent text-[18px] mb-2 text-white font-medium px-5 py-2 rounded-full absolute -top-5 right-5"><?= $unit['highlightText']; ?></div>
      <?php endif; ?>
      <p class="text-[#00a9a5] mb-2 font-medium"><?= $unit['projectName'] ?></p>
      <h3 class="leading-none font-medium text-3xl"><?= $unit['unitCode'] ?></h3>
      <p class="text-primary mb-7">
        <span class="text-neutral-500 relative line-through">ปกติ <?= number_format($unit['sellingPrice']/1000000, 2, '.', '') ?> ล้าน</span>
        <span class="text-accent text-3xl">พิเศษ</span> <span class="text-accent font-medium text-5xl"><?= number_format($unit['discountPrice']/1000000, 2, '.', '') ?></span> <span class="text-accent text-3xl">ล้าน</span>
      </p>
      <div class="btn-group flex justify-between items-center">
        <a href="<?php echo BASE_URL; ?>unit/?id=<?= $unit['id'] ?>" class="text-neutral-500 hover:text-neutral-800 font-light">ดูรายละเอียด</a>
        <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2 hover:shadow-lg transition-all duration-300" data-unit="<?= $unit['unitCode'] ?>" data-project="<?= getProjectName($unit['projectID']) ?>" data-cisid="<?= getProjectCISId($unit['projectID']) ?>" data-utm-cmp="<?= getCmpUtmByID($unit['campaignID']) ?>">สนใจยูนิตนี้</button>
      </div>
    </div>
  </div>
</div>