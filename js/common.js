(function(M, $) {

	var DataHandler = function() {
		this.pages = ['timetable'];
		this.renderData();
	}

	$.extend(DataHandler.prototype, {
		getData: getData,
		renderData: renderData
	});

	function getData(name) {
		var data = plus.storage.getItem(name);
		if (data) {
			return JSON.parse(data);
		}
	}

	function renderData() {
		var self = this;
		self.pages.forEach(function(page) {
			var container = $('#' + page);
			if (!!container) {
				container.html(template(page + '-tpl', {
					timetable: self.getData(page)
				}));
			}
		});
	}

	M.plusReady(function() {
		new DataHandler();
	});

}(mui, Zepto));