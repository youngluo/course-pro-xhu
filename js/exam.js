(function(M, $) {

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(renderData);

	function renderData() {
		var exam = dataHandler.getData('exam');

		$('#exam').html(template('exam-tpl', {
			data: exam
		}));
	}

}(mui, Zepto));