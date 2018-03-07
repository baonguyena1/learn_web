tamagoApp.controller("BaseLoadingController", BaseLoadingController);

BaseLoadingController.$inject = ['$scope', '$log', 'LoadDataService', 'commonValues'];

function BaseLoadingController($scope, $log, LoadDataService, commonValues) {
  var DEFAULT_LIMIT = 20;
  $scope.busy = false;
  $scope.shouldLoadMore = true;
  $scope.items = [];

  $scope.error = false;
  $scope.errorMessage = false;
  $scope.currentIndex = 0;
  $scope.defaultLimit = DEFAULT_LIMIT;
  $scope.keyword = null;
  $scope.url = null;

  $scope.loadMoreData = $scope.loadMoreData || function() {
    $scope.error = false;
    if ($scope.busy || !$scope.shouldLoadMore) {
      return;
    }

    $scope.busy = true;
    LoadDataService.loadData($scope.url, $scope.generateParams(), $scope.generateHeaders())
      .success(function(response) {
        $scope.busy = false;
        $scope.handleSuccessResponse(response);
      })
      .error(function(response) {
        $scope.busy = false;
        handleErrorResponse(response);
      });
  };

  //Generate header for a request
  $scope.generateHeaders = function() {
    return {
      "access_token" : commonValues.getAccessToken()
    };
  };

  //Generate params for request
  $scope.generateParams = function() {
    var params = $scope.defaultParams();
    if ($scope.extraParameters) {
      params = angular.merge(params, $scope.extraParameters);
    }
    return params;
  };

  //Generate params for request
  $scope.defaultParams = function() {
    return {
      keyword :$scope.keyword,
      limit : $scope.defaultLimit,
      offset : $scope.currentIndex
    };
  };

  /**
   * Handle success response, we can override this method in inherit classes
   */
  // $scope.handleSuccessResponse = $scope.handleSuccessResponse || function(response) {
  //   $scope.error = false;
  //   if (response) {
  //     var items = response.data;
  //     if (items && items.length < $scope.defaultLimit) {
  //       $scope.shouldLoadMore = false;
  //     }
  //     if ($scope.currentIndex === 0) {
  //       $scope.items = [];
  //     }
  //     angular.extend($scope.items, items.organizations);
  //     $scope.currentIndex += items.organizations.length;
  //     $scope.processAfterHandleSuccessResponse();
  //   }
  // };

  /**
   * Handle error response
   */
  var handleErrorResponse = function(response) {
    $scope.error = true;
    if (response) {
      if (response.errors && response.errors.length > 0) {
        var error = response.errors[0];
        $scope.errorMessage = error.message;
      } else {
        $scope.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';
      }
    }
    else {
      $scope.errorMessage = 'Không kết nối được tới máy chủ, vui lòng thử lại!';
    }

  };
}
