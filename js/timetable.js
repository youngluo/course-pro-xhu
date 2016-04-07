(function(M, $) {

	M.plusReady(function() {
		M('.mui-scroll-wrapper').scroll();

		H.getData('Timetable', function(res) {
			$('#timetable').html(res);
		});
	});

}(mui, Zepto));