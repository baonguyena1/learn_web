'use strict';

tamagoApp.controller("WeekSelectCotroller", WeekSelectCotroller);

var weekSelectController = ['$scope', function WeekSelectCotroller($scope) {
  $scope.objWeekSelected = {};
  $scope.objYearSelected = {};
  $scope.weeksExportReportResults = [];
  $scope.historiesExportReportResults = [];
  $scope.yearsExportReportResults = [];

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

  $scope.tapShowSelectWeek = function() {
    console.log("tapShowSelectWeek");
    $('.select-week-dropdown').css('display', 'block');
  };
  $scope.tapSelectYear = function(y) {
    $scope.objYearSelected = y;
    fnSetYearSelected();
    $scope.getListOfAllWeeksOfYear(y['yearNumber']);
  };
}]
