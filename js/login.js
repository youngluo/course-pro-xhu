(function(M, $) {

	var Login = function() {
			this.host = 'http://192.168.0.110:9096/';
		},
		loginFn = Login.prototype;

	loginFn.init = function() {
		M.init();

		//填充学号、密码
		var account = plus.storage.getItem('account'),
			psw = plus.storage.getItem('password');

		account && $('#account').val(account);
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
			if (res) {
				loading.hide();
				captcha.attr('src', _this.host + res + '?' + (+new Date())).show();
			}
		});
	}

	loginFn.submit = function() {
		var _this = this,
			account = $.trim($('#account').val()),
			psw = $.trim($('#password').val()),
			captcha = $.trim($('#captcha input').val());

		plus.nativeUI.showWaiting();

		M.ajax(_this.host + 'index.php?c=login', {
			data: {
				user: account,
				psw: psw,
				captcha: captcha
			},
			dataType: 'json',
			type: 'post',
			timeout: '15000', //15s
			success: function(res) {
				plus.nativeUI.closeWaiting();
				M.toast(res.data.msg);
				if (res.status == 'success') {
					plus.storage.setItem('account', account);
					_this.rememberPassword();
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
				} else if (res.status == 'error') {
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