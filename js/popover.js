(function(M, $) {
  M.plusReady(function() {
    var currentWebview = plus.webview.currentWebview();

    M('body').on('tap', '.mui-content', function(e) {
      if (e.target.tagName.toLowerCase() == 'a') {
        var url = $(e.target).attr('href'),
          webviewObj = {
            id: url.split('.')[0],
            url: url,
            createNew: true,
            waiting: {
              autoShow: false
            }
          };

        if (url == 'login.html') {
          webviewObj.extras = {
            showBack: true
          };
        }

        M.openWindow(webviewObj);
      }

      //setTimeout(function() {
      currentWebview.hide();
      //}, 100);
    });
  });
})(mui, Zepto);
