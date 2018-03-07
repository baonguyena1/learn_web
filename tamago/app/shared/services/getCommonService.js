'use strict';
tamagoApp.factory('getCommonService', ['$http', 'commonValues', function($http, commonValues, $window) {

  /**
   * [Common service $http using post method]
   * @param  {[string]} iMethod  [input method]
   * @param  {[string]} iUrl     [url that user connect to]
   * @param  {[json]} iData      [data send to server]
   * @param  {[json]} iHeaders   [description]
   * @return {[type]}            [result when user call to service]
   */
  var getMethod = function(iMethod, iUrl, iHeaders) {
      //var accessToken =  localStorage.getItem('access_token');
      var accessToken = commonValues.getAccessToken();
      if (accessToken) {
        iHeaders.access_token = accessToken;
      }
      return $http({
        'method': iMethod,
        'url': iUrl,
        'headers': iHeaders
      });
    };
      return {
        getMethod: getMethod
      };
}]);
