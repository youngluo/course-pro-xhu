(function(M, $) {

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(renderData);

	function renderData() {
		var trainPlan = T.getData('trainPlan');

		$('#train-plan').html(template('train-plan-tpl', {
			data: trainPlan.content
		}));

		$('#totalCredit').text(trainPlan.totalCredit);
	}

}(mui, Zepto));