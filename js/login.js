(function(M, $) {

	var Login = function() {
			this.host = 'http://192.168.199.140/CoursePro_xhu/server/';
		},
		loginFn = Login.prototype;

	loginFn.init = function() {
		M.init();

		//填充学号、密码
		var user = plus.storage.getItem('user'),
			psw = plus.storage.getItem('password');

		user && $('#account').val(user);
		psw && $('#password').val(psw);

		//获取验证码及cookie
		this.getCaptcha();

		M('#captcha').on('tap', 'img', this.getCaptcha.bind(this));
		M('.mui-content-padded').on('tap', '#login', this.login.bind(this));
	}

	loginFn.getCaptcha = function() {
		var self = this,
			captcha = $('#captcha img'),
			loading = $('.mui-loading');

		captcha.hide();
		loading.show();
		M.get(self.host, function(res) {
			if (res) {
				loading.hide();
				captcha.attr('src', self.host + res + '?' + (+new Date())).show();
			}
		});
	}

	loginFn.login = function() {

		var self = this,
			user = $.trim($('#account').val()),
			psw = $.trim($('#password').val()),
			captcha = $.trim($('#captcha input').val());

		var waiting = plus.nativeUI.showWaiting('正在登录');

		M.ajax(self.host + '?c=login', {
			data: {
				user: user,
				psw: psw,
				captcha: captcha
			},
			dataType: 'json',
			type: 'post',
			timeout: '15000',
			success: function(res) {
				if (res.code == 200) {
					waiting.setTitle('正在导入数据');
					plus.storage.setItem('user', user);
					plus.storage.setItem('name', res.message);
					self.rememberPassword();
					self.getRemoteData(user, res.message);

				} else if (res.code == 400) {
					plus.nativeUI.closeWaiting();
					M.toast(res.message);
					setTimeout(function() {
						self.getCaptcha();
					}, 1000);
				}
			},
			error: function(xhr, type, error) {
				plus.nativeUI.closeWaiting();
				if (type == 'timeout') {
					M.toast('登录时间较长，请重新登录！');
				}
			}
		});
	}

	loginFn.getRemoteData = function(user, name) {
		var self = this;

		M.get(self.host, {
			c: 'get_all_data',
			user: user,
			name: name
		}, function(res) {
			plus.nativeUI.closeWaiting();

			try {
				res = JSON.parse(res);
			} catch (e) {
				M.toast('信息抓取失败，请稍候再试！');
				console.log(res);
				return false;
			}

			if (res.code == 200) {
				M.toast(res.message);
				self.saveData(res.data);
			}
		});
	}

	loginFn.saveData = function(data) {
		for (var item in data) {
			plus.storage.setItem(item, JSON.stringify(data[item]));
		}

		M.openWindow({
			url: 'main.html',
			id: 'main',
			styles: {
				top: 0,
				bottom: 0
			},
			waiting: {
				autoShow: false
			}
		});
	}

	loginFn.rememberPassword = function() {
		if ($('.mui-switch').hasClass('mui-active')) {
			var password = $.trim($('#password').val());
			if (password) {
				plus.storage.setItem('password', password);
			}
		}
	}

	M.plusReady(function() {
		new Login().init();
	});

}(mui, Zepto));