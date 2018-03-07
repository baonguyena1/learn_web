'use strict';
tamagoApp.factory( 'usersService', [ '$http', '$httpParamSerializer', 'commonValues', 'URL_VALUES', 'COMMON_ACTION', function( $http, $httpParamSerializer, commonValues, URL_VALUES, COMMON_ACTION ) {
  /**
   * [getTaskList description]
   * @param  {[type]} iMethod  [description]
   * @param  {[type]} iUrl     [description]
   * @param  {[type]} iData    [description]
   * @param  {[type]} iHeaders [description]
   * @return {[type]}          [description]
   */
  var userLists = [];
  var requestuserList = function( params, callback ) {
    var request = callHttpService( COMMON_ACTION.GET_LIST, URL_VALUES.USERS, params, {} );
    request.success( function( response ) {
      userLists = response.data.users;
      callback( response.data.users );
    } ).error( function() {} );
  };
  var getUserDetail = function( userId, callback ) {
    var url = URL_VALUES.USERS + '/' + userId;
    var headerRequest = {};
    var params = '';
    var request = callHttpService( COMMON_ACTION.GET_DETAIL, url, params, headerRequest );
    request.success( function( response ) {
      callback( response.data );
    } ).error( function() {} );
  };

  var getUserLists = function() {
    return userLists;
  };
  var createUser = function( userinfo, callback ) {
    var header = {};
    var accessToken = commonValues.getAccessToken();
    if( accessToken ) {
      header.access_token = accessToken;
    }
    var request = $http( {
      'method': COMMON_ACTION.CREATE,
      'url': URL_VALUES.USERS,
      'data': userinfo,
      'headers': header
    } );
    request.success( function( response ) {
      callback( null, response );
    } ).error( function( err ) {
      callback( err, null );
    } );
  };

  var updateUser = function( userinfo, callback ) {
    var url = URL_VALUES.USERS + '/update-profile';
    var header = {};
    var accessToken = commonValues.getAccessToken();
    if( accessToken ) {
      header.access_token = accessToken;
    }
    var request = $http( {
      'method': COMMON_ACTION.UPDATE,
      'url': url,
      'data': userinfo,
      'headers': header
    } );
    request.success( function( response ) {
      callback( null, response )
    } ).error( function( err ) {
      callback( err, null );
    } );
  };
  var deleteUser = function( userID, callback ) {
    var url = URL_VALUES.USERS + '/' + userID;
    var request = callHttpService( COMMON_ACTION.DELETE, url, '', {} );
    request.success( function( response ) {
      callback( null, response );
    } ).error( function( err ) {
      callback( err, null );
    } );
  };

  var updateUserAvatar = function( id, file, callback ) {
    var fd = new FormData();
    fd.append( 'photo', file );
    fd.append( 'user', id );
    var url = URL_VALUES.USERS + '/update-avatar';
    var accessToken = commonValues.getAccessToken();
    $http.post( url, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
          'access_token': accessToken
        }
      } )
      .success( function( response ) {
        callback( null, response )
      } )
      .error( function( err ) {
        callback( err, null );
      } );
  };
  var updateUserList = function( newUser ) {
    userLists = newUser;
  }
  return {
    requestuserList: requestuserList,
    getListUser: getUserLists,
    getUserDetail: getUserDetail,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    updateUserAvatar: updateUserAvatar,
    updateUserList : updateUserList
  };
  // Private method
  function callHttpService( method, url, param, Headers ) {
    var accessToken = commonValues.getAccessToken();
    if( accessToken ) {
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
