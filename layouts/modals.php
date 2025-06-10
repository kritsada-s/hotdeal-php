<script>
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('emailInput').style.display = 'block';
    document.getElementById('otpInput').style.display = 'none';

    document.getElementById('submitEmail').addEventListener('click', function() {
      document.getElementById('emailInput').style.display = 'none';
      document.getElementById('otpInput').style.display = 'block';
    });

    document.getElementById('closeModal').addEventListener('click', function() {
      document.getElementById('emailInput').style.display = 'block';
      document.getElementById('otpInput').style.display = 'none';
    });
  });
</script>

<dialog id="memberModal" class="modal">
  <div class="modal-box">
    <div id="emailInput">
      <h3 class="text-2xl font-bold mb-5">กรุณากรอกอีเมล</h3>
      <input type="email" placeholder="example@gmail.com" class="input input-bordered input-xl" />
      <div class="modal-footer mt-5">
        <button id="submitEmail" class="btn">รับรหัส OTP</button>
      </div>
    </div>
    <div id="otpInput">
      <h3 class="text-2xl font-bold mb-5">กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมล</h3>
      <input type="text" placeholder="123456" class="input input-bordered input-md" />
      <div class="modal-footer mt-5">
        <button class="btn">ยืนยัน</button>
      </div>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>ปิด</button>
  </form>

</dialog>