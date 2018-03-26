(function(M, $, win) {
  mui.init({
    swipeBack: true //启用右滑关闭功能
  });

  M('.mui-scroll-wrapper').scroll();

  M.plusReady(function() {
    var curPage = plus.webview.currentWebview();

    win.addEventListener('getCourse', function(e) {
      renderData($.trim(e.detail.course).split('\n\n'));
      curPage.show('slide-in-right', 150);
    });
  });

  function renderData(courseArr) {
    courseArr = dataFormatter(courseArr);

    $('#course-detail').html(
      template('course-detail-tpl', {
        data: courseArr
      })
    );
  }

  function dataFormatter(courseArr) {
    var newCourseArr = [];

    $.each(courseArr, function(index) {
      var itemArr = this.split('\n'),
        courseObj = {};

      if (itemArr[0].indexOf('font') < 0) {
        courseObj.name = itemArr[0];
        courseObj.classroom = itemArr[3];
        courseObj.teacher = itemArr[2];
        courseObj.time = itemArr[1];
        newCourseArr.push(courseObj);
      }
    });

    var newCourseObj = {};

    $.each(newCourseArr, function() {
      var id = this.name + this.classroom;

      if (!newCourseObj[id]) {
        newCourseObj[id] = this;
      } else {
        var reg = /\{(.*?)\}/,
          time = newCourseObj[id].time,
          firetWeek = time.match(reg)[1],
          secondWeek = this.time.match(reg)[1];

        newCourseObj[id].time = time.replace(firetWeek, secondWeek + '，' + firetWeek);
      }
    });

    return newCourseObj;
  }
})(mui, Zepto, window);
