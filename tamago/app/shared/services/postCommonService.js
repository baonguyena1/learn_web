'use strict';
tamagoApp.factory('postCommonService', ['$http' , 'commonValues', function($http, commonValues) {

  /**
   * [Common service $http using post method]
   * @param  {[string]} iMethod  [input method]
   * @param  {[string]} iUrl     [url that user connect to]
   * @param  {[json]} iData      [data send to server]
   * @param  {[json]} iHeaders   [description]
   * @return {[type]}            [result when user call to service]
   */
  var postMethod = function(iMethod, iUrl, iData, iHeaders) {
      var accessToken =  commonValues.getAccessToken();
      if (accessToken) {
        if (iHeaders) {
          iHeaders.access_token = accessToken;
        }
        else {
          iHeaders = {
            access_token: accessToken
          };
        }

      }
      return $http({
        'method': iMethod,
        'url': iUrl,
        'data': iData,
        'headers': iHeaders
      });
    };
  var uploadMethod = function(iMethod, iUrl, iData, iHeaders) {
      var accessToken =  commonValues.getAccessToken();
      if (accessToken) {
        iHeaders.access_token = accessToken;
      }
      return $http({
        'method': iMethod,
        'url': iUrl,
        'data': iData,
        'headers': iHeaders,
        'withCredentials': false,
        'transformRequest': angular.identity
      });
    };
  return {
    postMethod: postMethod,
    uploadMethod: uploadMethod
  };

}]);
