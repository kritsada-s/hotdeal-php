<dialog id="memberModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-2xl text-center font-bold mb-5">ข้อมูลส่วนตัว</h3>
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
        <input type="text" id="phone" name="phone" autocomplete="off" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="email">อีเมล</label>
        <input type="text" id="email" name="email" autocomplete="off" disabled readonly class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="lineId">Line ID</label>
        <input type="text" id="lineId" name="lineId" class="input input-bordered w-full">
      </div>
    </div>
    <div class="flex justify-between gap-4 w-full mt-5">
      <button id="submitMemberBtn" class="btn btn-primary">
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

<dialog id="loginModal" class="modal">
  <div class="modal-box px-4 md:px-8 py-10">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg text-center font-bold mb-5">กรุณากรอกอีเมลเพื่อรับรหัส OTP</h3>
    <div class="form-group">
      <label for="otp_email" class="block mb-2">อีเมล</label>
      <input type="email" id="otp_email" name="otp_email" class="input validator input-lg input-bordered w-full" required>
      <div class="validator-hint">กรุณากรอกอีเมลให้ถูกต้อง</div>
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
    <h3 class="text-lg font-bold mb-5 text-center">กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล</h3>
    <div class="form-group flex">
      <label for="otp" class="hidden">รหัส OTP</label>
      <input type="text" id="otp" name="otp" class="input input-xl input-bordered w-2/3 mx-auto text-center">
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
      <div class="form-group flex flex-col gap-2">
        <label for="summaryFirstName">ชื่อ</label>
        <input type="text" id="summaryFirstName" name="summaryFirstName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryLastName">นามสกุล</label>
        <input type="text" id="summaryLastName" name="summaryLastName" class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryEmail">อีเมล</label>
        <input type="text" id="summaryEmail" name="summaryEmail" readonly disabled class="input input-bordered w-full">
      </div>
      <div class="form-group flex flex-col gap-2">
        <label for="summaryPhone">เบอร์โทรศัพท์</label>
        <input type="text" id="summaryPhone" name="summaryPhone" class="input input-bordered w-full">
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
        ลงทะเบียน
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>