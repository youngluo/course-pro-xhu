<?php

class Request
{
    private $login_url = 'http://jwc.xhu.edu.cn/default2.aspx';
    private $captcha_url = 'http://jwc.xhu.edu.cn/CheckCode.aspx';
    private $header = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36';
    public $cookie_file = 'temp/cookie.txt';

    public function curl($url, $post_data = '')
    {
        if (!$url) {
            $url = $this->login_url;
        }

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);

        curl_setopt($curl, CURLOPT_USERAGENT, $this->header);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        curl_setopt($curl, CURLOPT_REFERER, 'http://jwc.xhu.edu.cn');

        if ($post_data) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post_data, '', '&'));
        }

        curl_setopt($curl, CURLOPT_COOKIEFILE, $this->cookie_file);

        curl_setopt($curl, CURLOPT_HEADER, 0);
        //curl_setopt($curl, CURLOPT_TIMEOUT, 20);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $data = curl_exec($curl);
        curl_close($curl);

        return mb_convert_encoding($data, 'UTF-8', 'gb2312');
    }

    public function get_viewstate($url = '', $post_data = '')
    {
        $html_str = '';

        if (!$url) {
            $url = $this->login_url;
        }

        $html_str = $this->curl($url, $post_data);

        $pattern = '/<input type="hidden" name="__VIEWSTATE" value="(.*?)" \/>/is';
        preg_match_all($pattern, $html_str, $matches);

        return $matches[1][0];
    }

    public function get_captcha()
    {
        $url = $this->captcha_url;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_COOKIEJAR, $this->cookie_file);

        ob_start();
        curl_exec($curl);
        $return_content = ob_get_contents();
        ob_end_clean();

        curl_close($curl);

        return $return_content;
    }
}
