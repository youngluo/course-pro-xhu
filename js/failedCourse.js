(function(M, $) {

	M.plusReady(function() {
		var failedCourse = dataHandler.getData('failedCourse');

		$('#failed-course').html(template('failed-course-tpl', {
			data: failedCourse
		}));
	});

}(mui, Zepto));