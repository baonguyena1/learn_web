'use strict';
tamagoApp.factory('getTasksListService', ['$http', '$httpParamSerializer', 'commonValues', function($http, $httpParamSerializer, commonValues) {
  /**
   * [getTaskList description]
   * @param  {[type]} iMethod  [description]
   * @param  {[type]} iUrl     [description]
   * @param  {[type]} iData    [description]
   * @param  {[type]} iHeaders [description]
   * @return {[type]}          [description]
   */
  var getTasksList = function(iMethod, iUrl, iData, iHeaders) {
      var accessToken = commonValues.getAccessToken();
      if (accessToken) {
        iHeaders.access_token = accessToken;
      }
      return $http({
        'method': iMethod,
        'url': iUrl,
        'params': iData,
        'headers': iHeaders
      });
    };
  return {
    getTasksList: getTasksList
  };

}]);
