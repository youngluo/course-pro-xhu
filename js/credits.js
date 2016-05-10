(function(M, $) {

	M.init({
		gestureConfig: {
			longtap: true
		}
	});

	template.config('escape', false);

	window.addEventListener('update', function(e) {
		if (e.detail.update) {
			renderData();
		}
	});

	M.plusReady(function() {
		M.preload({
			id: 'credits-popover',
			url: 'credits-popover.html',
			styles: {
				background: 'transparent'
			}
		});

		renderData();
	});

	function renderData() {
		var credits = T.getData('credits'),
			trainPlan = T.getData('trainPlan'),
			creditsContent = credits.content;

		$.each(trainPlan.content, function(index, item) {
			var credit = creditsContent[item[0]] - item[1];

			if (credit > 0) {
				creditsContent[item[0]] += '<span class="mui-badge mui-badge-warning">+' + credit + '</span>';
			} else if (credit < 0) {
				creditsContent[item[0]] += '<span class="mui-badge mui-badge-danger">' + credit + '</span>';
			}

		});

		$('#credits').html(template('credits-tpl', {
			data: creditsContent
		}));

		$('#cur-credit').text(credits.total);
		
		var creditsPopover = null;
		M('#credits').on('longtap', '.course-list', function() {
			var $this = $(this);
			if (!creditsPopover) {
				creditsPopover = plus.webview.getWebviewById('credits-popover');
			}

			M.fire(creditsPopover, 'getType', {
				type: $this.find('li:first-child').text()
			});
		});
	}

}(mui, Zepto));