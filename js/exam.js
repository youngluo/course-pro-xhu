(function(M, $) {

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(renderData);

	function renderData() {
		var exam = T.getData('exam');

		$('#exam').html(template('exam-tpl', {
			data: exam
		}));
	}

}(mui, Zepto));