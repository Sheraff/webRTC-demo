<?php

include 'utils.php';

switch($_SERVER['REQUEST_METHOD']) {
	case 'GET': send(); break;
	case 'POST': write('candidate.txt', function($decoded) { return $decoded['candidate']; }); break;
	default: break;
}

function send() {
	$id = $_GET["id"];
	if(!file_exists('candidate.txt')) {
		echo "{ \"candidates\": [] } ";
		return;
	}
	$lines = file('candidate.txt');
	$matches = array_filter($lines, function ($line) use ($id) {
		return substr($line, 0, strlen($id)) == $id;
	});
	$parsed = array_map(function ($line) use ($id) {
		return substr($line, strlen($id) + 1);
	}, $matches);
	echo "{ \"candidates\": " . json_encode($parsed) . " } ";
}


?>