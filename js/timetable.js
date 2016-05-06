(function(M, $) {

	var oDate = new Date();
	$('#month').text(oDate.getMonth() + 1 + '月');
	$('#week li').eq(oDate.getDay()).addClass('active');

	M.plusReady(renderData);

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	function renderData() {
		var timetable = dataHandler.getData('timetable');

		$('#timetable').html(template('timetable-tpl', {
			data: timetable
		}));
	}

}(mui, Zepto));