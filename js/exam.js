(function(M, $) {

	M.plusReady(function() {
		var exam = dataHandler.getData('exam');

		$('#exam').html(template('exam-tpl', {
			data: exam
		}));
	});


}(mui, Zepto));