(function(M, $, win) {
	var padding = ($(win).height() - $('#main').height()) / 8;

	$('.mui-table-view.mui-grid-view .mui-table-view-cell').css({
		paddingTop: padding,
		paddingBottom: padding
	});

	M.plusReady(function() {
		if (!plus.storage.getItem('isLogin')) {
			plus.webview.open('login.html', 'login', {
				top: 0,
				bottom: 0
			}, 'none', 0, function() {
				plus.navigator.closeSplashscreen();
			});
		} else {
			setTimeout(function() {
				plus.navigator.closeSplashscreen();
			}, 2000);
		}

		M.preload({
			id: 'parent',
			url: 'parent.html',
			styles: {
				top: 0,
				bottom: 0
			}
		});

		var parentPage = null;

		M('#main').on('tap', 'li', function(e) {
			var self = this,
				title = $(this).find('div').text();
				
			if (!parentPage) {
				parentPage = plus.webview.getWebviewById('parent');
			}

			M.fire(parentPage, 'getTitle', {
				title: title,
				id: self.id
			});

			M.openWindow({
				id: 'parent'
			});
		});

		var backButtonPress = 0;
		M.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 3000);
			return false;
		};
	});

}(mui, Zepto, window));