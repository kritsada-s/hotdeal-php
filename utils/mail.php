<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Alternative function using PHPMailer (recommended for production)
function send_thank_you_email($email, $subject = 'ขอบคุณสำหรับการลงทะเบียน - Thank you for registration', $htmlBody = null, $textBody = null, $unitCode = '', $projectName = '') {
    // Note: This requires PHPMailer library to be installed
    // You can install it via Composer: composer require phpmailer/phpmailer
    
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    
    if ($htmlBody === null) {
      $htmlBody = '
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>ขอบคุณสำหรับการลงทะเบียน AssetWise Hot Deals</title>
      </head>
      <body>
      <table
        width="480px"
        style="
          margin: 20px auto;
          border-width: 0;
          border: 1px solid #ddd;
          font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.5;
        "
        cellspacing="0"
      >
        <tr>
          <td style="text-align: center; background-color: #123f6d; padding: 8px">
            <img
              src="https://assetwise.co.th/wp-content/uploads/2024/09/asw_logo_white-141x72-1.png"
              alt="Assetwise CO., LTD"
              width="85"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 15px 15px">
            ขอบคุณสำหรับการลงทะเบียนให้ความสนใจยูนิต Hot Deals<br/>
            <br />
            <strong>ยูนิตเลขที่</strong> : ' . $unitCode . '<br/>
            <strong>โครงการ</strong> : ' . $projectName . '<br />
            <br/>
            เจ้าหน้าที่ของเราจะติดต่อกลับไปเพื่อให้ข้อมูลเพิ่มเติมในเร็ว ๆ นี้<br />
          </td>
        </tr>
        <tr>
          <td style="padding: 0 15px"><hr style="border-style: dashed" /></td>
        </tr>
        <tr>
          <td style="padding: 15px 15px 20px">
            <strong>AssetWise</strong> We Build Happiness
          </td>
        </tr>
      </table>
      </body>
      </html>';
    }
    if ($textBody === null) {
        $textBody = "ขอบคุณสำหรับการลงทะเบียน\nThank you for your registration.";
    }
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.office365.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'ASW-NoReply@assetwise.co.th';
        $mail->Password   = 'OctoberFest.2022';
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        
        // Recipients
        $mail->setFrom('ASW-NoReply@assetwise.co.th', 'AssetWise Hot Deals');
        $mail->addAddress($email, $unitCode);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $textBody;
        
        $mail->send();
        return ['success' => true, 'message' => 'Thank you email sent successfully'];
        
    } catch (Exception $e) {
        return ['error' => true, 'message' => 'Email sending error: ' . $mail->ErrorInfo];
    }
    
    
    return ['error' => true, 'message' => 'PHPMailer not implemented. Please install PHPMailer library.'];
}

?>