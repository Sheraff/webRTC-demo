<?php

function write($path, $callback) {
	$content = trim(file_get_contents("php://input"));
	$decoded = json_decode($content, true);
	$id = $decoded['id'];
	$data = call_user_func($callback, $decoded);
	file_put_contents($path, $id . " " . $data . "\n", FILE_APPEND);
}

function send_description($path) {
	$id = $_GET['id'];
	if(!file_exists($path)) {
		echo "{}";
		return;
	}
	$lines = file($path);
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

?>