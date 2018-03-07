(function() {
  'use strict';
  var cm_filters = angular.module('cm.filter', []);

  cm_filters
    .filter('formatDate', function() {
      return function(value, vdefault) {
        if (!value || typeof value === 'undefined') return vdefault;
        var date = new Date(value);
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
        var year = date.getFullYear();
        var fullDate = day + '/' + month + '/' + year;
        return fullDate;
      };
    });
  cm_filters
    .filter('timeComment', function() {
      return function(value, vdefault) {
        if (!value || typeof value === 'undefined') return vdefault;
        var timeComment = new Date(value);
        var hour = timeComment.getHours();
        var minute = timeComment.getMinutes();
        if (minute < 10) {
          minute = '0' + minute;
        }
        var time = hour + ':' + minute;
        return time;
      };
    });
  cm_filters
    .filter('formatFullDate', function() {
      var list_date = [];
      var task_id = [];
      return function(value, taskId) {
        var date = new Date(value);
        var weekDay = '';
        var weekDayNumber = date.getDay();
        switch (weekDayNumber) {
          case 1:
            weekDay = 'Thứ Hai';
            break;
          case 2:
            weekDay = 'Thứ Ba';
            break;
          case 3:
            weekDay = 'Thứ Tư';
            break;
          case 4:
            weekDay = 'Thứ Năm';
            break;
          case 5:
            weekDay = 'Thứ Sáu';
            break;
          case 6:
            weekDay = 'Thứ Bảy';
            break;
          case 0:
            weekDay = 'Chủ Nhật';
            break;
        }
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
        var year = date.getFullYear();
        var fullDate = weekDay + ', ' + day + '/' + month + '/' + year;
        if (task_id.indexOf(taskId) === -1) {
          task_id.push(taskId);
          list_date.push(fullDate);
          return fullDate;
        } else if ((task_id.indexOf(taskId) > -1) && (list_date.indexOf(fullDate) === -1)) {
          list_date.push(fullDate);
          return fullDate;
        } else {
          return '';
        }
      };
    });
  cm_filters
    .filter('formatTime', function() {
      return function(value) {
        moment.updateLocale('vi', {
          relativeTime: {
            future: 'còn %s',
            past: 'trễ %s',
            s: 'vài giây',
            m: '1 phút',
            mm: '%d phút',
            h: '1 giờ',
            hh: '%d giờ',
            d: '1 ngày',
            dd: '%d ngày',
            M: '1 tháng',
            MM: '%d tháng',
            y: '1 năm',
            yy: '%d năm'
          }
        });
        return moment(value).fromNow(true);
      };
    });
  cm_filters
    .filter('taskStatus', function() {
      return function(value, status) {
        var statusString = null;
        switch (status) {
          case 0:
            statusString = 'Mới nhận';
            break;
          case 2:
            statusString = 'Hoàn thành';
            break;
          case 3:
            statusString = 'Mở lại';
            break;
          case 4:
            statusString = 'Đã huỷ';
            break;
          case 5:
            statusString = 'Tạm dừng';
            break;
          default:
        }
        if (statusString) {
          return statusString;
        }

        moment.updateLocale('vi', {
          relativeTime: {
            future: 'Còn %s',
            past: 'Trễ %s',
            s: '0 ngày',
            m: '0 ngày',
            mm: '0 ngày',
            h: '0 ngày',
            hh: '0 ngày',
            d: '1 ngày',
            dd: '%d ngày',
            M: '1 tháng',
            MM: '%d tháng',
            y: '1 năm',
            yy: '%d năm'
          }
        });

        if (moment(value).startOf('days').isSame(moment().startOf('days'), 'day')) {
          return "Hết hạn hôm nay";
        } else {
          return moment(value).startOf('days').from(moment().startOf('days'));
        }
      };
    });
  cm_filters
    .filter('photo', function() {
      return function(value) {

        if (value === null || value === '') {
          return './assets/img/icons/project_img_icon.png';
        }
        return value;
      };
    });
  cm_filters
    .filter('congVanIcon', function() {
      return function(value) {
        switch (value) {
          case 0:
            return './assets/img/icons/in_document.png';
            break;
          case 1:
            return './assets/img/icons/out_document.png';
            break;
          case 2:
            return './assets/img/icons/output_document.png';
            break;
        }
      };
    });
  cm_filters
    .filter('priority', function() {
      return function(value) {
        switch (value) {
          case 0:
            return 'circle-prior-low';
            break;
          case 1:
            return 'circle-prior-normal';
            break;
          case 2:
            return 'circle-prior-hight';
            break;
          case 3:
            return 'circle-prior-urgent';
            break;
          default:
        }
      };
    });

  cm_filters
    .filter('taskStatusIcon', function() {
      return function(task) {
        var status = task.status;
        var icon = './assets/img/icons/icn-clock.png';
        switch (status) {
          case 0:
            if (task.dependency === 1) {
              icon = './assets/img/icons/dependency_task_status.png';
            } else if (task.dependency === 2) {
              icon = './assets/img/icons/dependency_task_status.png';
            } else {
              icon = './assets/img/icons/New_icn.png';
            }
            break;
          case 1:
            icon = './assets/img/icons/progress_icon.png';
            break;
          case 2:
            icon = './assets/img/icons/done_status.png';
            break;
          case 3:
            icon = './assets/img/icons/reopen_status.png';
            break;
          case 4:
            icon = './assets/img/icons/cancel_status.png';
            break;
          case 5:
            icon = './assets/img/icons/pause_status.png';
            break;
          default:
        }
        return icon;
      };
    });
  cm_filters
    .filter('cutString', function() {
      return function(value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
          var lastspace = value.lastIndexOf(' ');
          if (lastspace != -1) {
            //Also remove . and , so its gives a cleaner result.
            if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
              lastspace = lastspace - 1;
            }
            value = value.substr(0, lastspace);
          }
        }

        return value + (tail || ' …');
      };
    });
  cm_filters
    .filter('filterProjectName', function() {
      return function(projectName) {
        var labelWidth = $('.project-info-task-list-panel').width();
        var projectNameLength = (labelWidth / 10) - 3;
        var shortName = '';
        if (projectName.length > projectNameLength) {
          shortName = projectName.substr(0, projectNameLength) + '...';
        } else {
          shortName = projectName;
        }
        return shortName;
      };
    });
  cm_filters
    .filter('filterTaskName', function() {
      return function(taskName) {
        // console.log(taskName);
        var labelWidth = $('.task-list-panel').width();

        var taskNameLength = (labelWidth / 10) - 3;
        var shortName = '';
        if (taskName.length > taskNameLength) {
          shortName = taskName.substr(0, taskNameLength) + '...';
        } else {
          shortName = taskName;
        }
        return shortName;
      };
    });
  cm_filters
    .filter('titleTaskClass', function() {
      return function(planEndDate, status) {
        if (status === 0 || status === 1 || status === 3 || status === 5) {
          if (moment(planEndDate).isBefore(moment(), 'day')) {
            return 'late-task-title';
          }
        }
        if (status === 2) {
          return 'complete-task-title';
        }
        return "";
      };
    });
  cm_filters
    .filter('displayTimeFrom', function() {
      return function(date) {
        return moment(date).fromNow();
      };
    });
  cm_filters
    .filter('displayUserName', function() {
      return function(user, vdefault) {
        if (!user || typeof user === 'undefined') return vdefault;
        if (user) {
          var firstName = user.first_name ? " " + user.first_name : "";
          var lastName = user.last_name ? user.last_name : "";
          var middleName = user.middle_name ? (" " + user.middle_name) : " ";

          return lastName + middleName + firstName;
        } else {
          return "";
        }
      };
    });
  cm_filters
    .filter('filterTaskProjectName', function() {
      return function(taskProjectName) {
        var labelWidth = $('.task-list-panel').width() - 200;
        console.log('label widht', labelWidth);
        var taskProjectNameLength = (labelWidth / 6) - 3;
        var shortName = '';
        if (taskProjectName.length > taskProjectNameLength) {
          shortName = taskProjectName.substr(0, taskProjectNameLength) + '...';
        } else {
          shortName = taskProjectName;
        }
        return shortName;
      };
    });
})();
