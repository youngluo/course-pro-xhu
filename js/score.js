(function(M, $) {

	M('.mui-scroll-wrapper').scroll();
	M.plusReady(function() {
		H.getData('Score', function(res) {
			res = JSON.parse(res);
			if (res.status == 'success') {
				$('#score').html(template('score-tpl', res.data));
			}
		});
	});

}(mui, Zepto));