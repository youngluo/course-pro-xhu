(function(M, $) {

	M.plusReady(function() {
		M('.mui-scroll-wrapper').scroll();

		$('#month').text((new Date).getMonth() + 1 + '月');

		H.getData('Timetable', function(res) {
			alert(res);
			res = JSON.parse(res);
			if (res.status == 'success') {
				$('#timetable').html(template('timetable-tpl', res.data));
			}
		});




		var mask = null;
		M('#timetable').on('tap', '.course-active', function(e) {
			/*if (!mask) {
				mask = plus.webview.getWebviewById('parent');
				mask.addEventListener("maskClick", function() {
					mask.setStyle({
						mask: "none"
					});
				}, false);
			}
			mask.setStyle({
				mask: "rgba(0,0,0,0.5)"
			});
			mask.innerText = $(this).text();*/
			alert($(this).text());
		});
	});

}(mui, Zepto));