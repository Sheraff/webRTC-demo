<?php

include 'utils.php';

switch($_SERVER['REQUEST_METHOD']) {
	case 'GET': send_description('answer.txt'); break;
	case 'POST': write('answer.txt', function($decoded) { return json_encode($decoded['description']); }); break;
	default: break;
}

?>