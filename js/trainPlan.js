(function(M, $) {

	M.plusReady(function() {
		var trainPlan = dataHandler.getData('trainPlan');

		$('#train-plan').html(template('train-plan-tpl', {
			data: trainPlan.content
		}));

		$('#totalCredit').text(trainPlan.totalCredit);
	});

}(mui, Zepto));