<?php

switch($_SERVER['REQUEST_METHOD']) {
	case 'GET': send(); break;
	case 'POST': write(); break;
	default: break;
}

function send() {
	$id = $_GET['id'];
	if(!file_exists('data.txt')) {
		echo "{}";
		return;
	}
	$lines = file('data.txt');
	$matches = array_filter($lines, function ($line) use ($id) {
		return substr($line, 0, strlen($id)) == $id;
	});
	if(count($matches) != 0) {
		$parsed = substr($matches[0], strlen($id) + 1);
		$result = [ "description" => json_decode($parsed) ];
		echo json_encode($result);
	} else {
		echo "{}";
	}
}

function write() {
	$content = trim(file_get_contents("php://input"));
	$decoded = json_decode($content, true);
	$id = $decoded['id'];
	$description = json_encode($decoded['description']);
	file_put_contents('data.txt', $id . " " . $description . "\n", FILE_APPEND);
}

?>