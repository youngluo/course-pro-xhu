<?php

class JWXT
{
    /*
     * $url��ץȡ��ҳ������
     * $post_data��ģ��post�ύ����Ϣ
     * $cookie�������cookieֵ
     * $isHeader���Ƿ����ͷ�ļ���Ϣ
     */

    public function curl_request($url, $post_data = '', $cookie = '', $isHeader = 0)
    {
        //��ʼ��
        $curl = curl_init();
        //����ץȡ��url
        curl_setopt($curl, CURLOPT_URL, $url);

        curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
        //curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        curl_setopt($curl, CURLOPT_REFERER, 'http://jwc.xhu.edu.cn');

        if ($post_data) {
            //����post��ʽ�ύ
            curl_setopt($curl, CURLOPT_POST, 1);
            //����post���
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post_data, '', '&'));
        }
        if ($cookie) {
            curl_setopt($curl, CURLOPT_COOKIE, $cookie);
        }

        //����ͷ�ļ�����Ϣ��Ϊ��������
        curl_setopt($curl, CURLOPT_HEADER, $isHeader);
        curl_setopt($curl, CURLOPT_TIMEOUT, 20);
        //���û�ȡ����Ϣ���ļ�������ʽ���أ�����ֱ�������
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        //ִ������
        $data = curl_exec($curl);
        //echo mb_convert_encoding($data, 'utf-8', 'GBK,UTF-8,ASCII');
        if ($isHeader) {
            $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);

            $header = substr($data, 0, $headerSize);

            $body = substr($data, $headerSize);

            preg_match_all("/Set\-Cookie:([^;]*);/", $header, $cookie);

            preg_match_all("/<script language='javascript' defer>(.*)<\/script>/", $body, $hint);

            $filter_res = array_filter($hint);

            if (!empty($filter_res)) { //���鲻Ϊ�յĲ���
                $arr = array(
                    'cookie' => $cookie[1][0],
                    'res' => $this->filter($hint[1][0]),
                );
            } else { //����Ϊ�յĲ���
                $arr = array(
                    'cookie' => $cookie[1][0],
                    'res' => 1,
                );
            }

            return $arr;
        } else {
            return mb_convert_encoding($data, 'utf-8', 'GBK,UTF-8,ASCII');
        }

        //�ر�URL����
        curl_close($curl);
    }

    public function filter($str)
    {
        //ת�� GB2312 -> UTF-8
        $str = mb_convert_encoding($str, 'UTF-8', 'GB2312');

        preg_match_all('/[\x{4e00}-\x{9fff}]+/u', $str, $matches);
        $str = join('', $matches[0]);

        //ת�� UTF-8 -> GB2312
        $str = mb_convert_encoding($str, 'GB2312', 'UTF-8');

        if (8 == strlen($str)) {
            return 0; //�������
        } else {
            return -1; //�û������
        }
    }

    public function getView($url, $cookie = '')
    {
        $result = $this->curl_request($url, '', $cookie);
        $pattern = '/<input type="hidden" name="__VIEWSTATE" value="(.*?)" \/>/is';
        preg_match_all($pattern, $result, $matches);
        $res[0] = $matches[1][0];

        return $res[0];
    }

    public function getCookie()
    {
        $url = 'http://jwc.xhu.edu.cn/default2.aspx';

        $post_data = array(
            '__VIEWSTATE' => $this->getView($url),
            'txtUserName' => $_GET['num'],
            'TextBox2' => $_GET['psw'],
            'txtSecretCode' => '',
            'lbLanguage' => '',
               'hidPdrs' => '',
            'hidsc' => '',
            'Button1' => '',
            'RadioButtonList1' => iconv('utf-8', 'gb2312', '学生'),
        );

        $result = $this->curl_request($url, $post_data, '', 1);

        echo json_encode($result);
    }

    public function kbcx()
    {
        $result = $this->curl_request('http://jwc.xhu.edu.cn/xskbcx.aspx?xh='.$_GET['num'], '', $_GET['cookie']);
        preg_match_all('/<table id="Table1"[\w\W]*?>([\w\W]*?)<\/table>/', $result, $out);

        echo str_replace('����', '��', $out[0][0]);
    }

    public function jdcx()
    {
        $url = 'http://jwc.xhu.edu.cn/xscjcx.aspx?xh='.$_GET['num'].'&gnmkdm=N121605';

        $post_data = array(
            '__VIEWSTATE' => $this->getView($url, $_GET['cookie']),
            'btn_zg' => '�γ���߳ɼ�',
            'ddXN' => '',
            'ddXQ' => '',
            'ddl_kcxz' => '',
        );

        $result = $this->curl_request($url, $post_data, $_GET['cookie']);

        preg_match_all('/<table class="datelist"[\w\W]*?>([\w\W]*?)<\/table>/', $result, $out);

        $pattern = '/(<tr.*?>.*?)(<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(?:<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(?:<td.*?>.*?<\/td>)(.*?<\/tr>)/s';

        $str = preg_replace($pattern, '$1$2$3$4$5$6', $out[1][0]);

        $str = strip_tags($str, '<tr><td>');

        preg_match_all('/[-+]?[0-9]*\.{1}[0-9]+/', $str, $score);

        $str = mb_convert_encoding($str, 'utf-8', 'GBK,UTF-8,ASCII');

        //ͳ������ѧ��
        $sum = 0;
        foreach ($score[0] as $value) {
            $sum += floatval($value);
        }

        $arr = array(
            'content' => $str,
            'total' => $sum,
        );

        echo json_encode($arr);
    }
}

$jwxt = new JWXT();

$method = isset($_GET['c']) ? $_GET['c'] : 'getCookie';

eval('$jwxt->'.$method.'();');
