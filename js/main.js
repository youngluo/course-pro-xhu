(function(M, $) {
	M.plusReady(function() {

		M('#main').on('tap', 'button', function() {
			plus.nativeUI.showWaiting();
			M.ajax(Config.host + '?c=getTimetable', {
				data: {
					user: plus.storage.getItem('user'),
					name: plus.storage.getItem('name')
				},
				type: 'get',
				timeout: '15000', //15s
				success: function(res) {
					plus.nativeUI.closeWaiting();
					alert(res);
				},
				error: function(xhr, type, error) {
					plus.nativeUI.closeWaiting();
					if (type == 'timeout') {
						M.toast('获取数据时间较长，请重新获取！');
					}
				}
			});
		});

	});

}(mui, Zepto));