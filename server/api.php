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

	function getTimetable() {
		$result = $this -> logic -> get_timetable($_GET['user'], $_GET['name']);
		$response = array('status' => '', 'data' => array());

		/*$html = new simple_html_dom();
		$html -> load($result);

		foreach ($html -> find('#Table1 tr') as $tr_index => $tr) {
			if ($tr_index > 1) {
				($tr_index + 2) % 4 == 0 ? $td_start_index = 1 : $td_start_index = 0;
				foreach ($tr -> find('td') as $td_index => $td) {
					if ($td_index > $td_start_index) {
						$td_content = $td -> innertext;
						$response['data'][$tr_index - 1]['周' . ($td_index - $td_start_index)] = $td_content;
					}
				}
			}
		}*/
		preg_match_all('/<table id="Table1"[\w\W]*?>([\w\W]*?)<\/table>/',$result,$timetable);

		$response['status'] = 'success';
		$response['data']['msg'] = $result;

		echo str_replace("星期","周",$timetable[0][0]);
	}

}
