'use strict';
tamagoApp.factory('weekSelectService', [function() {
  var date = new Date();

  this.weekSelected = {
    year: date.getFullYear(),
    week: date.getWeek()
  };

  var setWeekSelected = function(week, year) {
    if (typeof week === 'number' && typeof year === 'number') {
      this.weekSelected = {
        year: year,
        week: week
      };
    }
  };

  var getWeekSelected = function() {
    return this.weekSelected;
  };

  return {
    weekSelected: this.weekSelected
    // setWeekSelected: setWeekSelected,
    // getWeekSelected: getWeekSelected
  };

}]);
