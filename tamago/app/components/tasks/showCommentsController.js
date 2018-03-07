/*
 *---------------------------------------------------------------------------
 * File Name      : showComments.js
 * File Code      : UTF-8
 * Create Date    : September 14, 2016
 * Copyright      : 2016 by GCS.
 *---------------------------------------------------------------------------
 * ver 1.0.0      : September 14, 2016 khuyentn new create
 *---------------------------------------------------------------------------
 * history        :
 *---------------------------------------------------------------------------
 */
'use strict';

tamagoApp
.controller('showCommentsController', ['$scope', '$stateParams', '$log', '$location', 'getCommonService', 'TASKS_DETAIL', showCommentsController])


function showCommentsController($scope, $stateParams, $log, $location, getCommonService, TASKS_DETAIL) {
	var taskId  = $stateParams.idTask;
	var taskUrl = TASKS_DETAIL.API + taskId;

    var request = getCommonService.getMethod(TASKS_DETAIL.METHOD, taskUrl, TASKS_DETAIL.HEADERS);

    request.success(function(response) {

        var taskInforTemp = response.data;
        $log.debug(taskInforTemp);

        var startDate = new Date(taskInforTemp.plan_start_date);
        taskInforTemp.plan_start_date = convertDate(startDate);

        var endDate   = new Date(taskInforTemp.plan_end_date);
        taskInforTemp.plan_end_date = convertDate(endDate);

        $scope.taskInformation = taskInforTemp;
    }).error(function(response) {
    	//$log.debug(response);
    	$location.path('/login');
    });
  };

