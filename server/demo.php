<?php

class JWXT {
	
	/*
	 * $url：抓取网页的链接
	 * $post_data：模拟post提交的信息
	 * $cookie：传入的cookie值
	 * $isHeader：是否输出头文件信息
	 */
	
	function curl_request($url,$post_data='',$cookie='',$isHeader=0) {
		//初始化
		$curl = curl_init();
		//设置抓取的url
		curl_setopt($curl, CURLOPT_URL, $url);
		
		curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
        //curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        curl_setopt($curl, CURLOPT_REFERER, 'http://jwc.xhu.edu.cn');
		
		if($post_data){
			//设置post方式提交
			curl_setopt($curl, CURLOPT_POST, 1);
			//设置post数据
			curl_setopt($curl, CURLOPT_POSTFIELDS,http_build_query($post_data,'','&'));
		}
		if($cookie){
            curl_setopt($curl, CURLOPT_COOKIE, $cookie);
        }
		
		//设置头文件的信息作为数据流输出
		curl_setopt($curl, CURLOPT_HEADER, $isHeader);
        curl_setopt($curl, CURLOPT_TIMEOUT, 20);
        //设置获取的信息以文件流的形式返回，而不是直接输出。
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		
		//执行命令
		$data = curl_exec($curl);
		
        if($isHeader){
            
            $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
            
            $header = substr($data, 0, $headerSize);
            
            $body = substr($data, $headerSize);
            
            preg_match_all("/Set\-Cookie:([^;]*);/", $header, $cookie);
            
            preg_match_all("/<script language='javascript' defer>(.*)<\/script>/", $body, $hint);
			
			$filter_res = array_filter($hint);
			
			if(!empty($filter_res)){ //数组不为空的操作
				$arr = array(
					'cookie' => $cookie[1][0],
					'res' => $this -> filter($hint[1][0])
				);
			    
			}
			else{ //数组为空的操作
				$arr = array(
					'cookie' => $cookie[1][0],
					'res' => 1
				);
			}
			
            return $arr;
            
        }else{
            return mb_convert_encoding($data, 'utf-8', 'GBK,UTF-8,ASCII');
        }
        
		//关闭URL请求
		curl_close($curl);
	}
    
    function filter($str){
		
		//转换 GB2312 -> UTF-8
		$str = mb_convert_encoding($str, 'UTF-8', 'GB2312');
		
		preg_match_all('/[\x{4e00}-\x{9fff}]+/u', $str, $matches);
		$str = join('', $matches[0]);
		
		//转换 UTF-8 -> GB2312
		$str = mb_convert_encoding($str, 'GB2312', 'UTF-8'); 
		
		if(strlen($str) == 8){
			return 0;//密码错误
		}else{
			return -1;//用户名错误
		}
	}

    
   function getView($url,$cookie=''){
		
        $result = $this -> curl_request($url,'',$cookie);
        $pattern = '/<input type="hidden" name="__VIEWSTATE" value="(.*?)" \/>/is';
        preg_match_all($pattern, $result, $matches);
        $res[0] = $matches[1][0];
        return $res[0];
    }
	
	function getCookie(){
        
        $url = 'http://jwc.xhu.edu.cn/default2.aspx';
        
		$post_data = array(
			"__VIEWSTATE" => $this -> getView($url), 
			"txtUserName" => $_POST['num'], 
			"TextBox2" => $_POST['psw'], 
			"txtSecretCode" => '',
        	"lbLanguage" => '',
       		"hidPdrs" => '',
        	"hidsc" => '',
        	"Button1" => '',
			"RadioButtonList1" => iconv('utf-8', 'gb2312', '学生')
		);
		
		$result = $this->curl_request( $url, $post_data,'',1);
        
        echo json_encode($result);
	}
	
	function kbcx(){
		
		$result =  $this->curl_request('http://jwc.xhu.edu.cn/xskbcx.aspx?xh='.$_GET['num'], '', $_GET['cookie']);
        preg_match_all('/<table id="Table1"[\w\W]*?>([\w\W]*?)<\/table>/',$result,$out);
        
        echo str_replace("星期","周",$out[0][0]);
	}
    
   function jdcx(){
        
        $url = 'http://jwc.xhu.edu.cn/xscjcx.aspx?xh='.$_GET['num'].'&gnmkdm=N121605';
        
        $post_data = array(
            "__VIEWSTATE" => $this -> getView($url,$_GET['cookie']),
            "btn_zg" => '课程最高成绩',
            "ddXN" => '',
            "ddXQ" => '',
            "ddl_kcxz" => ''
        );
        
        $result = $this->curl_request($url, $post_data, $_GET['cookie']);
        
		preg_match_all('/<table class="datelist"[\w\W]*?>([\w\W]*?)<\/table>/',$result,$out);
       
       $pattern = '/(<tr.*?>.*?)(<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(?:<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(<td.*?>.*?<\/td>)(?:<td.*?>.*?<\/td>)(.*?<\/tr>)/s';

		$str = preg_replace($pattern, '$1$2$3$4$5$6', $out[1][0]);

		$str = strip_tags($str, "<tr><td>");

		preg_match_all('/[-+]?[0-9]*\.{1}[0-9]+/', $str, $score);
       
       
        $str = mb_convert_encoding($str, 'utf-8', 'GBK,UTF-8,ASCII');

		//统计已修学分
		$sum = 0;
		foreach ($score[0] as $value) {
			$sum += floatval($value);
		}

		$arr = array(
			"content" => $str,
			"total" => $sum
		);
		
		echo json_encode($arr);
    }
}

$jwxt = new JWXT();

$method = isset($_GET['c']) ? $_GET['c'] : 'getCookie';

eval('$jwxt->'.$method.'();');


?>