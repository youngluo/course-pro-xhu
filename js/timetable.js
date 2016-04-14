(function(M, $) {

	M.plusReady(function() {
		M('.mui-scroll-wrapper').scroll();
		
		$('#month').text((new Date).getMonth() + 1 + '月');
		
		H.getData('Timetable', function(res) {
			res = JSON.parse(res);
			if (res.status == 'success') {
				$('#timetable').html(template('timetable-tpl', res.data));
			}
		});
	});

}(mui, Zepto));