<?php
$menus = [
  "menu1" => [
    [
      "id" => 1,
      "name" => "คอนโดมิเนียม",
      "link" => "https://assetwise.co.th/th/condominium",
    ],
    [
      "id" => 2,
      "name" => "บ้านและทาวน์โฮม",
      "link" => "https://assetwise.co.th/th/house"
    ],
    [
      "id" => 3,
      "name" => "โปรโมชั่น",
      "link" => "https://assetwise.co.th/th/house"
    ],
    [
      "id" => 4,
      "name" => "รู้จักแอสเซทไวส์",
      "link" => "https://assetwise.co.th/th/about-us"
    ],
    [
      "id" => 5,
      "name" => "นักลงทุนสัมพันธ์",
      "link" => "https://investor.assetwise.co.th/th/home"
    ],
    [
      "id" => 6,
      "name" => "แอสเซทไวส์คลับ",
      "link" => "https://assetwise.co.th/th/club"
    ],
    [
      "id" => 7,
      "name" => "ข่าวสาร",
      "link" => "https://assetwise.co.th/th/news"
    ],
    [
      "id" => 8,
      "name" => "บล็อก",
      "link" => "https://assetwise.co.th/th/blog"
    ],
  ],
  "menu2" => [
    [
      "id" => 1,
      "name" => "Bank Matching",
      "link" => "https://aswinno.assetwise.co.th/bankmatching"
    ]
  ],
  "menu3" => [
    [
      "id" => 1,
      "name" => "เสนอขายที่ดิน",
      "link" => "https://aswland.assetwise.co.th/"
    ],
    [
      "id" => 2,
      "name" => "ฝากขาย-ฝากเช่า",
      "link" => "https://www.assetaplus.com/"
    ]
  ],
  "menu4" => [
    [
      "id" => 1,
      "name" => "ติดต่อเรา",
      "link" => "https://assetwise.co.th/th/contact"
    ],
    [
      "id" => 2,
      "name" => "ร้องเรียนธรรมาภิบาล",
      "link" => "https://assetwise.co.th/th/appeal-form"
    ],
    [
      "id" => 3,
      "name" => "ติดต่อผู้คุ้มครองข้อมูลส่วนบุคคล",
      "link" => "https://services.assetwise.co.th/DSRM/DSRForm"
    ],
    [
      "id" => 4,
      "name" => "นโยบายข้อมูลส่วนบุคคล",
      "link" => "https://assetwise.co.th/privacy-policy/"
    ],
  ],
];
?>

<footer class="bg-neutral-800 pt-9 pb-4 px-4 md:px-0">
  <div class="container">
    <div class="w-full flex flex-col md:flex-row">
      <div class="w-full md:w-4/12 flex flex-col gap-3 mb-5 md:mb-0">
        <img src='https://assetwise.co.th/wp-content/themes/seed-spring/img/th/logo-asw.png' alt="" width="160" height="35" />
        <h4 class="text-white text-[24px]">ติดตามแอสเซทไวส์</h4>
        <div class="social-listed flex w-2/3 gap-3">
          <a href="https://th-th.facebook.com/AssetWiseThailand/" target="_blank" class="w-15" title="Facebook">
            <img src="<?php echo BASE_URL; ?>images/fb-o.png" alt="Facbook">
          </a>
          <a href="https://page.line.me/assetwise" target="_blank" title="Line" class="w-15">
            <img src="<?php echo BASE_URL; ?>images/line-o.png" alt="Line">
          </a>
          <a href="https://www.instagram.com/assetwisethailand" target="_blank" title="Instagram" class="w-15">
            <img src="<?php echo BASE_URL; ?>images/ig-o.png" alt="Instagram">
          </a>
          <a href="https://www.youtube.com/c/AssetwiseChannel" target="_blank" title="Youtube" class="w-15">
            <img src="<?php echo BASE_URL; ?>images/yt-o.png" alt="Youtube">
          </a>
          <a href="https://www.tiktok.com/@assetwise" target="_blank" title="Tiktok" class="w-15">
            <img src="<?php echo BASE_URL; ?>images/tt-o.png" alt="Tiktok">
          </a>
        </div>
      </div>
      <div class="w-full md:w-8/12 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:flex-row justify-between">
        <div class="footer-menu">
          <h4 class="text-white text-[18px]">แอสเซทไวส์</h4>
          <ul>
            <?php foreach ($menus["menu1"] as $menu) : ?>
              <li>
                <a href="<?= $menu["link"] ?>" class="text-neutral-400 text-[18px] hover:text-white transition"><?= $menu["name"] ?></a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div class="footer-menu">
          <h4 class="text-white text-[18px]">บริการ</h4>
          <ul>
            <?php foreach ($menus["menu2"] as $menu) : ?>
              <li>
                <a href="<?= $menu["link"] ?>" class="text-neutral-400 text-[18px] hover:text-white transition"><?= $menu["name"] ?></a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div class="footer-menu">
          <h4 class="text-white text-[18px]">สนใจทำธุรกิจกับเรา</h4>
          <ul>
            <?php foreach ($menus["menu3"] as $menu) : ?>
              <li>
                <a href="<?= $menu["link"] ?>" class="text-neutral-400 text-[18px] hover:text-white transition"><?= $menu["name"] ?></a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div class="footer-menu">
          <h4 class="text-white text-[18px]">ติดต่อ</h4>
          <ul>
            <?php foreach ($menus["menu4"] as $menu) : ?>
              <li>
                <a href="<?= $menu["link"] ?>" class="text-neutral-400 text-[18px] hover:text-white transition"><?= $menu["name"] ?></a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
    </div>
    <p class="text-neutral-400 font-thin text-sm text-center pt-4 mt-4 border-t border-t-neutral-400">© สงวนลิขสิทธิ์ พ.ศ. 2568 บริษัท แอสเซทไวส์ จำกัด (มหาชน)</p>
  </div>
</footer>
</body>
</html>