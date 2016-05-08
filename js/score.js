(function(M, $) {

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(renderData);

	function renderData() {
		var score = T.getData('score');

		$('#score').html(template('score-tpl', {
			data: score
		}));
	}

}(mui, Zepto));