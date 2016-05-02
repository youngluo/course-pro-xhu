(function(M, $) {

	M.plusReady(function() {
		var score = dataHandler.getData('score');

		$('#score').html(template('score-tpl', {
			data: score
		}));
	});

}(mui, Zepto));