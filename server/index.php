<?php

header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Headers:X-Requested-With');

require_once 'dataHandler.php';

$data = new DataHandler();
$method = isset($_GET['c']) ? $_GET['c'] : 'cookie';

$data->$method();
