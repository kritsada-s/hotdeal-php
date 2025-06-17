<dialog id="memberModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-5">ข้อมูลส่วนตัว</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="firstName">ชื่อ</label>
        <input type="text" id="firstName" name="firstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="lastName">นามสกุล</label>
        <input type="text" id="lastName" name="lastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="phone">เบอร์โทรศัพท์</label>
        <input type="text" id="phone" name="phone" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="email">อีเมล</label>
        <input type="text" id="email" name="email" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="lineId">Line ID</label>
        <input type="text" id="lineId" name="lineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button class="btn btn-primary">
        <i data-lucide="save"></i>
        บันทึก
      </button>
      <button id="logoutBtn" class="btn btn-outline btn-error hover:text-white">
        <i data-lucide="log-out"></i>
        ออกจากระบบ
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="loginModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-5">กรุณากรอกอีเมลเพื่อรับรหัส OTP</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="otp_email">อีเมล</label>
        <input type="email" id="otp_email" name="otp_email" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button class="btn btn-primary" id="requestOTPBtn">
        <i data-lucide="send"></i>
        ส่งรหัส OTP
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="otpModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-5">กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="otp">รหัส OTP</label>
        <input type="text" id="otp" name="otp" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button class="btn btn-primary">
        <i data-lucide="check"></i>
        ยืนยัน
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="summaryModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-5">ลงทะเบียน</h3>
    <div class="detail mb-5 border border-gray-300 rounded-lg p-4 flex flex-col gap-2">
      <p class="text-lg">ยูนิต : <span id="summaryUnit" class="font-bold text-accent"></span></p>
      <p class="text-xl">โครงการ : <span id="summaryProject"></span></p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="summary">ชื่อ</label>
        <input type="text" id="summaryFirstName" name="summaryFirstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summary">นามสกุล</label>
        <input type="text" id="summaryLastName" name="summaryLastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summary">อีเมล</label>
        <input type="text" id="summaryEmail" name="summaryEmail" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summary">เบอร์โทรศัพท์</label>
        <input type="text" id="summaryPhone" name="summaryPhone" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summary">Line ID</label>
        <input type="text" id="summaryLineId" name="summaryLineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="alert alert-info alert-outline my-4">
      <i data-lucide="info"></i>
      <span class="font-light">กรุณาอ่าน <a href="#" class="font-normal underline">ข้อตกลงการใช้งาน</a> และ <a href="#" class="font-normal underline">นโยบายข้อมูลส่วนบุคคล</a> ก่อนลงทะเบียน</span>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button class="btn btn-primary">
        <i data-lucide="check"></i>
        ลงทะเบียน
      </button>
      <button class="btn btn-outline btn-error hover:text-white">
        <i data-lucide="x"></i>
        ยกเลิก
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>