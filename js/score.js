(function(M, $) {

	M.plusReady(function() {

		H.getData('Score', function(res) {
			$('#score').html(res);
		});
	});

}(mui, Zepto));