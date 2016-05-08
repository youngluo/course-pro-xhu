(function(M, $, win) {

	var oDate = new Date(),
		day = oDate.getDay();

	$('#month').text(oDate.getMonth() + 1 + '月');
	day = day > 0 ? day : 7;
	$('#week li').eq(day).addClass('active');

	M.plusReady(function() {
		M.preload({
			id: 'timetable-detail',
			url: 'timetable-detail.html',
		});

		renderData();

		M('#timetable').on('tap', '.course-active', function() {
			var $this = $(this);
			M.fire(plus.webview.getWebviewById('timetable-detail'), 'getCourse', {
				course: $this.text()
			});
		});

	});

	win.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	function renderData() {
		var timetable = T.getData('timetable');

		$('#timetable').html(template('timetable-tpl', {
			data: timetable
		}));
	}

}(mui, Zepto, window));