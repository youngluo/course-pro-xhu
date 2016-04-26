(function(M, $) {

	M('.mui-scroll-wrapper').scroll();
	M.plusReady(function() {
		H.getData('FailedCourse', function(res) {
			alert(res)
			res = JSON.parse(res);
			if (res.status == 'success') {
				$('#course').html(template('course-tpl', res.data));
			}
		});
	});

}(mui, Zepto));