(function(M, $) {

	var DataHandler = (function() {

		return {
			getData: getData
		};


		function getData(name) {
			var data = plus.storage.getItem(name);
			if (data) {
				return JSON.parse(data);
			}
		}

	}());

	window.dataHandler = DataHandler;

	M('.mui-scroll-wrapper').scroll();

}(mui, Zepto));