(function(M, $, win) {

	var subPages = ['score.html'],
		subPageStyle = {
			top: '44px',
			bottom: 0
		},
		activePage = null;

	M.plusReady(function() {
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
	});

}(mui, Zepto, window));