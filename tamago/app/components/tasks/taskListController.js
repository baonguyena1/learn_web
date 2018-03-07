/*
 *---------------------------------------------------------------------------
 * File Name      : taskListController.js
 * File Code      : UTF-8
 * Create Date    :
 * Copyright      : 2016 by GCS.
 *---------------------------------------------------------------------------
 * ver 1.0.0      : khuyentn new create
 *---------------------------------------------------------------------------
 * history        :
 *---------------------------------------------------------------------------
 */
'use strict';

tamagoApp
.controller('taskListController', taskListController)


taskListController.$inject = ['$scope', '$log', '$filter', '$location', '$window', 'Pagination',
                                'commonValues', 'getTasksListService', 'TASKS_LIST', 'blockUI',
                                'LIST_STATUS', 'LIST_SORT', 'STORAGE_KEYS', '$sce']
/**
 * [taskListController description]
 * @param  {[type]} $scope              [description]
 * @param  {[type]} $log                [description]
 * @param  {[type]} Pagination          [description]
 * @param  {[type]} getTasksListService [description]
 * @param  {[type]} TASKS_LIST          [description]
 * @return {[type]}                     [description]
 */
function taskListController($scope, $log, $filter, $location, $window, Pagination, commonValues,
                              getTasksListService, TASKS_LIST, blockUI,LIST_STATUS, LIST_SORT, STORAGE_KEYS, $sce) {


  $scope.list_sort = LIST_SORT;

  $scope.list_status = LIST_STATUS;

  $scope.sort_default = $scope.list_sort.normal;


  var pageInfo = null;
  $scope.$on('$viewContentLoaded', function(){
    var defaultStatus = commonValues.getObject(STORAGE_KEYS.TASK_STAUS_KEY);
    if (defaultStatus) {
      $scope.status_default = defaultStatus;
    }
    else {
      $scope.status_default = $scope.list_status.working;
    }

    var cellHeight = 135;
    var headerHeight = 50;
    var paggingMenuHeight = 50;
    var containHeight = $('.main').height() - $('.top-menu').height() - $('.paging-menu').height() - headerHeight - paggingMenuHeight;
    var page = Math.floor(containHeight/cellHeight);
    page = page === 0 ? 1: page;
    pageInfo = Pagination.getNew(page * 2);
    $scope.offsetVal = 0;
    $scope.noData = false;
    /**
     *Get tasks list after login
     */
    $scope.getTask();

  });


  $scope.currentPage;
  $scope.changePriority = fnChangePriority;
  $scope.changeStatus = fnChangeStatus;
  $scope.getParam = fnGetParam;
  $scope.getTask = fnGetTask;
  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'app/shared/layout/box-filter.html',
    title: 'Title'
  };
  $scope.newTask = 'khuyentn';
  $scope.deleteTaskSuccess = false;
  var eventListens = commonValues.getData();
  if(eventListens.key === 'delete-success'){
      $scope.deleteTaskSuccess = true;
      $scope.message = {
      "type": "success",
      "content": "Đã xóa công việc thành công!"
    }
  }
  ///////////////implement function/////////////////////////

  $scope.isActive = function(viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };


   $scope.$on('event-delete-success', function(event, args) {
      $scope.delete_success = true;
      $scope.mgs_success = args;
    });
  /**
   * [Get limit tasks from offset address]
   * @return {[type]} [description]
   */
  function fnGetTask() {
    blockUI.start({message: 'Đang tải dữ liệu...'});
    var request = getTasksListService.getTasksList(TASKS_LIST.METHOD,
    TASKS_LIST.API, $scope.getParam() , TASKS_LIST.HEADERS);
    request.success(function(response) {
      var tasksList = response.data.tasks;
      $log.debug(tasksList);
      var widthScreen = $window.innerWidth;
      if (tasksList.length === 0) {
        $scope.noData = true;
      }
      $scope.tasks  = tasksList;
      $scope.page   = pageInfo.page;
      $scope.totalItems   = response.data.total;
      $scope.currentPage = pageInfo.page;
      $scope.numPages = Math.ceil(response.data.total / pageInfo.perPage);
      $scope.perPage = pageInfo.perPage;
      blockUI.stop();
    });
  };
  function fnGetParam(){
    if (pageInfo.page == 0) {
      $scope.offsetVal = 0;
    } else {
      $scope.offsetVal = (pageInfo.page - 1) * pageInfo.perPage;
    }
    var iData = {
      project: '',
      user: commonValues.getUserId(),
      status: $scope.status_default.id,
      keyword: $scope.keyword || '',
      sort: $scope.sort_default.id ,
      //priority: $scope.priority_default.id ,
      offset: $scope.offsetVal,
      limit: pageInfo.perPage
    };
    return iData;
  }
  /**
   * [Get all tasks by current page]
   * @return {[type]} [description]
   */
  $scope.pageChanged = function() {
    pageInfo.toPageId($scope.currentPage);
    $scope.getTask();
  };

  /**/
  function fnChangePriority(target){
    if(angular.equals($scope.sort_default, target)){
      return;
    }
    $scope.sort_default = target;
    pageInfo.toPageId(1);
    $scope.getTask();
  }
  /**/
  function fnChangeStatus(target){
    $scope.noData = false;
    if(angular.equals($scope.status_default, target)){
      return;
    }
    $scope.status_default = target;
    commonValues.setObject(STORAGE_KEYS.TASK_STAUS_KEY, target);
    pageInfo.toPageId(1);
    $scope.getTask();
  }
}
