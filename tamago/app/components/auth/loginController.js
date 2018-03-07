/*
 *---------------------------------------------------------------------------
 * File Name      : loginController.js
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
.controller('loginController', ['$translate', '$scope', '$location', '$window', '$log', 'postCommonService', 'commonValues', 'blockUI', 'LOGIN','$rootScope', loginController]);

/**
 * [This function will be called when user submit login form]
 * @param  {[Object]}  $scope             [The application object]
 * @param  {[Service]} $location         [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Service]} postCommonService     [declare service]
 * @return                               [Redirect to to new page]
 */
function loginController($translate, $scope, $location, $window, $log, postCommonService, commonValues, blockUI, LOGIN, $rootScope) {
  blockUI.stop();
  $scope.processing = false;
  $scope.errologin = '';
  $scope.$on('errologin', function(e, data){
    $scope.errologin = data;
  })
  $scope.result;
  $scope.disconnectServer = '';

  $scope.linkTaskImg    = './assets/img/icons/icn-congviec.png';
  $scope.linkProjectImg = './assets/img/icons/icn-project.png';
  $scope.linkReportImg  = './assets/img/icons/icn-report.png';

  $scope.changeProjectImage =  function(){
      $scope.linkTaskImg    = './assets/img/icons/icn-congviec.png';
      $scope.linkProjectImg = './assets/img/icons/icn-highlight-project.png';
      $scope.linkReportImg  = './assets/img/icons/icn-report.png';
  }
  $scope.changeTaskImage =  function(){
      $scope.linkTaskImg = './assets/img/icons/icn-highlight-congviec.png';
      $scope.linkProjectImg = './assets/img/icons/icn-project.png';
      $scope.linkReportImg  = './assets/img/icons/icn-report.png';
  }
  $scope.changeReportImage =  function(){
      $scope.linkReportImg = './assets/img/icons/icn-report-highlight.png';
      $scope.linkTaskImg = './assets/img/icons/icn-congviec.png';
      $scope.linkProjectImg = './assets/img/icons/icn-project.png';
  }
  $scope.usernameEvent = function() {
      $scope.result = '';
  };
  $scope.passwordEvent = function() {
      $scope.result = '';
  };
 $scope.$on('event-error', function(event, args){
    $scope.error = true;
    $scope.mgs_error = args;

  });
  $scope.login = function() {
    var username = $scope.username ;
    var password = $scope.password ;
    if(!username && !password){
        $rootScope.$broadcast('event-error','Tên đăng nhập và mật khẩu không được để trống');
        return;
    }
    if(!username){
        $rootScope.$broadcast('event-error','Tên đăng nhập không được để trống');
        return;
    }
    if(!password){
        $rootScope.$broadcast('event-error','Mật khẩu không được để trống');
        return;
    }

    var iData    =  {
        username: username,
        password: password
      };
    $scope.processing = true;
    var request = postCommonService.postMethod(LOGIN.METHOD, LOGIN.API, iData, LOGIN.HEADERS);

    request.success(function(response) {
      $scope.processing = false;
        var nameLabelWidth = $(window).width() / 5;
        var fullName = response.data.last_name + ' '+ response.data.middle_name + ' ' + response.data.first_name;
        //var fullName = response.data.first_name + ' '+ response.data.middle_name + ' ' + response.data.last_name;
        var fullNameLength = fullName.length;
        if (!fullName || 0 === fullName.length){
            $scope.displayName = response.data.username;
        } else {
            if (fullNameLength * 8 > nameLabelWidth) {
                fullName = response.data.last_name + ' '+ response.data.middle_name[0] + '. ' + response.data.first_name;
            }
            $scope.displayName = fullName;
        }
        commonValues.setRole( response.data.role );
        commonValues.setUserName($scope.displayName);
        var userAvatar = response.data.avatar;
         if (!userAvatar || 0 === userAvatar.length){
            $scope.linkAvatar = './assets/img/icons/default_avatar.png';
        } else {
            $scope.linkAvatar = userAvatar;
        }
        commonValues.setUserAvatar($scope.linkAvatar);
        commonValues.setCanCreateProject(response.data.can_create_project);
        commonValues.setCanCreateMainTask(response.data.can_create_main_task);
        var userID = '';
        if (response.data._id.length != 0){
            userID = response.data._id;
        }
        commonValues.setUserId(userID);
        $scope.username = response.data.username;
        var accessToken = response.data.access_token;
        commonValues.setAccessToken(accessToken);
        $location.path('/dashboard/task-list');
      }).error(function(response) {
        $scope.error = true;
        if (response) {
          if (response.errors && response.errors.length > 0) {
            var error = response.errors[0];
            $scope.mgs_error = error.message;
          }
          else {
            $scope.mgs_error = "Có lỗi xảy ra, vui lòng thử lại!";
          }
        }
        else {
          $scope.mgs_error = 'Không kết nối được tới máy chủ, vui lòng thử lại';
          //$scope.alertDanger = 'alert alert-danger';
        }
        $scope.processing = false;
      });
  };
}
