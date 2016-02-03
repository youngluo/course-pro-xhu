<?php

header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Headers:X-Requested-With');

require_once 'api.php';

$api = new API();
$method = isset($_GET['c']) ? $_GET['c'] : 'getCookie';

$api -> $method();
