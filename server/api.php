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
		echo $result;
	}

}
