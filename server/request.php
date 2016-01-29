<?php

class Request {

	private $login_url = 'http://jwc.xhu.edu.cn/default2.aspx';
	private $header = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36';

	function curl($url, $post_data = '', $is_cookie = false) {

		if (!$url) {
			$url = $this -> login_url;
		}

		$cookie_file = 'cookie.txt';

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);

		curl_setopt($curl, CURLOPT_USERAGENT, $this -> header);
//		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
		curl_setopt($curl, CURLOPT_REFERER, 'http://jwc.xhu.edu.cn/default2.aspx');

		if ($post_data) {
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post_data, '', '&'));
		}

		if (!$is_cookie) {
			curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie_file);
		} else {
			curl_setopt($curl, CURLOPT_COOKIEFILE, $cookie_file);
		}

		curl_setopt($curl, CURLOPT_HEADER, 0);
		//curl_setopt($curl, CURLOPT_TIMEOUT, 20);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		$data = curl_exec($curl);
		curl_close($curl);

		return mb_convert_encoding($data, 'UTF-8', 'gb2312');

	}

	function get_viewstate($url = '') {

		$html_str = '';

		if (!$url) {
			$url = $this -> login_url;
			$html_str = file_get_contents($url);
		} else {
			$html_str = $this -> curl($url, '', true);
		}

		$pattern = '/<input type="hidden" name="__VIEWSTATE" value="(.*?)" \/>/is';
		preg_match_all($pattern, $html_str, $matches);
		return $matches[1][0];

	}

}
