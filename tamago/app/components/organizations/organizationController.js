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
  .controller( 'organizationCtrl', [ '$scope', 'blockUI', 'organizationService', 'URL_VALUES', '$timeout', organizationCtrl ] );

/**
 * [This function will be called when user submit login form]
 * @param  {[Object]} $scope             [The application object]
 * @param  {[Service]} $location         [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Service]} commonService     [declare service]
 * @return                               [Redirect to to new page]
 */
function organizationCtrl( $scope, blockUI, organizationService, URL_VALUES, $timeout ) {
  $scope.limit = 12;
  $scope.offset = 0;
  $scope.busy = false;
  $scope.finished = false;
  $scope.$on( '$viewContentLoaded', function() {
    $scope.busy = true;
    organizationService.requestOrganizationList( {
      limit: $scope.limit,
      offset: $scope.offset
    }, function( organizations ) {
      $scope.organizations = organizations;
      $scope.busy = false;
    } );
  } );

  $scope.viewOrgDetail = function( org ) {
    // $scope.oldganization = angular.copy( org );
    $scope.organization = angular.copy( org );
  };
  $scope.updateOrganizationInfo = function( organizationInfo ) {
    blockUI.start( {
      message: 'Đang tải dữ liệu...'
    } );
    organizationService.updateOrganization( organizationInfo._id, organizationInfo, function( err, success ) {
      if( success ) {
        $scope.message = success.message;
        $scope.organizations.forEach( function( organization ) {
          if( organization._id === organizationInfo._id ) {
            organization.name = success.data.name;
            organization.address = success.data.address;
          }
        } );
      } else {
        $scope.message = err.errors[ 0 ].message;
      }
      blockUI.stop();
      $timeout( function() {
        $scope.message = null;
      }, 1000 );
    } );
  };
  $scope.createNewOrg = function( newOrg ) {
    if( !newOrg || !newOrg.name || !newOrg.address ) {} else {
      organizationService.createOrganization( newOrg, function( err, response ) {
        if( response ) {
          $scope.message = response.message;
          $scope.organizations.unshift( response.data )
          $scope.newORG.name = null;
          $scope.newORG.address = null;
        } else {
          $scope.message = err;
        }
        $timeout( function() {
          $scope.message = null;
        }, 1000 );
      } )
    }
  }

  $scope.deleteNewOrg = function( id ) {
    organizationService.deleteOrganization( id, function( err, success ) {
      if( success ) {
        $scope.alertsMsg = {
          type: 'success',
          message: 'Xóa  cơ quan thành công!'
        };
        $scope.message = success;
        $scope.organizations.forEach( function( organization ) {
          if( organization._id == id ) {
            $scope.organization = [];
            $scope.organizations.splice( $scope.organizations.indexOf( organization ), 1 );
          }
        } );
      } else {
        $scope.message = err;
        $scope.alertsMsg = {
          type: 'danger',
          message: 'Không thể xóa cơ quan này, vui lòng kiểm tra lại!'
        };
      }
      $timeout( function() {
        $scope.message = null;
        $scope.alertsMsg = null;
      }, 1000 );
    } );
  }
  $scope.loadMoreOrgData = function() {
    if( $scope.busy || $scope.finished ) {
      return;
    } else {
      $scope.busy = true;
      organizationService.requestOrganizationList( {
        limit: $scope.limit,
        offset: $scope.offset
      }, function( data ) {
        if( data.length < $scope.limit ) {
          $scope.finished = true;
        } else {
          $scope.offset = $scope.offset + data.length - 1;
        }
        data.forEach( function( data ) {
          $scope.organizations.push( data );
        } );
        $scope.busy = false;
      } );
    }
  };

  // $scope.getListUser = function () {
  //   //blockUI.start({message: 'Đang tải dữ liệu...'});
  //   var request = getUserListService.getListUser( 'GET',
  //     '', '', {} );
  //   request.success( function ( response ) {
  //     $scope.users = response.data.users;
  //     console.log($scope.users);
  //   } ).error( function ( error ) {
  //     console.log( error );
  //   } );
  // };
}
