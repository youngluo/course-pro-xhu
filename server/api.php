<?php

require_once 'logic.php';

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

		$response = array('status' => '', 'msg' => '');

		if (strripos($result, 'ERROR') > 0) {
			$response['status'] = 'error';
			$response['msg'] = '系统正忙';
		} else if (strripos($result, '欢迎您') > 0) {
			$response['status'] = 'success';
			$response['msg'] = '登录成功';
		} else {
			$pattern = "/<script language='javascript' defer>alert\('(.*?)'\).*<\/script>/is";
			preg_match_all($pattern, $result, $matches);
			$response['status'] = 'error';
			$response['msg'] = $matches[1][0];
		}

		echo json_encode($response, JSON_UNESCAPED_UNICODE);
	}

}
