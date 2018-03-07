'use strict';
tamagoApp.factory( 'organizationService', [ '$http', '$httpParamSerializer', 'commonValues', 'URL_VALUES', 'COMMON_ACTION', function ( $http, $httpParamSerializer, commonValues, URL_VALUES, COMMON_ACTION ) {
  /**
   * [getTaskList description]
   * @param  {[type]} iMethod  [description]
   * @param  {[type]} iUrl     [description]
   * @param  {[type]} iData    [description]
   * @param  {[type]} iHeaders [description]
   * @return {[type]}          [description]
   */
  var organizations = [];
  var requestOrganizationList = function (params, callback ) {
    var request = callHttpService( COMMON_ACTION.GET_LIST, URL_VALUES.ORGANIZATIONS, params, {} );
    request.success( function ( response ) {
      organizations = response.data.organizations;
      callback( response.data.organizations );
    } ).error( function () {} );
  };
  var getOrganizationDetail = function ( Id, callback ) {
    var url = URL_VALUES.ORGANIZATIONS + '/' + Id;
    var headerRequest = {};
    var params = '';
    var request = callHttpService( COMMON_ACTION.GET_DETAIL, url, params, headerRequest );
    request.success( function ( response ) {
      callback( response.data );
    } ).error( function () {} );
  };

  var getOrganizationLists = function () {
    return organizations;
  };
  var createOrganization = function ( organizatioInfo, callback ) {
    var header = {};
    var accessToken = commonValues.getAccessToken();
    if ( accessToken ) {
      header.access_token = accessToken;
    }
    var request = $http( {
      'method': COMMON_ACTION.CREATE,
      'url': URL_VALUES.ORGANIZATIONS,
      'data': organizatioInfo,
      'headers': header
    } );
    request.success( function ( response ) {
      callback( null, response );
    } ).error( function ( err ) {
      callback( err.errors[ 0 ].message, null );
    } );
  };

  var updateOrganization = function ( iD, organizatioInfo, callback ) {
    var url = URL_VALUES.ORGANIZATIONS + '/' + iD;
    var header = {};
    var accessToken = commonValues.getAccessToken();
    if ( accessToken ) {
      header.access_token = accessToken;
    }
    var request = $http( {
      'method': COMMON_ACTION.UPDATE,
      'url': url,
      'data': organizatioInfo,
      'headers': header
    } );
    request.success( function ( response ) {
      callback(null, response );
    } ).error( function ( err ) {
      callback(err, null);
    } );
  };
  var deleteOrganization = function ( iD, callback ) {
    var url = URL_VALUES.ORGANIZATIONS + '/' + iD;
    var request = callHttpService( COMMON_ACTION.DELETE, url, '', {} );
    request.success( function ( response ) {
      callback( null, response.message );
    } ).error( function ( err ) {
      callback( err.errors[ 0 ].message );
    } );
  };

  return {
    requestOrganizationList: requestOrganizationList,
    getOrganizationLists: getOrganizationLists,
    getOrganizationDetail: getOrganizationDetail,
    createOrganization: createOrganization,
    updateOrganization: updateOrganization,
    deleteOrganization: deleteOrganization,
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
