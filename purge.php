<?php

$id = $_GET["id"];
purgeFileId('./candidate/data.txt', $id);
purgeFileId('./answer/data.txt', $id);
purgeFileId('./offer/data.txt', $id);

function purgeFileId($path, $id) {
	$lines = file($path);

	$output = [];
	foreach($lines as $line) {
		if(!substr($line, 0, strlen($id)) == $id) {
			$output[] = $line;
		}
	}

	$out = implode("\n", $output);
	file_put_contents($path, $out);
}

?>