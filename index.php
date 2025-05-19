<?php
$url = 'https://aswservice.com/hotdealapi/Unit/GetUnits?perPage=10&page=1&isHomeEnable=false';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if(curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
    exit;
}

// Close cURL session
curl_close($ch);

// Decode JSON response
$data = json_decode($response, true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Units Data</title>
    <link rel="stylesheet" href="css/output.css">
</head>
<body>
  <div class="container mx-auto">
    <h1>Units Data</h1>
    <?php foreach($data['data']['units'] as $unit): ?>
      <div>
        <h2><?php echo $unit['unitCode']; ?></h2>
        <p><a href=""><?php echo $unit['projectID']; ?></a></p>
        <p>Price: <?php echo $unit['sellingPrice']; ?></p>
        <p>Size: <?php echo $unit['discountPrice']; ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</body>
</html>
