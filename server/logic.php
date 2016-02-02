<?php

require_once 'request.php';

class Logic {

	private $request = null;

	function __construct() {
		$this -> request = new Request();
	}

	function get_cookie() {
		$files = glob('temp/*');
		foreach ($files as $file) {
			if (is_file($file)) {
				unlink($file);
			}
		}

		$result = $this -> request -> get_captcha();
		
		if($result){
			$img_name = 'temp/captcha.jpg';
			$fp = fopen($img_name, 'a');
			fwrite($fp, $result);
			fclose($fp);
			return $img_name;
		}
	}

	function login($user, $psw, $captcha) {
		$post_data = array("__VIEWSTATE" => $this -> request -> get_viewstate(), "txtUserName" => $user, "TextBox2" => $psw, "txtSecretCode" => $captcha, "RadioButtonList1" => iconv('utf-8', 'gb2312', '学生'), "Button1" => '', "lbLanguage" => '', "hidPdrs" => '', "hidsc" => '');

		return $this -> request -> curl('', $post_data);
	}

}
