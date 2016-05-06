(function(M, $) {

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(renderData);

	function renderData() {
		var failedCourse = dataHandler.getData('failedCourse');

		$('#failed-course').html(template('failed-course-tpl', {
			data: failedCourse
		}));
	}

}(mui, Zepto));