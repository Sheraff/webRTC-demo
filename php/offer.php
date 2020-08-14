<?php

include 'utils.php';

switch($_SERVER['REQUEST_METHOD']) {
	case 'GET': send_description('offer.txt'); break;
	case 'POST': write('offer.txt', function($decoded) { return json_encode($decoded['description']); }); break;
	default: break;
}

?>