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
				width: '100%',
				heigh: '100%',
				background: 'transparent'
			}
		});

		renderData();

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
	});

	function renderData() {
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

		$('#credits').html(template('credits-tpl', {
			data: creditsContent
		}));

		$('#cur-credit').text(credits.total);
	}

}(mui, Zepto));