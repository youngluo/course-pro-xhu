(function(M, $) {

	M.plusReady(function() {
		M('.mui-scroll-wrapper').scroll();

		H.getData('Timetable', function(res) {
			alert(res);
			res = JSON.parse(res);
			if (res.status == 'success') {
				var timetable = res.data.msg;
				//
			}


			//$('#timetable').html(res);
		});
	});
	
}(mui, Zepto));