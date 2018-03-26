(function(M, $, win) {
  var padding = ($(win).height() - $('#main').height()) / 8;

  $('.mui-table-view.mui-grid-view .mui-table-view-cell').css({
    paddingTop: padding,
    paddingBottom: padding
  });

  M.plusReady(function() {
    if (!plus.storage.getItem('isLogin')) {
      plus.webview.open(
        'login.html',
        'login',
        {
          top: 0,
          bottom: 0
        },
        'none',
        0,
        function() {
          plus.navigator.closeSplashscreen();
        }
      );
    } else {
      setTimeout(function() {
        plus.navigator.closeSplashscreen();
      }, 1500);
    }

    examHint();

    M.preload({
      id: 'parent',
      url: 'parent.html',
      styles: {
        top: 0,
        bottom: 0
      }
    });

    var parentPage = null;

    M('#main').on('tap', 'li', function(e) {
      var self = this,
        title = $(this)
          .find('div')
          .text();

      if (!parentPage) {
        parentPage = plus.webview.getWebviewById('parent');
      }

      M.fire(parentPage, 'getTitle', {
        title: title,
        id: self.id
      });

      M.openWindow({
        id: 'parent'
      });
    });

    M('#popover').on('change', 'input', function() {
      if (this.checked) {
        plus.storage.setItem('isHint', 'false-' + +new Date());
      } else {
        plus.storage.setItem('isHint', 'true');
      }
    });

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
  });

  M('#popover').on('tap', 'button', function(e) {
    M('#popover').popover('hide');
  });

  function examHint() {
    var isHint = plus.storage.getItem('isHint');
    if (isHint && isHint.indexOf('false') > -1) {
      if (new Date() - isHint.split('-')[1] >= 24 * 60 * 60 * 1000) {
        plus.storage.removeItem('isHint');
      } else {
        return;
      }
    }

    var newArr = [],
      exam = T.getData('exam');

    $.each(exam, function() {
      var $this = $(this),
        examDetailTime = $this[2];

      if (examDetailTime == '&nbsp;') return false;

      var examDate = examDetailTime.match(/\((.*?)\)/)[1],
        examTime = examDetailTime.split(' ')[1].split('-')[0];

      if (checkDate(examDate + ' ' + examTime)) {
        newArr.push({
          time: examDetailTime,
          place: $this[3],
          courseName: $this[0]
        });
      }
    });

    if (newArr.length > 0) {
      $('#popover').html(
        template('exam-hint-tpl', {
          dataList: newArr,
          count: newArr.length
        })
      );

      M('#popover').popover('show');
    }
  }

  function checkDate(date) {
    var distance = new Date(date) - new Date('2016-5-22 22:00');
    if (distance >= 0 && distance / 1000 / 60 / 60 < 24) {
      return true;
    }
    return false;
  }
})(mui, Zepto, window);
