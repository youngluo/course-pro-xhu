<?php



require_once 'api.php';

$api = new API();
$method = isset($_GET['c']) ? $_GET['c'] : 'getCookie';

eval('$api -> ' . $method . '();');
