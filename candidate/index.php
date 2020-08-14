<?php

switch($_SERVER['REQUEST_METHOD']) {
	case 'GET': send(); break;
	case 'POST': write(); break;
	default: break;
}

function send() {
	$id = $_GET["id"];
	if(!file_exists('data.txt')) {
		echo "{ \"candidates\": [] } ";
		return;
	}
	$lines = file('data.txt');
	$matches = array_filter($lines, function ($line) use ($id) {
		return substr($line, 0, strlen($id)) == $id;
	});
	$parsed = array_map(function ($line) use ($id) {
		return substr($line, strlen($id) + 1);
	}, $matches);
	echo "{ \"candidates\": " . json_encode($parsed) . " } ";
}

function write() {
	$content = trim(file_get_contents("php://input"));
	$decoded = json_decode($content, true);
	$id = $decoded['id'];
	$candidate = $decoded['candidate'];
	file_put_contents('data.txt', $id . " " . $candidate . "\n", FILE_APPEND);
}

?>