(function(M, $) {

	var padding = ($(window).height() - $('#main').height()) / 8;

	$('.mui-table-view.mui-grid-view .mui-table-view-cell').css({
		paddingTop: padding,
		paddingBottom: padding
	});

	M.plusReady(function() {
		M('#main').on('tap', 'li', function(e) {
			var pageName = this.id;
			M.openWindow({
				url: pageName + '.html',
				id: pageName,
				styles: {
					top: 0,
					bottom: 0
				},
				waiting: {
					autoShow: false
				}
			});
		});

	});

}(mui, Zepto));