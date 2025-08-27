<div class="unit rounded-lg overflow-hidden shadow-lg border border-neutral-200">
  <img src="https://aswservice.com/hotdeal/<?= $unit['headerImage']['resource']['filePath'] ?>" class="w-full aspect-square object-cover">
  <div class="unit-detail px-4 py-6 relative">
    <?php if ($unit['highlightText']) : ?>
      <div class="bg-accent text-[18px] mb-2 text-white font-medium px-5 py-2 rounded-full absolute -top-5 right-5"><?= $unit['highlightText']; ?></div>
    <?php endif; ?>
    <p class="text-primary mb-2"><?= getProjectName($unit['projectID']) ?></p>
    <h3 class="leading-none font-medium text-3xl"><?= $unit['unitCode'] ?></h3>
    <p class="text-primary mb-7">
      <span class="text-neutral-500 relative line-through">ปกติ <?= number_format($unit['sellingPrice']/1000000, 2, '.', '') ?> ล้าน</span>
      <span class="text-accent text-3xl">พิเศษ</span> <span class="text-accent font-medium text-5xl"><?= number_format($unit['discountPrice']/1000000, 2, '.', '') ?></span> <span class="text-accent text-3xl">ล้าน</span>
    </p>
    <div class="btn-group flex justify-between items-center">
      <a href="<?php echo BASE_URL; ?>unit/?id=<?= $unit['id'] ?>" class="text-neutral-500 hover:text-neutral-800 font-light">ดูรายละเอียด</a>
      <button class="unitBtn cursor-pointer rounded-lg bg-primary text-white px-5 py-2" data-unit="<?= $unit['unitCode'] ?>" data-project="<?= getProjectName($unit['projectID']) ?>" data-cisid="<?= getProjectCISId($unit['projectID']) ?>">สนใจยูนิตนี้</button>
    </div>
  </div>
</div>