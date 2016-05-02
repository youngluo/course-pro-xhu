<?php

$arr = array('1', '2');
$new_arr = array();
$arr_length = count($arr);

for ($i = 0; $i < $arr_length; $i++) {
	$item = $arr[$i];
	$type = $item[0];
	if (isset($new_arr[$type])) {

	} else {
		echo $type;
	}

}
