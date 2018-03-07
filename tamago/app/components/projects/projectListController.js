/*
 *---------------------------------------------------------------------------
 * File Name      : projectListController.js
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

tamagoApp.controller('projectListController', projectListController)


projectListController.$inject = ['$scope', '$log', 'Pagination', 'getTasksListService', 'commonValues',
                                  'PROJECTS_LIST', 'blockUI','blockUIConfig','LIST_STATUS','PROJECT_LIST_SORT', 'STORAGE_KEYS']

/**
 * [projectListController description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $log          [description]
 * @param  {[type]} PROJECTS_LIST [description]
 * @return {[type]}               [description]
 */
function projectListController($scope, $log, Pagination, getTasksListService, commonValues, PROJECTS_LIST,
                              blockUI, blockUIConfig, LIST_STATUS, LIST_SORT, STORAGE_KEYS) {

  var pageInfo = null;
  $scope.$on('$viewContentLoaded', function(){
    var cellHeight = 135;
    var headerHeight = 50;
    var paggingMenuHeight = 50;
    var containHeight = $('.main').height() - $('.top-menu').height() - headerHeight - paggingMenuHeight;
    var page = Math.floor(containHeight/cellHeight);
    page = page === 0 ? 1: page;
    pageInfo = Pagination.getNew(page * 2);
    $scope.offsetVal = 0;
    //$scope.noData = false;
    /**
    /*get projects list*/

    var defaultStatus = commonValues.getObject(STORAGE_KEYS.PROJECT_STAUS_KEY);
    if (defaultStatus) {
      $scope.status_default = defaultStatus;
    }
    else {
      $scope.status_default = $scope.list_status.working;
    }

    $scope.getGetProjects();

  });
   $scope.createProject = false;
   var eventListens = commonValues.getData();
   if (eventListens.key === 'new-project'){
    $scope.new_task = eventListens.value;
    $scope.createProject = true;
    $scope.message = {
    "type": "success",
    "content": "Dự án "+
    "<a class=\"cursor-pointer\" ng-href=\"#/dashboard/projects/" + $scope.new_task._id +"/thongtin\">"+
    "<strong>" +$scope.new_task.name+"</strong></a> đã được tạo thành công!"
  }
  }
  $scope.currentPage;
  $scope.noData = false;
  $scope.canCreateProject = commonValues.getCanCreateProject();

  //var pageInfo = Pagination.getNew(6);

  var offsetVal;
  var iData;

  $scope.getParam = fnGetParam;
  $scope.getGetProjects = fnGetProjects;
  // $scope.offsetVal = 0;

  $scope.list_status = angular.copy(LIST_STATUS);
  delete $scope.list_status['late'];
  //$scope.status_default = $scope.list_status.working;

  $scope.list_sort = LIST_SORT;
  $scope.sort_default = $scope.list_sort.name;
  //$scope.status_default = $scope.list_status.working;
  $scope.changeStatus = fnChangeStatus;
  $scope.changePriority = fnChangePriority;

  $scope.clickTask = function(){

  }
  /**
   * [Get limit tasks from offset address]
   * @return {[type]} [description]
   */
  function fnGetProjects() {
    blockUI.start({message: 'Đang tải dữ liệu...'});

    var request = getTasksListService.getTasksList(PROJECTS_LIST.METHOD,
    PROJECTS_LIST.API, fnGetParam(), PROJECTS_LIST.HEADERS);
    request.success(function(response) {
      //console.log(response);
      var projectsList = response.data.projects;
      $log.debug(response);
      $scope.projects  = projectsList;
      $scope.totalItems   = response.data.total;
      $scope.currentPage  = pageInfo.page;
      $scope.perPage = pageInfo.perPage;
      if ($scope.projects.length == 0) {
        $scope.noData = true;
      }
      else {
        $scope.noData = false;
      }
      blockUI.stop();
    }).error(function(response) {
      blockUI.stop();
    });

  };

  /**
   *Get tasks list after login
   */


  /**
   * [Get all tasks by current page]
   * @return {[type]} [description]
   */
  $scope.pageChanged = function() {
    pageInfo.toPageId($scope.currentPage);
    $scope.getGetProjects();
  };

  $scope.disable = function() {
    return false;
  };
  /**/
  function fnChangePriority(target){
    if(angular.equals($scope.sort_default, target)){
      return;
    }
    console.log(JSON.stringify(target));
    $scope.sort_default = target;
    pageInfo.toPageId(1);
    $scope.getGetProjects();
  }
  /**/
  function fnChangeStatus(target){
    if(angular.equals($scope.status_default, target)){
      return;
    }
    commonValues.setObject(STORAGE_KEYS.PROJECT_STAUS_KEY, target);
    $scope.status_default = target;
    pageInfo.toPageId(1);
    $scope.getGetProjects();
  }
  /**/
  function fnGetParam(){
    if (pageInfo.page == 0) {
      $scope.offsetVal = 0;
    } else {
      $scope.offsetVal = (pageInfo.page - 1) * pageInfo.perPage;
    }
    var iData = {
          project: '',
          owners: '',
          status: $scope.status_default.id,
          keyword: $scope.keyword || '',
          sort: $scope.sort_default.id ,
          offset: $scope.offsetVal,
          limit: pageInfo.perPage
        };
    return iData;
  }
  /**/

}
