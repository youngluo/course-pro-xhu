(function(M, $) {

	var config = {
		host: 'http://192.168.0.149:9096/CoursePro_xhu/server/'
	};

	window.Config = config;

	var Helper = function() {}
	$.extend(Helper.prototype, {
		getData: getData
	});

	function getData(c, cb) {
		plus.nativeUI.showWaiting();
		M.ajax(Config.host, {
			data: {
				c: c,
				user: plus.storage.getItem('user'),
				name: plus.storage.getItem('name')
			},
			type: 'get',
			timeout: '20000',
			success: function(res) {
				plus.nativeUI.closeWaiting();
				cb(res);
			},
			error: function(xhr, type, error) {
				plus.nativeUI.closeWaiting();
				if (type == 'timeout') {
					M.toast('获取数据时间较长，请重新获取！');
				}
			}
		});
	}

	window.H = new Helper;

}(mui, Zepto));