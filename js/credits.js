(function(M, $) {

	M.init({
		gestureConfig: {
			longtap: true
		}
	});

	M.plusReady(function() {
		M.preload({
			id: 'credits-popover',
			url: 'credits-popover.html',
			styles: {
				top: 0,
				bottom: 0,
				background: 'transparent'
			}
		});
		var credits = dataHandler.getData('credits'),
			trainPlan = dataHandler.getData('trainPlan'),
			creditsContent = credits.content;

		$.each(trainPlan.content, function(index, item) {
			var credit = creditsContent[item[0]] - item[1];

			if (credit > 0) {
				creditsContent[item[0]] += '<strong class="beyond">+' + credit + '</strong>';
			} else if (credit < 0) {
				creditsContent[item[0]] += '<strong class="insufficient">' + credit + '</strong>';
			}

		});

		template.config('escape', false);

		$('#credits').html(template('credits-tpl', {
			data: creditsContent
		}));

		$('#cur-credit').text(credits.total);

		var creditsPopover = null;
		M('#course-lists').on('longtap', '.course-list', function() {
			var $this = $(this);

			if (!creditsPopover) {
				creditsPopover = plus.webview.getWebviewById('credits-popover');
			}

			M.fire(creditsPopover, 'getType', {
				type: $this.find('li:first-child').text()
			});
		});
	});

}(mui, Zepto));