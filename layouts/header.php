<?php define('BASE_URL', '/hotdeal/'); ?>
<?php include __DIR__ . '/../utils/api.php'; ?>

<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AssetWise Hot Deal - ยูนิตสวย ราคาโดน คอนโดใกล้มหาลัย</title>
  <link rel="icon" href="<?php echo BASE_URL; ?>/favicon.ico">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  
  <script>
    // Make BASE_URL available to JavaScript
    window.BASE_URL = '<?php echo BASE_URL; ?>';
  </script>
  
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>css/output.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>fonts/style.css">
</head>
<body>
  <header class="px-2 md:px-0 py-3 md:py-4 shadow-md fixed top-0 left-0 right-0 z-50 bg-white">
    <div class="container">
      <div class="flex justify-between items-center">
        <div class="w-1/5 md:w-1/3"></div>
        <div class="logo w-3/5 md:w-1/3 flex justify-center">
          <a href="<?php echo BASE_URL; ?>">
            <img src="<?php echo BASE_URL; ?>images/logo-hr.svg" class="w-[165px]" alt="logo">
          </a>
        </div>
        <div class="w-1/5 md:w-1/3 flex justify-end">
          <button id="memberBtn" class="cursor-pointer hover:bg-neutral-200 rounded-full p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5.25C9.72188 5.25 7.875 7.09688 7.875 9.375C7.875 11.6531 9.72188 13.5 12 13.5C14.2781 13.5 16.125 11.6531 16.125 9.375C16.125 7.09688 14.2781 5.25 12 5.25ZM12 11.25C10.9659 11.25 10.125 10.4086 10.125 9.375C10.125 8.33906 10.9641 7.5 12 7.5C13.0359 7.5 13.875 8.34094 13.875 9.375C13.875 10.4109 13.0359 11.25 12 11.25ZM12 0C5.37188 0 0 5.37188 0 12C0 18.6281 5.37188 24 12 24C18.6281 24 24 18.6281 24 12C24 5.37188 18.6281 0 12 0ZM12 21.75C9.80953 21.75 7.7925 21.015 6.16406 19.7911C6.975 18.2344 8.55 17.25 10.3219 17.25H13.6823C15.4519 17.25 17.025 18.2348 17.8392 19.7911C16.2094 21.0141 14.1891 21.75 12 21.75ZM19.5094 18.2109C18.2438 16.2328 16.0875 15 13.6781 15H10.3219C7.91437 15 5.75859 16.2305 4.49063 18.21C3.09188 16.5234 2.25 14.3578 2.25 12C2.25 6.62344 6.62391 2.25 12 2.25C17.3761 2.25 21.75 6.62391 21.75 12C21.75 14.3578 20.9063 16.5234 19.5094 18.2109Z" fill="black"/>
            </svg>
          </button>
        </div>
    </div>
  </header>
  <div class="h-[64px] md:h-[70px]"></div>
