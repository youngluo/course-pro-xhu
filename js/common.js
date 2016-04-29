(function(M, $) {

	var DataHandler = function() {
		this.renderData();
	}

	$.extend(DataHandler.prototype, {
		getData: getData,
		renderData: renderData
	});

	function getData(name) {
		var data = plus.storage.getItem(name);
		if (data) {
			console.log(data)
			return JSON.parse(data);
		}
	}

	function renderData() {
		var self = this;
		var numKeys = plus.storage.getLength();
		for (var i = 0; i < numKeys; i++) {
			var page = plus.storage.key(i),
				container = $('#' + page);
				
			if (container.length) {
				container.html(template(page + '-tpl', {
					page: self.getData(page)
				}));
				break;
			}
		}
	}

	M.plusReady(function() {
		new DataHandler();
	});

}(mui, Zepto));