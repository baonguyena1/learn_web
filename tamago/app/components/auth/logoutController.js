/*
 *---------------------------------------------------------------------------
 * File Name      : logoutController.js
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
.controller('logoutController', ['$scope', '$location', '$log', 'getCommonService', 'commonValues', 'LOGOUT', 'STORAGE_KEYS', logoutController]);

/**
 * [This function will be called when user submit login form]
 * @param  {[Object]} $scope             [The application object]
 * @param  {[Service]} $location         [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Service]} commonService     [declare service]
 * @return                               [Redirect to to new page]
 */
function logoutController($scope, $location, $log, getCommonService, commonValues, LOGOUT, STORAGE_KEYS) {
  $scope.logout = function() {
    var request = getCommonService.getMethod(LOGOUT.METHOD, LOGOUT.API, LOGOUT.HEADERS);
    request.success(function(response) {
      commonValues.removeAccessToken();
      commonValues.setObject(STORAGE_KEYS.PROJECT_STAUS_KEY, null);
      commonValues.setObject(STORAGE_KEYS.TASK_STAUS_KEY, null);
      $log.debug(response);
      $location.path('/login');
    }).error(function(response) {
      commonValues.removeAccessToken();
      $log.debug(response);
    });
  };
}
