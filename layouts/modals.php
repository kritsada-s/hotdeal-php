<dialog id="memberModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-2xl text-center font-bold mb-5">ข้อมูลส่วนตัว</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="firstName">ชื่อ <span class="text-red-500">*</span></label>
        <input type="text" id="firstName" required name="firstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="lastName">นามสกุล <span class="text-red-500">*</span></label>
        <input type="text" id="lastName" required name="lastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="phone">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
        <input type="text" id="phone" required name="phone" autocomplete="off" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="email">อีเมล <span class="text-red-500">*</span></label>
        <input type="text" id="email" required name="email" autocomplete="off" disabled readonly class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="lineId">Line ID</label>
        <input type="text" id="lineId" name="lineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button id="updateMemberBtn" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
        บันทึก
      </button>
      <button id="logoutBtn" class="btn btn-outline btn-error hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
        ออกจากระบบ
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="registerModal" class="modal">
<div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-2xl text-center font-bold mb-5">ลงทะเบียน</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group flex flex-col gap-2">
        <label for="registerFirstName">ชื่อ <span class="text-red-500">*</span></label>
        <input type="text" id="registerFirstName" required name="registerFirstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="registerLastName">นามสกุล <span class="text-red-500">*</span></label>
        <input type="text" id="registerLastName" required name="registerLastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="registerPhone">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
        <input type="text" id="registerPhone" required name="registerPhone" autocomplete="off" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="registerEmail">อีเมล <span class="text-red-500">*</span></label>
        <input type="text" id="registerEmail" required name="registerEmail" autocomplete="off" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="registerLineId">Line ID</label>
        <input type="text" id="registerLineId" name="registerLineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button id="registerSubmitBtn" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
        บันทึก
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
    <h3 class="text-lg text-center font-bold mb-5">กรุณาเลือกวิธีการรับรหัส OTP</h3>
    
    <!-- Radio buttons for OTP method selection -->
    <div class="form-group mb-4">
      <div class="flex gap-6 justify-center">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="otp_method" value="phone" class="radio radio-primary" checked>
          <span class="text-sm">เบอร์โทรศัพท์</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="otp_method" value="email" class="radio radio-primary">
          <span class="text-sm">อีเมล</span>
        </label>
      </div>
    </div>

    <!-- Email input (hidden by default) -->
    <div class="form-group hidden" id="email-input-group">
      <label for="otp_email" class="block mb-2">อีเมล</label>
      <input type="email" id="otp_email" name="otp_email" class="input validator input-lg input-bordered w-full">
      <div class="validator-hint">กรุณากรอกอีเมลให้ถูกต้อง</div>
    </div>

    <!-- Phone input (default visible) -->
    <div class="form-group" id="phone-input-group">
      <label for="otp_phone" class="block mb-2">เบอร์โทรศัพท์</label>
      <input type="tel" id="otp_phone" name="otp_phone" class="input validator input-lg input-bordered w-full" required>
      <div class="validator-hint">กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง</div>
    </div>
    <div class="flex justify-end gap-4 w-full mt-5">
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
    <h3 class="text-lg font-bold mb-2 text-center" id="otp-modal-title">กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์</h3>
    <span class="text-sm mx-auto block mb-3 text-center" id="otp-modal-subtitle"></span>
    <div class="form-group flex">
      <label for="otp" class="hidden">รหัส OTP</label>
      <input type="text" id="otp" name="otp" autofocus class="input input-xl input-bordered w-2/3 mx-auto text-center">
    </div>
    <div class="flex justify-end gap-4 w-full mt-5">
      <button id="verifyOTPBtn" class="btn btn-primary">
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
    <h3 class="text-2xl text-center font-bold mb-5">ลงทะเบียน</h3>
    <div class="detail mb-5 border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-2">
      <p class="text-lg">ยูนิต : <span id="summaryUnit" class="font-bold text-accent"></span></p>
      <p class="text-xl">โครงการ : <span id="summaryProject"></span></p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" id="projectID" name="projectID">
      <input type="hidden" id="utmCmp" name="utmCmp">
      <div class="form-group flex flex-col gap-2">
        <label for="summaryFirstName">ชื่อ <span class="text-red-500">*</span></label>
        <input type="text" id="summaryFirstName" required name="summaryFirstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryLastName">นามสกุล <span class="text-red-500">*</span></label>
        <input type="text" id="summaryLastName" required name="summaryLastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryEmail">อีเมล <span class="text-red-500">*</span></label>
        <input type="text" id="summaryEmail" required name="summaryEmail" readonly disabled class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryPhone">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
        <input type="text" id="summaryPhone" required name="summaryPhone" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryLineId">Line ID</label>
        <input type="text" id="summaryLineId" name="summaryLineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="alert alert-info alert-outline my-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <span class="font-light">กรุณาอ่าน <a href="https://assetwise.co.th/privacy-policy/" class="font-normal underline" target="_blank">ข้อตกลงการใช้งาน และ นโยบายข้อมูลส่วนบุคคล</a> ก่อนลงทะเบียน</span>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button id="summaryCancelBtn" class="btn btn-outline btn-error hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ยกเลิก
      </button>
      <button id="summarySubmitBtn" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
        <span class="loading loading-spinner loading-sm hidden"></span>
        ลงทะเบียน
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>