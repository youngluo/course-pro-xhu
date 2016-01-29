<?php

require_once 'request.php';

class Logic {
	
	private $request = null;

	function __construct() {
		$this -> request = new Request();
	}
	
	function get_cookie() {
		$url = 'http://jwc.xhu.edu.cn/CheckCode.aspx';
		$result = $this -> request -> curl($url);
		if($result) {
			return $url;
		}
	}
	
	function login($user, $psw, $captcha){
		$post_data = array (
			"__VIEWSTATE" => $this -> request -> get_viewstate(), 
			"txtUserName" => $user, 
			"TextBox2" => $psw, 
			"txtSecretCode" => $captcha,
        	"lbLanguage" => '',
       		"hidPdrs" => '',
        	"hidsc" => '',
        	"Button1" => '',
			"RadioButtonList1" => '学生'
		);
		
		return $this -> request -> curl('', $post_data, true);
	}
	
}
