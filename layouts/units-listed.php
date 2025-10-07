<?php
include_once 'utils/api.php';
// Server-side first render with pagination defaults
$response = get_units(['page' => 1, 'perPage' => 8]);
$data = isset($response['data']) ? $response['data'] : [];
$units = isset($data['units']) ? $data['units'] : [];
$currentPage = isset($data['currentPage']) ? (int)$data['currentPage'] : 1;
$totalItems = isset($data['total']) ? (int)$data['total'] : count($units);
$perPage = 6;
$totalPages = isset($data['totalPages']) ? (int)$data['total'] : max(1, (int)ceil($totalItems / $perPage));
?>
<section id="unitsListed" class="pt-10 pb-8">
  <div class="container">

    <div class="flex flex-col justify-between items-center sorting-wrapper gap-4 mb-10">
      <div class="intro flex flex-col gap-2">
        <h2 class="text-center text-neutral-900 text-2xl md:text-4xl font-bold">ASSETWISE HOT DEAL</h2>
        <p class="text-center text-neutral-700 text-sm md:text-base">รวมยูนิตฮอต ทำเลดีจากแอสเซทไวส์ <br/>ซื้ออยู่เองก็ดี ซื้อไว้ลงทุนก็คุ้ม พร้อมรับสิทธิประโยชน์มากมาย</p>
      </div>

      <div class="h-3"></div>

      <div id="unit_display_filter" class="w-full grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
        <?php include 'filter.php'; ?>

        <div class="units_display_panel col-span-1 md:col-span-6 lg:col-span-9">
          <pre class="hidden"><?php print_r($response); ?></pre>
          <div id="sorting_wrapper" class="w-full flex justify-between lg:justify-end gap-3 items-center mb-5">
            <button id="mobile_filter_panel_toggler" class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="sorting_wrapper_inner flex items-center gap-3 relative">
              <div class="flex items-center cursor-pointer" id="sortingOptionDropdownToggler">
                <span class="shrink-0 text-[14px] font-medium">เรียงลำดับ : ยูนิต</span>
                <span id="sortingText" class="text-[14px] font-medium">ใหม่ - เก่า</span>
              </div>
              <input type="hidden" name="sortingUnit" id="sortingUnit" value="">
              <div class="sorting-option-dropdown absolute top-[30px] left-0 right-0 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto hidden" id="sortingOptionDropdownMenu">
                <div class="sorting-option-dropdown-item text-[14px] font-medium p-2 hover:bg-neutral-100 cursor-pointer" data-value="DESC">ใหม่ - เก่า</div>
                <div class="sorting-option-dropdown-item text-[14px] font-medium p-2 hover:bg-neutral-100 cursor-pointer" data-value="ASC">เก่า - ใหม่</div>
              </div>
            </div>
          </div>

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
              <div id="unitsContainer" class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
                <?php foreach ($units as $unit) : ?>
                  <?php include 'unit-box.php'; ?>
                <?php endforeach; ?>
              </div>
              
              <!-- Pagination -->
              <div id="paginationContainer" class="mt-8 flex flex-col items-center space-y-4" data-current-page="<?php echo $currentPage; ?>" data-total-pages="<?php echo $totalPages; ?>" data-total-items="<?php echo $totalItems; ?>">
                <!-- Page Info -->
                <div id="pageInfo" class="text-sm text-neutral-600">
                  <span id="currentPageInfo">หน้า <?php echo $currentPage; ?></span>
                  <span class="mx-2">จาก</span>
                  <span id="totalPagesInfo"><?php echo $totalPages; ?></span>
                  <span class="mx-2">หน้า</span>
                  <span>(</span>
                  <span id="totalItemsInfo"><?php echo $totalItems; ?></span>
                  <span>รายการ)</span>
                </div>
                
                <!-- Pagination Controls -->
                <nav class="flex items-center space-x-2" aria-label="Pagination">
                  <button id="prevPage" class="pagination-btn px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer" disabled>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span class="ml-1">ก่อนหน้า</span>
                  </button>
                  
                  <div id="pageNumbers" class="flex items-center space-x-1">
                    <!-- Page numbers will be generated here -->
                  </div>
                  
                  <button id="nextPage" class="pagination-btn px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer" disabled>
                    <span class="mr-1">ถัดไป</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </nav>
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
      </div>

      
    </div>


    <!-- Loading Animation -->
    
  </div>
</section>
