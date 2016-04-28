(function(M, $) {

	var Login = function() {
			this.host = Config.host;
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
		M('.mui-content-padded').on('tap', '#login', this.submit.bind(this));

		this.back();
	}

	loginFn.getCaptcha = function() {
		var _this = this,
			captcha = $('#captcha img'),
			loading = $('.mui-loading');

		captcha.hide();
		loading.show();
		M.get(_this.host, function(res) {
			console.log(res);

			if (res) {
				loading.hide();
				captcha.attr('src', _this.host + res + '?' + (+new Date())).show();
			}
		});
	}

	loginFn.submit = function() {
		var _this = this,
			user = $.trim($('#account').val()),
			psw = $.trim($('#password').val()),
			captcha = $.trim($('#captcha input').val());

		plus.nativeUI.showWaiting();

		M.ajax(_this.host + 'index.php?c=login', {
			data: {
				user: user,
				psw: psw,
				captcha: captcha
			},
			dataType: 'json',
			type: 'post',
			timeout: '15000', //15s
			success: function(res) {
				alert(JSON.stringify(res))
				plus.nativeUI.closeWaiting();
				if (res.code == 200) {
					M.toast(res.message + '同学，登录成功！');
					plus.storage.setItem('user', user);
					plus.storage.setItem('name', res.message);
					_this.rememberPassword();
					_this.saveData(res.data);

				} else if (res.code == 400) {
					M.toast(res.message);
					setTimeout(function() {
						_this.getCaptcha();
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

	loginFn.saveData = function(data) {
		alert(JSON.stringify(data));
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

	loginFn.back = function() {
		var backButtonPress = 0;
		M.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 3000);
			return false;
		};
	}

	M.plusReady(function() {
		new Login().init();
	});

}(mui, Zepto));