(function(M, $) {

	M.plusReady(function() {
		T.detectNetwork();

		var limitLength = 120,
			hint = $('#feedback p'),
			num = hint.find('span'),
			isShow = false,
			feedbackInput = $('#feedback-info');

		feedbackInput.on('input', function() {
			if (!isShow) {
				hint.show();
				isShow = true;
			}

			var feedbackInfo = $.trim($(this).val());
			counts = limitLength - feedbackInfo.length;
			if (counts >= 0) {
				num.text(counts);
			} else {
				$(this).val(feedbackInfo.substr(0, 120));
			}
		});

		M('.mui-bar').on('tap', '#send-feedback-info', function() {
			var isNetwork = T.detectNetwork(),
				feedbackInfo = $.trim(feedbackInput.val());

			if(isNetwork && feedbackInfo){
				console.log(feedbackInfo);
			}
		});

	});

}(mui, Zepto));