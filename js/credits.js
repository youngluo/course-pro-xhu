(function(M, $) {

	M.plusReady(function() {
		var credits = dataHandler.getData('credits');

		$('#credits').html(template('credits-tpl', {
			data: credits.content
		}));

		$('#cur-credit').text(credits.total);

	});

}(mui, Zepto));