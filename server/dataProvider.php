<?php

require_once 'request.php';

class DataProvider {

	private $request = null;

	function __construct() {
		$this -> request = new Request();
	}

	function get_cookie() {
		/*$files = glob('temp/*');
		foreach ($files as $file) {
			if (is_file($file)) {
				unlink($file);
			}
		}*/

		$result = $this -> request -> get_captcha();

		if ($result) {
			$img_name = 'temp/captcha.jpg';
			$fp = fopen($img_name, 'wb+');
			if($fp){
				fwrite($fp, $result);
				fclose($fp);
				return $img_name;
			}
		}
	}

	function login($user, $psw, $captcha) {
		$post_data = array("__VIEWSTATE" => $this -> request -> get_viewstate(), "txtUserName" => $user, "TextBox2" => $psw, "txtSecretCode" => $captcha, "RadioButtonList1" => iconv('utf-8', 'gb2312', '学生'), "Button1" => '', "lbLanguage" => '', "hidPdrs" => '', "hidsc" => '');
		return $this -> request -> curl('', $post_data);
	}

	function get_timetable($user, $name, $year = '', $term = '') {
		$post_data = '';
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/xskbcx.aspx?gnmkdm=N121603&xm=' . $name . '&xh=' . $user;
		if ($year && $term) {
			$post_data = array('__EVENTTARGET' => 'xnd', '__EVENTARGUMENT' => '', 'xnd' => $year, 'xqd' => $term, '__VIEWSTATE' => $this -> request -> get_viewstate($url));
		}
		return $this -> request -> curl($url, $post_data);
	}

	function get_score($user, $name) {
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/xscjcx.aspx?gnmkdm=N121605&xm=' . $name . '&xh=' . $user;
		$post_data = array('__EVENTTARGET' => '', '__EVENTARGUMENT' => '', 'hidLanguage' => '', 'ddlXN' => '', '__VIEWSTATE' => $this -> request -> get_viewstate($url), 'ddlXQ' => '', 'ddl_kcxz' => '', 'btn_zcj' => '历年成绩');
		return $this -> request -> curl($url, $post_data);
	}

	function get_failed_course($user, $name) {
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/xscjcx.aspx?gnmkdm=N121605&xm=' . $name . '&xh=' . $user;
		$post_data = array('__EVENTTARGET' => '', '__EVENTARGUMENT' => '', 'hidLanguage' => '', 'ddlXN' => '', '__VIEWSTATE' => $this -> request -> get_viewstate($url), 'ddlXQ' => '', 'ddl_kcxz' => '', 'Button2' => '未通过成绩');
		return $this -> request -> curl($url, $post_data);
	}

	function get_exam($user, $name) {
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/xskscx.aspx?gnmkdm=N121604&xm=' . $name . '&xh=' . $user;
		return $this -> request -> curl($url);
	}

	function get_train_plan($user, $name) {
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/pyjh.aspx?gnmkdm=N121607&xm=' . $name . '&xh=' . $user;
		return $this -> request -> curl($url);
	}

	function get_credits($user, $name) {
		$name = urlencode(iconv('utf-8', 'gb2312', $name));
		$url = 'http://jwc.xhu.edu.cn/xscjcx.aspx?gnmkdm=N121605&xm=' . $name . '&xh=' . $user;
		$post_data = array('__EVENTTARGET' => '', '__EVENTARGUMENT' => '', 'hidLanguage' => '', 'ddlXN' => '', '__VIEWSTATE' => $this -> request -> get_viewstate($url), 'ddlXQ' => '', 'ddl_kcxz' => '', 'btn_zg' => '课程最高成绩');
		return $this -> request -> curl($url, $post_data);
	}

}
