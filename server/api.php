<?php

require_once 'logic.php';
require_once 'lib/simple_html_dom.php';

class API {

	private $logic = null;

	function __construct() {
		$this -> logic = new Logic();
	}

	function getCookie() {
		echo $this -> logic -> get_cookie();
	}

	function login() {
		$result = $this -> logic -> login($_POST['user'], $_POST['psw'], $_POST['captcha']);

		$response = array('status' => '', 'data' => array());

		if (strripos($result, 'ERROR') > 0) {

			$response['status'] = 'error';
			$response['data']['msg'] = '系统正忙';

		} else if (strripos($result, '欢迎您') > 0) {

			preg_match_all('/<span id="xhxm">(.*?)<\/span>/', $result, $matches);
			$name = $matches[1][0];
			$response['status'] = 'success';
			$response['data']['name'] = str_replace('同学', '', $name);
			$response['data']['msg'] = $name . '，登录成功';

		} else {

			$pattern = "/<script language='javascript' defer>alert\('(.*?)'\).*<\/script>/is";
			preg_match_all($pattern, $result, $matches);
			$response['status'] = 'error';
			$response['data']['msg'] = $matches[1][0];

		}

		echo json_encode($response, JSON_UNESCAPED_UNICODE);
	}

	//将课表转换成数组形式
	private function converttoTable($table) {
		$list = array('mon' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'tues' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'wed' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'thur' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'fri' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'sat' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''), 'sun' => array('1,2' => '', '3,4' => '', '5,6' => '', '7,8' => ''));
		$week = array("mon" => "周一", "tues" => "周二", "wed" => "周三", "thur" => "周四", "fri" => "周五", "sat" => "周六", "sun" => "周日");
		$order = array('1,2', '3,4', '5,6', '7,8', '9,10', '9,10,11');
		foreach ($table as $key => $course) {
			foreach ($week as $key => $weekDay) {
				$pos = strpos($course, $weekDay);
				if ($pos) {
					$weekArrayDay = $key;
					//获取list数组中的第一维key
					foreach ($order as $key => $orderClass) {
						$pos = strpos($course, $orderClass);
						if ($pos) {
							$weekArrayOrder = $orderClass;
							if ($orderClass != '9,10') {
								break;
							}
						}
					}
					break;
				}
			}
			$list[$weekArrayDay][$weekArrayOrder] = $course;
		}

		return $list;
	}

	function getTimetable() {
		$result = $this -> logic -> get_timetable($_GET['user'], $_GET['name'], '2014-2015', '1');

		preg_match_all('/<table id="Table1"[\w\W]*?>([\w\W]*?)<\/table>/', $result, $out);
		$timetable = $out[0][0];

		preg_match_all('/<td [\w\W]*?>([\w\W]*?)<\/td>/', $timetable, $out);
		$td = $out[1];
		$length = count($td);

		//获得课程列表
		for ($i = 0; $i < $length; $i++) {
			$td[$i] = str_replace("<br>", "\n", $td[$i]);
			if (!preg_match_all("/{(.*)}/", $td[$i], $matches)) {
				unset($td[$i]);
			}
		}
		//将课程列表数组重新索引
		$td = array_values($td);

		$response['status'] = 'success';
		$response['data']['msg'] = $this -> converttoTable($td);

		echo json_encode($response, JSON_UNESCAPED_UNICODE);
	}

	function getScore() {
		$result = $this -> logic -> get_score($_GET['user'], $_GET['name']);
		preg_match_all('/<table class="datelist"[\w\W]*?>([\w\W]*?)<\/table>/', $result, $out_table);
		preg_match_all('/<tr[\w\W]*?>([\w\W]*?)<\/tr>/', $out_table[0][0], $out_tr);
		$tr = $out_tr[1];
		$tr_length = count($tr);
		for ($i = 0; $i < $tr_length; $i++) {
			preg_match_all('/<td>([\w\W]*?)<\/td>/', $tr[$i], $out_td);
			$tr[$i] = $out_td[1];
		}

		$save_key = array('0', '1', '3', '6', '7', '8');

		for ($j = 0; $j < $tr_length; $j++) {
			if($j==0){
				unset($tr[$j]);
				continue;
			}
			$td = $tr[$j];
			$td_length = count($td);
			for ($k = 0; $k < $td_length; $k++) {
				if (!in_array($k, $save_key)) {
					unset($td[$k]);
				}
			}
			$tr[$j] = array_values($td);
		}
		
		$response['status'] = 'success';
		$response['data']['msg'] = $tr;
		echo json_encode($response, JSON_UNESCAPED_UNICODE);
	}

}
