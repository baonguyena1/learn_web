'use strict';

tamagoApp.controller('weeklyReportController',  weeklyReportController);

weeklyReportController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'URL_VALUES', 'REPORT_ACTION', 'blockUI', 'taskInfo', 'reportInfo', 'actionMode', 'weekSelectService', 'postCommonService'];

function weeklyReportController($rootScope, $scope, $uibModalInstance, URL_VALUES, REPORT_ACTION, blockUI, taskInfo, reportInfo, actionMode, weekSelectService, postCommonService) {
  $scope.taskInfo = taskInfo;
  $scope.reportInfo = reportInfo;
  $scope.alerts = [];
  $scope.actionMode = actionMode;
  $scope.reportActions = REPORT_ACTION;
  $scope.canSelectWeek = true;

  if (actionMode == REPORT_ACTION.VIEW) {
    $scope.canSelectWeek = false;
  }

  if ($scope.reportInfo) {
    weekSelectService.weekSelected = {
      week: $scope.reportInfo.week_number,
      year: $scope.reportInfo.year
    };
  }
  else {
    weekSelectService.weekSelected = {
      year: moment().year(),
      week: moment().week()
    }
  }

  $scope.doneAction = function() {
    if (!validateReport()) {
      return;
    }

    blockUI.start({
      message: 'Đang xử lý...'
    });

    var method = "POST";
    var url = URL_VALUES.TASKS + "/" + taskInfo._id + "/comments"
    if ($scope.reportInfo._id) {
      url = url + "/" + $scope.reportInfo._id;
      method = "PUT";
    }

    var data = {
      comment : $scope.reportInfo.message,
      comment_type: 2,
      next_plan : $scope.reportInfo.next_plan,
      result : $scope.reportInfo.result,
      week_number : weekSelectService.weekSelected.week,
      year : weekSelectService.weekSelected.year
    };

    postCommonService.postMethod(method, url, data)
      .success(function(reponse) {
        blockUI.stop();
        $uibModalInstance.close();
        if ($scope.actionMode === $scope.reportActions.CREATE) {
          $rootScope.$broadcast('create-weekly-report-sucess', weekSelectService.weekSelected);
        }
        else if ($scope.actionMode === $scope.reportActions.EDIT) {
          $rootScope.$broadcast('edit-weekly-report-sucess', weekSelectService.weekSelected);
        }

      })
      .error(function(response) {
        blockUI.stop();
        if (response) {
          if (response.errors && response.errors.length > 0) {
            var error = response.errors[0];
            $scope.alerts.push({type: 'danger', message: error.message});
          } else {
            $scope.alerts.push({type: 'danger', message: 'Có lỗi xảy ra, vui lòng thử lại!'});
          }
        }
        else {
          $scope.alerts.push({type: 'danger', message: 'Không kết nối được tới máy chủ, vui lòng thử lại!'});
        }
      });
  };

  $scope.currentWeek = function() {
    return weekSelectService.weekSelected.week + "/" + weekSelectService.weekSelected.year;
  };

  $scope.nextWeek = function() {
    if (weekSelectService.weekSelected.week === moment().weeksInYear()) {
      var year = weekSelectService.weekSelected.year + 1;
      return 1 + "/" + year;
    }
    else {
      var week = weekSelectService.weekSelected.week + 1;
      return week + "/" + weekSelectService.weekSelected.year;
    }
  };

  //handle cancel action when user click on cancel button
  $scope.cancelAction = function() {
    $uibModalInstance.close();
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  var validateReport = function() {
    if (!$scope.reportInfo || !$scope.reportInfo.message || !$scope.reportInfo.message.trim()) {
      $scope.alerts.push({type: 'danger', message: 'Không được để trống Kế hoạch tuần ' + $scope.currentWeek() + '!'});
      return false;
    }
    else if (!$scope.reportInfo.result || !$scope.reportInfo.result.trim()) {
      $scope.alerts.push({type: 'danger', message: 'Không được để trống Kết quả tuần ' + $scope.currentWeek() + '!'});
      return false;
    }
    else if (!$scope.reportInfo.next_plan || !$scope.reportInfo.next_plan.trim()) {
      $scope.alerts.push({type: 'danger', message: 'Không được để trống Kế hoạch tuần ' + $scope.nextWeek() + '!'});
      return false;
    }
    return true;
  };
}
