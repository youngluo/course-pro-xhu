(function(M, $) {

	M.plusReady(function() {
		H.getData('Score', function(res) {
			$('#score').text(res);
		});
	});

}(mui, Zepto));