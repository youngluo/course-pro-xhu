(function(M, $) {

	var Tool = (function() {

		return {
			getData: getData,
			camelConversion: camelConversion,
			detectNetwork: detectNetwork
		};

		function getData(name) {
			var data = plus.storage.getItem(name);
			if (data) {
				return JSON.parse(data);
			}
		}

		function camelConversion(id) {
			if (id.indexOf('-') > -1) {
				return id
					.replace(/-(.{1}?)/g, function(v) {
						return v.toUpperCase();
					})
					.split('-')
					.join('');
			}

			return id;
		}

		function detectNetwork() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){
				M.toast("无法连接网络");
				return false;
			}
			return true;
		}

	}());

	window.T = Tool;

	M('.mui-scroll-wrapper').scroll();

}(mui, Zepto));