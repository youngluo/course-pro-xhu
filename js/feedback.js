(function(M, $, _) {

	M.plusReady(function() {
		T.detectNetwork();
		M('.mui-bar').on('tap', '#send-feedback-info', _.debounce(sendFeedbackInfo, 800));
	});

	var limitLength = 120,
		hint = $('#feedback p'),
		num = hint.find('span'),
		isShow = false,
		feedbackInput = $('#feedback-info'),
		sendFeedbackBtn = $('#send-feedback-info');

	feedbackInput.on('input', function() {
		if (!isShow) {
			hint.show();
			isShow = true;
		}

		var feedbackInfo = $.trim($(this).val()),
			counts = limitLength - feedbackInfo.length;

		if (counts < limitLength) {
			sendFeedbackBtn.removeAttr('disabled').addClass('active');
		} else {
			sendFeedbackBtn.attr('disabled', true).removeClass('active');
		}

		if (counts >= 0) {
			num.text(counts);
		} else {
			$(this).val(feedbackInfo.substr(0, 120));
		}
	});

	var ref = null;

	function sendFeedbackInfo() {
		var isNetwork = T.detectNetwork(),
			feedbackInfo = $.trim(feedbackInput.val());

		if (!isNetwork) {
			return;
		}
		
		if (!ref) {
			ref = new Wilddog('https://course-xhu.wilddogio.com/feedback');
		}
		
		var time = new Date().toLocaleString();

		ref.push({
			message: feedbackInfo,
			time: time
		});
		
		M.toast('提交成功');
		feedbackInput.val('');
	}

}(mui, Zepto, _));