(function(M, $, win) {

	var subPages = ['failedCourse.html', 'score.html'],
		subPageStyle = {
			top: '44px',
			bottom: 0
		},
		activePage = null,
		popover = null;

	M.plusReady(function() {
		M.preload({
			id: 'popover',
			url: 'popover.html',
			styles: {
				top: 0,
				bottom: 0,
				background: 'transparent'
			}
		});

		var parent = plus.webview.currentWebview();
		$.each(subPages, function(index, page) {
			var sub = plus.webview.create(page, page.split('.')[0], subPageStyle);
			sub.hide();
			parent.append(sub);
		});

		win.addEventListener('getTitle', function(e) {
			$('#title').text(e.detail.title);
			var targetPage = e.detail.id;
			if (targetPage != activePage) {
				plus.webview.hide(activePage);
				plus.webview.show(targetPage);
				activePage = targetPage;
			}
		});

		var popoverPage = null;

		M('.mui-bar-nav').on('tap', '#more', function() {
			console.log('666')
			M.openWindow({
				id: 'popover'
			});

		});
	});

}(mui, Zepto, window));