'use strict';
tamagoApp.factory('LoadDataService', ['$http', 'commonValues', function($http, commonValues) {

  /**
   * [Common service $http using post method]
   * @param  {[string]} iMethod  [input method]
   * @param  {[string]} iUrl     [url that user connect to]
   * @param  {[json]} iData      [data send to server]
   * @param  {[json]} iHeaders   [description]
   * @return {[type]}            [result when user call to service]
   */
  var loadData = function(url, params, headers) {
    var accessToken = commonValues.getAccessToken();
    if (accessToken && headers) {
      headers.access_token = accessToken;
    }
    return $http({
      'method': 'GET',
      'url': url,
      'params': params,
      'headers': headers
    });
  };

  return {
    loadData: loadData
  };
}]);
