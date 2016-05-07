(function(M, $, win) {

	var subPages = ['timetable.html', 'credits.html', 'exam.html', 'score.html', 'train-plan.html', 'failed-course.html'],
		activePage = null,
		subPageStyle = {
			top: '44px',
			bottom: 0
		},
		popover = null;

	M.plusReady(function() {

		M.preload({
			id: 'popover',
			url: 'popover.html',
			styles: {
				width: '100%',
				heigh: '100%',
				background: 'transparent'
			}
		});

		var parent = plus.webview.currentWebview();
		$.each(subPages, function(index, page) {
			var pageId = camelConversion(page.split('.')[0]),
				sub = plus.webview.create(page, pageId, subPageStyle);

			sub.hide();
			parent.append(sub);
		});

		win.addEventListener('getTitle', function(e) {
			$('#title').text(e.detail.title);
			var targetPage = camelConversion(e.detail.id);
			if (targetPage != activePage) {
				plus.webview.hide(activePage);
				plus.webview.show(targetPage);
				activePage = targetPage;
			}
		});

		var popoverPage = null;
		M('.mui-bar-nav').on('tap', '#more', function() {
			if (!popoverPage) {
				popoverPage = plus.webview.getWebviewById('popover')
			}
			popoverPage.show();
		});
	});

	function camelConversion(id) {
		if (id.indexOf('-') > -1) {
			return id
				.replace(/-(.{1}?)/g, function(v) {
					return v.toUpperCase();
				})
				.split('-')
				.join('');
		}

		return id;
	}

}(mui, Zepto, window));