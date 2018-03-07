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
  .controller( 'userCtrl', [ '$scope', 'blockUI', 'usersService', 'URL_VALUES', 'departmentService', '$timeout', '$http', userCtrl ] );

/**
 * [This function will be called when user submit login form]
 * @param  {[Object]} $scope             [The application object]
 * @param  {[Service]} $location         [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Service]} commonService     [declare service]
 * @return                               [Redirect to to new page]
 */
function userCtrl( $scope, blockUI, usersService, URL_VALUES, departmentService, $timeout, $http ) {
  $scope.limit = 12;
  $scope.offset = 0;
  $scope.busy = false;
  $scope.finished = false;
  $scope.userGender = [ {
      name: 'Nam',
      value: 1
    },
    {
      name: 'Nữ',
      value: 2
    },
  ]
  $scope.$on( '$viewContentLoaded', function() {
    if( usersService.getListUser().length > 0 ) {
      $scope.users = usersService.getListUser();
    } else {
      blockUI.start( {
        message: "Đang xử lý ..."
      } );
      $scope.busy = true;
      usersService.requestuserList( {
        limit: $scope.limit,
        offset: $scope.offset
      }, function( users ) {
        if( users.length < $scope.limit ) {
          $scope.finished = true;
        } else {
          $scope.offset = $scope.offset + users.length - 1;
        }
        $scope.users = users;
        $scope.busy = false;
        blockUI.stop();
      } );
    }

    departmentService.requestDepartmentServiceList( function( data ) {
      $scope.departments = data.departments;
      $scope.positions = data.positions;
    } );
  } );
  $scope.viewUserDetail = function( userViewed ) {
    blockUI.start( {
      message: "Đang xử lý ..."
    } );
    usersService.getUserDetail( userViewed._id, function( userinfo ) {
      $scope.indexOfView = $scope.users.indexOf( userViewed );
      $scope.userData = userinfo;
      if( userViewed.avatar === null || userViewed.avatar === undefined ) {
        $scope.userData.avatar = './assets/img/icons/default_avatar.png';
      }
      if( $scope.userData.dob ) {
        $scope.userData.dob = new Date( userinfo.dob );
      } else {
        //$scope.userData.dob = new Date();
      }
      $scope.userData.full_name = '';
      if( userinfo.last_name ) {
        $scope.userData.full_name = userinfo.last_name;
      }
      if( userinfo.middle_name ) {
        $scope.userData.full_name = $scope.userData.full_name + ' ' + userinfo.middle_name;
      }
      if( userinfo.first_name ) {
        $scope.userData.full_name = $scope.userData.full_name + ' ' + userinfo.first_name;
      }
      $scope.oldUserInfo = angular.copy( userinfo );
      blockUI.stop();
    } );
  };
  $scope.removeUser = function( userRemove ) {
    var indexOfRemove = $scope.getIndexOfObject( userRemove._id );
    blockUI.start( {
      message: "Đang xử lý ..."
    } );
    usersService.deleteUser( userRemove._id, function( err, success ) {
      if( success ) {
        $scope.alertsMsg = {
          type: 'success',
          message: 'Xóa người dùng thành công!'
        };
        $scope.message = success.message;
        $scope.userData = [];
        $scope.users.splice( indexOfRemove, 1 );
        $scope.UpdateUserListFromService();
      } else {
        $scope.alertsMsg = {
          type: 'danger',
          message: 'Không thể xóa người dùng, vui lòng kiểm tra lại!'
        };
      }
      blockUI.stop();
      $timeout( function() {
        $scope.message = null;
        $scope.alertsMsg = null;
      }, 2000 );
    } );
  };

  $scope.updateUser = function( userNewInfo ) {
    blockUI.start( {
      message: "Đang xử lý ..."
    } );
    var updateUser = {};
    var oldUser = $scope.oldUserInfo;
    if( userNewInfo._id === oldUser._id ) {
      if( userNewInfo.full_name !== oldUser.full_name ) {
        updateUser.last_name = userNewInfo.full_name.split( ' ' ).slice( 0, 1 ).join( ' ' );
        updateUser.first_name = userNewInfo.full_name.split( ' ' ).slice( -1 ).join( ' ' );
        var middle_name = userNewInfo.full_name.replace( updateUser.first_name, '' ).replace( updateUser.last_name, '' );
        if( /\S/.test( middle_name ) ) {
          updateUser.middle_name = middle_name;
        }
      }
      if( userNewInfo.address !== oldUser.address ) {
        updateUser.address = userNewInfo.address;
      }
      if( userNewInfo.dob && userNewInfo.dob !== oldUser.dob ) {
        updateUser.dob = new Date( userNewInfo.dob );
      }
      if( userNewInfo.gender !== undefined && Number( userNewInfo.gender.value ) !== Number( oldUser.gender ) ) {
        updateUser.gender = Number( userNewInfo.gender.value );
      }
      if( userNewInfo.phone !== oldUser.phone ) {
        updateUser.phone = userNewInfo.phone;
      }
      if( userNewInfo.department && userNewInfo.department._id ) {
        if( !oldUser.department || userNewInfo.department._id !== oldUser.department._id ) {
          updateUser.department = userNewInfo.department._id;
        }
      }
      if( userNewInfo.position && userNewInfo.position._id ) {
        if( !oldUser.position || userNewInfo.position._id !== oldUser.position._id ) {
          updateUser.position = userNewInfo.position._id;
        }
      }
      updateUser.user = userNewInfo._id;

      usersService.updateUser( updateUser, function( err, success ) {
        if( success ) {
          var indexUpdated = $scope.getIndexOfObject( updateUser.user );
          $scope.users[ indexUpdated ] = success.data;
          $scope.UpdateUserListFromService();
          $scope.message = success.message;
        } else {
          $scope.message = err.errors[ 0 ].message;
        }
        blockUI.stop();
        $timeout( function() {
          $scope.message = null;
        }, 1000 );
      } );
    }
  };

  $scope.resetUserInfoUpdate = function() {
    $scope.userData = {};
  };
  $scope.resetUserNewUser = function() {
    //$scope.newUser = {};
  }
  $scope.createUser = function( newUser ) {
    if( newUser && newUser.email ) {
      if( newUser.full_name ) {
        newUser.last_name = newUser.full_name.split( ' ' ).slice( 0, 1 ).join( ' ' );
        newUser.first_name = newUser.full_name.split( ' ' ).slice( -1 ).join( ' ' );
        var middle_name = newUser.full_name.replace( newUser.first_name, '' ).replace( newUser.last_name, '' );
        if( /\S/.test( middle_name ) ) {
          newUser.middle_name = middle_name;
        }
      }
      if( newUser.dob ) {
        newUser.dob = new Date( newUser.dob );
      }
      if( newUser.gender !== undefined ) {
        newUser.gender = Number( newUser.gender.value );
      }
      if( newUser.department ) {
        newUser.department = newUser.department._id;
      }
      if( newUser.position ) {
        newUser.position = newUser.position._id;
      }
      blockUI.start( {
        message: "Đang xử lý ..."
      } );
      usersService.createUser( newUser, function( err, success ) {
        if( success ) {
          if( $scope.userAvatar ) {
            updateUserAvatar( success.data._id, function( err, response ) {
              $scope.users.unshift( response.data );
              $scope.message = response.message;
              blockUI.stop();
            } );
          } else {
            $scope.users.unshift( success.data );
            $scope.message = success.message;
            $scope.UpdateUserListFromService();
            blockUI.stop();
          }
          $scope.newUser = {};

        } else {
          $scope.message = err.errors[ 0 ].message;
          blockUI.stop();
        }
        $timeout( function() {
          $scope.message = null;
        }, 1000 );
      } );
    }

  };


  $scope.loadMoreUserData = function() {
    if( $scope.busy || $scope.finished ) {
      return;
    } else {
      $scope.busy = true;
      usersService.requestuserList( {
        limit: $scope.limit,
        offset: $scope.offset
      }, function( data ) {
        if( data.length < $scope.limit ) {
          $scope.finished = true;
        } else {
          $scope.offset = $scope.offset + data.length - 1;
        }
        data.forEach( function( data ) {
          $scope.users.push( data );
        } );
        $scope.UpdateUserListFromService();
        $scope.busy = false;
      } );
    }
  };
  $scope.UpdateUserListFromService = function() {
    usersService.updateUserList( $scope.users );
  };

  $scope.getIndexOfObject = function( id ) {
    for( var i = 0; i < $scope.users.length; i += 1 ) {
      if( $scope.users[ i ]._id === id ) {
        return i;
      }
    }
    return -1;

  }

  //Generate params for request
  // $scope.generateParams = function() {
  //   var params = $scope.defaultParams();
  //   if( $scope.extraParameters ) {
  //     params = angular.merge( params, $scope.extraParameters );
  //   }
  //   return params;
  // };

  //Generate params for request
  // $scope.defaultParams = function() {
  //   return {
  //
  //   };
  // };

  function updateUserAvatar( Id, callback ) {
    var file = $scope.userAvatar;
    usersService.updateUserAvatar( Id, file, callback );
  }
}


tamagoApp.directive( "userinfo", function() {
  return {
    scope: {},
    template: '<input ng-click="active = $id" ng-class="{active: $id === active, someclass: $id !== active }">',
    replace: true,
    transclude: true,
    link: function( scope, elem, attrs ) {}
  };
} );

tamagoApp.directive( 'fileModel', [ '$parse', function( $parse ) {
  return {
    restrict: 'A',
    link: function( scope, element, attrs ) {
      var model = $parse( attrs.fileModel );
      var modelSetter = model.assign;
      element.bind( 'change', function() {
        scope.$apply( function() {
          modelSetter( scope, element[ 0 ].files[ 0 ] );
        } );
      } );
    }
  };
} ] );

//
// tamagoApp.factory( 'Reddit', function($http, URL_VALUES) {
//   var Reddit = function() {
//     this.items = [];
//     this.busy = false;
//     this.after = '';
//   };
//
//   Reddit.prototype.nextPage = function() {
//     if( this.busy ) return;
//     this.busy = true;
//     var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
//     $http.jsonp( url ).success( function( data ) {
//       var items = data.data.children;
//       console.log(items);
//       for( var i = 0; i < items.length; i++ ) {
//         this.items.push( items[ i ].data );
//       }
//       this.after = "t3_" + this.items[ this.items.length - 1 ].id;
//       this.busy = false;
//     }.bind( this ) );
//   };
//
//   return Reddit;
// } );
