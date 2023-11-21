<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//curl --location --request GET 'https://api.geoapify.com/v2/places?categories=healthcare.hospital,commercial,education.school&filter=circle:-0.21861621384592533,51.6027921,5000&bias=proximity:-0.21861621384592533,51.6027921&limit=20&apiKey=YOUR_API_KEY'
	$url = 'https://api.geoapify.com/v2/places?categories=healthcare.hospital,commercial,education.school&filter=circle:' . $_REQUEST['lng'] . ',' . $_REQUEST['lat'] . ',5000&bias=proximity:' . $_REQUEST['lng'] . ',' . $_REQUEST['lat'] . '&limit=20&apiKey=5ce9182e2d9040d994b40a9bf9c7b428';
	//$url='http://api.geonames.org/indNearbyStreetsOSMJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=shammed&maxRows=10&style=SHORT';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch); 

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['features'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
