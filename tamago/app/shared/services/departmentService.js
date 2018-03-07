'use strict';
tamagoApp.factory( 'departmentService', [ '$http', '$httpParamSerializer', 'commonValues', 'URL_VALUES', 'COMMON_ACTION', function ( $http, $httpParamSerializer, commonValues, URL_VALUES, COMMON_ACTION ) {
  /**
   * [getTaskList description]
   * @param  {[type]} iMethod  [description]
   * @param  {[type]} iUrl     [description]
   * @param  {[type]} iData    [description]
   * @param  {[type]} iHeaders [description]
   * @return {[type]}          [description]
   */
  var departments = [];
  var positions = []
  var requestDepartmentServiceList = function ( callback ) {
    var request = callHttpService( COMMON_ACTION.GET_LIST, URL_VALUES.DEPARTMENTS, '', {} );
    request.success( function ( response ) {
      departments = response.data.departments;
      positions = response.data.positions;
      callback( response.data );
    } ).error( function () {} );
  };

  var getDepartmentLists = function () {
    return departments;
  };

  return {
    requestDepartmentServiceList: requestDepartmentServiceList,
    getDepartmentLists: getDepartmentLists,
  };
  // Private method
  function callHttpService( method, url, param, Headers ) {
    var accessToken = commonValues.getAccessToken();
    if ( accessToken ) {
      Headers.access_token = accessToken;
    }
    return $http( {
      'method': method,
      'url': url,
      'params': param,
      'headers': Headers
    } );
  }
} ] );
