<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] .'+' . $_REQUEST['lng'] . '&key=fdee68aa8f30420bbfad261a51e61f97';
	
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
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

	echo json_encode($output); 

?>
