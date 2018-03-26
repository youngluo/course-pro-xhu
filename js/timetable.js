(function(M, $, win) {
  var oDate = new Date(),
    day = oDate.getDay();

  $('#month').text(oDate.getMonth() + 1 + '月');
  day = day > 0 ? day : 7;
  $('#week li')
    .eq(day)
    .addClass('active');

  M.plusReady(function() {
    M.preload({
      id: 'timetable-detail',
      url: 'timetable-detail.html'
    });

    renderData();

    M('#timetable').on('tap', '.course-active', function() {
      var $this = $(this);
      M.fire(plus.webview.getWebviewById('timetable-detail'), 'getCourse', {
        course: $this.text()
      });
    });

    M('#popover-btns').on('tap', 'button', function(e) {
      var id = e.target.id;

      if (id == 'confirm') {
        M.fire(plus.webview.getWebviewById('parent'), 'getWeekNum', {
          weekVal: $('#popover .mui-input-numbox').val()
        });
      }

      M('#popover').popover('hide');
    });
  });

  win.addEventListener('update', function(e) {
    if (e.detail.update) {
      renderData();
    }
  });

  win.addEventListener('showPopover', function(e) {
    if (e.detail.isShow) {
      M('#popover').popover('toggle');
      $('#popover .mui-input-numbox').val(e.detail.curWeek);
    }
  });

  function renderData() {
    var timetable = T.getData('timetable');
    $('#timetable').html(
      template('timetable-tpl', {
        data: timetable
      })
    );
  }
})(mui, Zepto, window);
