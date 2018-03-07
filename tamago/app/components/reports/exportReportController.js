'use strict';

tamagoApp.controller('exportReportController',  exportReportController);

exportReportController.$inject = ['$scope', 'getTasksListService', 'EXPORT_REPORT', 'blockUI'];

function exportReportController($scope, getTasksListService, EXPORT_REPORT, blockUI) {
  /****************************************
   *  DECLARE VARIABLES
   ****************************************/
  var totalPages = 0;
  var totalHistory = 0;
  var limit = 20;
  var offsetVal;
  $scope.objWeekSelected = {};
  //$scope.objProjectSelected = {};
  $scope.objYearSelected = {};
  $scope.weeksExportReportResults = [];
  $scope.historiesExportReportResults = [];
  $scope.yearsExportReportResults = [];
  //$scope.searchReportResults = [];
  $scope.pagesHistory = 0;
  $scope.canLoadMoreHistory = true;
  $scope.checkAgainFileStatus = true;
  //$scope.myKeywordReportProject = '';

  $scope.error = false;

  /****************************************
   *  FUNCTIONS FOR GET DATA IN LIST OF WEEKS
   ****************************************/
  Date.prototype.getWeek = function() {

    // Create a copy of this date object
    var target  = new Date(this.valueOf());

    // ISO week date weeks start on monday, so correct the day number
    var dayNr   = (this.getDay() + 6) % 7;

    // Set the target to the thursday of this week so the
    // target date is in the right year
    target.setDate(target.getDate() - dayNr + 3);

    // ISO 8601 states that week 1 is the week with january 4th in it
    var jan4    = new Date(target.getFullYear(), 0, 4);

    // Number of days between target date and january 4th
    var dayDiff = (target - jan4) / 86400000;

    if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
      // Calculate week number: Week 1 (january 4th) plus the
      // number of weeks between target date and january 4th
      return 1 + Math.ceil(dayDiff / 7);
    }
    else {  // jan 4th is on the next week (so next week is week 1)
      return Math.ceil(dayDiff / 7);
    }
  };
  function getWeekNumber(d) {
      // Copy date so don't modify original
      var d = new Date(+d);
      d.setHours(0,0,0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(),0,1);
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
      // Return array of year and week number
      return [d.getFullYear(), weekNo];
  };
  function getStartDateOfWeek(w,y){
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  }
  function getEndDateOfWeek(w,y){
    var startDate = getStartDateOfWeek(w,y);
    return startDate.setDate(startDate.getDate() + 6);
  }
  function getDateRangeOfWeek(weekNo,year,firstOrLastDate){
    var startDate = getStartDateOfWeek(weekNo,year);
    var rangeIsFrom = startDate.getDate() + "/" + eval(startDate.getMonth()+1) + "/" + startDate.getFullYear();
    startDate.setDate(startDate.getDate() + 6);
    var rangeIsTo = startDate.getDate() + "/" + eval(startDate.getMonth()+1) + "/" + startDate.getFullYear();
    if (firstOrLastDate == 'last') {
      return rangeIsTo;
    } else {
      return rangeIsFrom;
    }
  };
  function weeksInYear(year) {
    var d = new Date(year, 11, 31);
    var week = getWeekNumber(d)[1];
    return week == 1? getWeekNumber(d.setDate(24))[1] : week;
  };
  $scope.getListOfAllWeeksOfYear = function(year) {

    //Check and remove all objects in array $scope.searchReportResults
    if ($scope.weeksExportReportResults.length > 0) {
      $scope.weeksExportReportResults = [];
    }

    //Remove all html before add new cell
    $('.select-week-dropdown li ul week-for-export-report').children().remove();

    var date = new Date();
    var selectedYear = date.getFullYear();
    var endWeekNumber = date.getWeek();
    if (typeof year != 'undefined' && year != selectedYear) {
      endWeekNumber = weeksInYear(year);
      selectedYear = year;
    } else {
      $scope.objYearSelected['yearNumber'] = selectedYear;
    }

    for (var i = (endWeekNumber); i >= 1; i--) {
      var item = {};
      item['weekNumber'] = i.toString();
      item['fromDate'] = getDateRangeOfWeek(i,selectedYear,'first');
      item['toDate'] = getDateRangeOfWeek(i,selectedYear,'last');
      $scope.weeksExportReportResults.push(item);
    }

    $scope.objWeekSelected = $scope.weeksExportReportResults[0];
    fnSetWeekSelected();
  };
  $scope.getListOfYearsFromNow = function() {
    var currentYear = new Date().getFullYear();
    for (var i = currentYear; i >= (currentYear - 10); i--) {
      var item = {};
      item['yearNumber'] = i.toString();
      $scope.yearsExportReportResults.push(item);
    }
  };
  /****************************************
   *  DECLAE FUNCTIONS
   ****************************************/
   /*
  function fnClickResultSearch() {
    // Change GUI after tap to cell of project result

    //Hide search result view
    $('.search-results-rp-project').css('display', 'none');

    //Set text result search
    $('#input-search-report').val($scope.objProjectSelected.name);

    //Change font of input
    $('#input-search-report').css('font-size','20px');
    $('#input-search-report').css('font-weight','bold');

    //Change width of input
    $('.report-search-project-container').css('width', '800px');
  };
  function fnWhenHideSearchView() {
    //Show popup search
    $('.search-results-rp-project').css('display','none');
  };
  function fnWhenShowSearchView() {
    //Reset data search
    $scope.searchReportResults = [];
    $scope.pages = 0;

    //Set text result search
    $('#input-search-report').val('');

    //Change font of input
    $('#input-search-report').css('font-size','15px');
    $('#input-search-report').css('font-weight','normal');

    //Show popup search
    $('.search-results-rp-project').css('display','block');

    //Change width of input
    $('.report-search-project-container').css('width', '500px');

  };
  */
  $scope.showAlertError = function(response) {
    $scope.error = true;
    $('#alert-export-report').show();
    if (response != null && response.errors && response.errors.length > 0) {
      var error = response.errors[0];
      $scope.mgs_error = error.message;
    } else {
      $scope.mgs_error = 'Có lỗi xảy ra, vui lòng thử lại!';
    }
    setTimeout(function(){
        $('#alert-export-report').hide();
         $scope.error = false;
         $scope.mgs_error = "";
     }, 2000);
  }

  function fnSetWeekSelected() {
    var numberWeekSelected = $scope.objWeekSelected['weekNumber'];
    var dateFrom = $scope.objWeekSelected['fromDate'];
    var dateTo = $scope.objWeekSelected['toDate'];
    $('.p-number-week').html('Tuần ' + numberWeekSelected);
    $('.p-fromto-week').html('Từ ' + dateFrom + ' đến ' + dateTo);
  }
  function fnSetYearSelected() {
    var numberYearSelected = $scope.objYearSelected['yearNumber'];
    $('.p-year').html(numberYearSelected);
  }

  /****************************************
   *  CALL WEBSERVICES
   ****************************************/
   /*
   //function getProjects() {
    if ($scope.pages == 0) {
       offsetVal = 0;
     } else {
       offsetVal = $scope.pages  * limit;
     }
     var iData = {
           offset: offsetVal,
           limit: limit,
           keyword: $scope.myKeywordReportProject,
         };
     var requestSearch = getTasksListService.getTasksList(PROJECTS_LIST.METHOD,
     PROJECTS_LIST.API, iData, PROJECTS_LIST.HEADERS);
     requestSearch.success(function(response) {
           $scope.canLoadMore = true;
           console.log(response);
           total = response.data.total;
           var searchTemp = [];
           var projects = response.data.projects;
           var len = projects.length;
           for (var i = 0; i < len; i++) {
             $scope.searchReportResults.push({
                 thumbnail: projects[i].thumbnail?
                 response.data.projects[i].thumbnail:'./assets/img/icons/project_img_icon.png',
                 name: response.data.projects[i].name,
                 id: response.data.projects[i]._id
           });
           }
         }).error(function(response) {
           $scope.canLoadMore = true;
       });
   };
   */
   $scope.exportReport = function() {
     blockUI.start({message: "Đang xử lý ..."});
    var iData = {
            week: $scope.objWeekSelected['weekNumber'],
            year: $scope.objYearSelected['yearNumber']
          };
      var url = EXPORT_REPORT.API + 'project';
      var requestSearch = getTasksListService.getTasksList(EXPORT_REPORT.METHOD,
      url, iData, EXPORT_REPORT.HEADERS);
      requestSearch.success(function(response) {
           if(response.data._id != null) {
             $scope.checkAgainFileStatus = true;
             $scope.checkStatusOfReport($scope.objWeekSelected['weekNumber'], 2016, response.data._id);
           } else {
             blockUI.stop();
           }
          }).error(function(response) {
           blockUI.stop();
           $scope.showAlertError(response);
        });
   };
   $scope.checkStatusOfReport = function(week, year, reportId) {
    var iData = {
            week: week,
            year: year
          };
      var urlCheckStatus = EXPORT_REPORT.API + 'file' + '/' + reportId + '/' + 'status';
      var requestSearch = getTasksListService.getTasksList(EXPORT_REPORT.METHOD,
      urlCheckStatus, iData, EXPORT_REPORT.HEADERS);
      requestSearch.success(function(response) {
           if(response.data.status != null) {
             if (response.data.status == 0) {
               if ($scope.checkAgainFileStatus == true) {
                 setTimeout(function(){
                      $scope.checkStatusOfReport(week, year, reportId);
                  }, 1000);
               }
             } else {
               blockUI.stop();
               $scope.checkAgainFileStatus = false;
               if (response.data.status == 1) {
                 //Export file successfully
                 $scope.pagesHistoy = 0;
                 $scope.getHistoryReport(true);
                 window.location.href = response.data.link;
               }
             }
           } else {
             blockUI.stop();
             $scope.checkAgainFileStatus = false;
           }
          }).error(function(response) {
           blockUI.stop();
           $scope.checkAgainFileStatus = false;
           $scope.showAlertError(response);
        });
   };
   $scope.getHistoryReport = function(isFirstLoad) {
     if (isFirstLoad != 'undefined' && isFirstLoad) {
       $scope.historiesExportReportResults = [];
     }
     blockUI.start({message: "Đang xử lý ..."});
     if ($scope.pagesHistoy == 0) {
        offsetVal = 0;
      } else {
        offsetVal = $scope.pagesHistoy  * limit;
      }
      var iData = {
        offset: offsetVal,
        limit: limit
      };
      var requestSearch = getTasksListService.getTasksList(EXPORT_REPORT.METHOD,
      EXPORT_REPORT.API, iData, EXPORT_REPORT.HEADERS);
      requestSearch.success(function(response) {
        $scope.canLoadMoreHistory = true;
        totalHistory = response.data.total;

        var dataHistories = [];
        if (response.data.historys != null) {
          dataHistories = response.data.historys;
        }
        if (dataHistories.length > 0) {
          for (var i = 0; i < dataHistories.length; i++) {
            var objHistory = dataHistories[i];
            var item = {};
            item['weekNumber'] = objHistory['week'];
            item['fromDate'] = getDateRangeOfWeek(objHistory['week'],objHistory['year'],'first');
            item['toDate'] = getDateRangeOfWeek(objHistory['week'],objHistory['year'],'last');
            item['timeAgo'] = objHistory['updated_at'];
            item['link'] = objHistory['link'];
            $scope.historiesExportReportResults.push(item);
          }
        }
          blockUI.stop();
          }).error(function(response) {
           blockUI.stop();
           $scope.canLoadMoreHistory = true;
           $scope.showAlertError(response);
        });
   };

  /****************************************
   *  INIT
   ****************************************/
   $scope.$on('$viewContentLoaded', function(){
     $scope.getListOfAllWeeksOfYear();
     $scope.getListOfYearsFromNow();
     $scope.pagesHistoy = 0;
     $scope.getHistoryReport(true);
   });

   $scope.$on('event-error', function(event, args) {
     $scope.error = true;
     $scope.mgs_error = args;
   });

  /****************************************
   *  EVENT DETECT CHANGE SEARCH KEY WORD
   ****************************************/
   /*
  //$scope.$watch('myKeywordReportProject', function(Vnew , Vold){
    $scope.searchReportResults = [];
    $scope.pages = 0;
    if(Vnew !== Vold){
      getProjects();
    }
  })
  */
  /****************************************
   *  EVENT DETECT WHEN TAP ELEMENT
   ****************************************/
   /*
  //$scope.pressSearchProjectReport = function() {
    fnWhenShowSearchView();
  };
  //$scope.pressOutSearchProjectReport = function() {
    $scope.display = $('.search-results-rp-project').css('display');
    $scope.mystyle = {
      'display': 'none'
    };
  }
  //$scope.selectReportProject = function(s) {
      //Tap to cell of project result
      $scope.objProjectSelected = s;
      fnClickResultSearch();
  };
  */
  $scope.tapShowSelectWeek = function() {
    setTimeout(function () {
      $('.select-week-dropdown').toggle();
    }, 10);
    //$('.select-week-dropdown').css('display', 'block');
  };
  $scope.tapSelectYear = function(y) {
    $scope.objYearSelected = y;
    fnSetYearSelected();
    $scope.getListOfAllWeeksOfYear(y['yearNumber']);
  };
  $scope.tapExportReport = function() {
    $scope.exportReport();
  };
  $scope.tapWeekNumber = function(w) {
    $scope.objWeekSelected = w;
    fnSetWeekSelected();
  };
  $scope.tapShowSelectYear = function() {
    console.log($('.select-year-dropdown'));
    setTimeout(function () {
      $('.select-year-dropdown').toggle();
    }, 10);
  };

  /****************************************
   *  EVENT LOAD MORE
   ****************************************/
   /*
  //$scope.loadMoreProjects = function() {
    if ($scope.canLoadMore) {
      $scope.canLoadMore = false;
      $scope.pages++;
      getProjects();
    }
  };
  */

  $scope.endScrollHistory = function() {
    if ($scope.canLoadMoreHistory) {
      $scope.canLoadMoreHistory = false;
      $scope.pagesHistoy++;
      $scope.getHistoryReport();
    }
  };
}
