(function(M, $) {

	var oDate = new Date();
	$('#month').text(oDate.getMonth() + 1 + '月');
	$('#week li').eq(oDate.getDay()).addClass('active');

	M.plusReady(function() {
		var timetable = dataHandler.getData('timetable');

		$('#timetable').html(template('timetable-tpl', {
			data: timetable
		}));

		var mask = null;
		M('#timetable').on('tap', '.course-active', function(e) {
			if (!mask) {
				mask = plus.webview.getWebviewById('parent');
				mask.addEventListener("maskClick", function() {
					mask.setStyle({
						mask: "none"
					});
				}, false);
			}
			mask.setStyle({
				mask: "rgba(0,0,0,.6)"
			});

			console.log(JSON.stringify(mask));
		});
	});

}(mui, Zepto));