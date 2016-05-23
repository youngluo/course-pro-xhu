(function(M, $, win) {

	var subPages = ['timetable.html', 'credits.html', 'exam.html', 'score.html', 'train-plan.html', 'failed-course.html'],
		activePage = null,
		subPageStyle = {
			top: '44px',
			bottom: 0
		},
		popover = null;

	M.plusReady(function() {
		setCurrentWeek();

		M.preload({
			id: 'popover',
			url: 'popover.html',
			styles: {
				background: 'transparent'
			}
		});

		var parent = plus.webview.currentWebview();
		$.each(subPages, function(index, page) {
			var pageId = T.camelConversion(page.split('.')[0]),
				sub = plus.webview.create(page, pageId, subPageStyle);

			sub.hide();
			parent.append(sub);
		});

		win.addEventListener('getTitle', function(e) {
			var id = e.detail.id,
				$curWeek = $('#cur-week'),
				$title = $('#title');

			if (id == 'timetable') {
				$title.hide();
				$curWeek.show();
			} else {
				$curWeek.hide();
				$title.text(e.detail.title).show();
			}

			var targetPage = T.camelConversion(id);
			if (targetPage != activePage) {
				plus.webview.hide(activePage);
				plus.webview.show(targetPage);
				activePage = targetPage;
			}
		});

		var timetablePage = null;
		M('#cur-week').on('tap', '.mui-icon', function() {
			var $this = $(this);

			if (!timetablePage) {
				timetablePage = plus.webview.getWebviewById('timetable');
			}

			M.fire(timetablePage, 'showPopover', {
				isShow: true,
				curWeek: plus.storage.getItem('currentWeek').split('-')[0]
			});
		});

		var popoverPage = null;
		M('.mui-bar-nav').on('tap', '#more', function() {
			if (!popoverPage) {
				popoverPage = plus.webview.getWebviewById('popover')
			}
			popoverPage.show();
		});

		win.addEventListener('getWeekNum', function(e) {
			var weekVal = e.detail.weekVal;
			$('#cur-week span span').text(weekVal);
			plus.storage.setItem('currentWeek', weekVal + '-' + getWeekNumber());
		});
	});

	function setCurrentWeek() {
		var weekforYear = getWeekNumber(),
			weekVal = plus.storage.getItem('currentWeek');

		if (weekVal) {
			var oldWeekforYear = weekVal.split('-')[1];
			if (weekforYear >= oldWeekforYear) {
				weekVal = (parseInt(weekVal.split('-')[0]) + weekforYear - oldWeekforYear) + '-' + weekforYear;
			}
		} else {
			weekVal = 1 + '-' + weekforYear;
		}

		$('#cur-week span span').text(weekVal.split('-')[0]);
		plus.storage.setItem('currentWeek', weekVal);
	}

	function isLeapYear(year) {
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	}

	function getMonthDays(year, month) {
		return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
	}

	function getWeekNumber() {
		var now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth(),
			days = now.getDate();
		//那一天是那一年中的第多少天
		for (var i = 0; i < month; i++) {
			days += getMonthDays(year, i);
		}

		//那一年第一天是星期几
		var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

		var week = null;
		if (yearFirstDay == 1) {
			week = Math.ceil(days / yearFirstDay);
		} else {
			days -= (7 - yearFirstDay + 1);
			week = Math.ceil(days / 7) + 1;
		}

		return week;
	}

}(mui, Zepto, window));