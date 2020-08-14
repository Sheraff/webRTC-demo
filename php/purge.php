<?php

$id = $_GET["id"];
purgeFileId('./candidate.txt', $id);
purgeFileId('./answer.txt', $id);
purgeFileId('./offer.txt', $id);

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