(function(M, $, win) {

	M.plusReady(function() {
		var curPage = plus.webview.currentWebview();

		win.addEventListener('getType', function(e) {
			var type = $.trim(e.detail.type);
			$('#type').text(type);
			$('#credit').text(getTrainPlanCredit(type));

			setTimeout(function() {
				curPage.show();
			}, 110);
		});

		M('body').on('tap', '.mui-content', function() {
			curPage.hide();
		});
	});

	function getTrainPlanCredit(type) {
		var trainPlan = T.getData('trainPlan').content;

		for (var i in trainPlan) {
			var item = trainPlan[i];
			if (item[0] == type) {
				return item[1];
			}
		}
	}

}(mui, Zepto, window));