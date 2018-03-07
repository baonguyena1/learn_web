tamagoApp.controller('ItemsPopupCtroller', ItemsPopupCtroller);


ItemsPopupCtroller.$inject = ['$scope', '$rootScope', '$controller', '$uibModalInstance', 'URL_VALUES', 'selectedItems', 'multipleSelect', 'canSearch', 'title', 'popupType', 'extraData']
function ItemsPopupCtroller( $scope, $rootScope, $controller, $uibModalInstance, URL_VALUES, selectedItems, multipleSelect, canSearch, title, popupType, extraData) {
  //Inheritance from BaseLoadingController
  angular.extend(this, $controller("BaseLoadingController", {$scope: $scope}))
  //$controller("BaseLoadingController", {$scope: $scope});
  //$injector.invoke(BaseLoadingController, this, {$scope: $scope});
  var vm = this;

  $scope.title = title;
  $scope.selectedItems = angular.copy(selectedItems);
  $scope.originalSelectedItems = selectedItems;
  $scope.multipleSelect = multipleSelect;
  $scope.canSearch = canSearch;
  $scope.popupType = popupType;
  $scope.searchResult = null;
  $scope.keyword = "";

  //handle cancel action when user click on cancel button
  $scope.cancelAction = function() {
    $uibModalInstance.close();
  };

  //Handle done action when user click on done button
  $scope.doneAction = function() {
    $scope.originalSelectedItems.splice(0, $scope.originalSelectedItems.length);
    $scope.selectedItems.forEach(function(item) {
      $scope.originalSelectedItems.push(item);
    });
    $uibModalInstance.dismiss();
  };

  //Handle search action
  $scope.searchAction = function(keyword) {
    $scope.keyword = keyword;
    if ($scope.keyword === null) {
      return;
    }
    $scope.shouldLoadMore = true;
    $scope.currentIndex = 0;
    $scope.loadMoreData();
  };

  //Handle select item event
  $scope.selectItem = function(item) {

    if (!$scope.multipleSelect) {
      if ($scope.selectedItems.length > 0) {
        var currentItem = $scope.selectedItems[0];
        $scope.items.forEach(function(itemValue) {
          if (itemValue._id === currentItem._id) {
            itemValue.objectSelected = false;
          }
        });

        $scope.selectedItems.splice(0, $scope.selectedItems.length);
        if (currentItem._id !== item._id) {
          $scope.selectedItems.push(item);
          item.objectSelected = true;
        }
      }
      else {
        $scope.selectedItems.push(item);
        item.objectSelected = true;
      }
    }
    else {
      var index = $scope.selectedItems.indexOf(item._id);
      if (index < 0) {
        $scope.selectedItems.push(item._id);
        item.objectSelected = true;
      }
      else {
        $scope.selectedItems.splice(index, 1);
        item.objectSelected = false;
      }
    }
  };

  //Generate URl base on type of popup
  vm.urlForPopupType = function(type) {
    switch (type) {
      case "organization":
        $scope.url = URL_VALUES.ORGANIZATIONS;
        break;
      case "task-dependency":
        $scope.extraParameters = {
          'parent': extraData.parentId,
          'task': extraData.taskId,
          'project': extraData.projectId
        };
        $scope.url = URL_VALUES.TASKDEPENDENCIES;
        break;
      case "supervisor":
      case "assignee":
      case "assigner":
        var projectId = extraData.projectId;
        $scope.url = URL_VALUES.PROJECTS + '/' + projectId + '/members';
        break;
      case "member":
        $scope.url = URL_VALUES.USERS;
        break;
    }
  };

  /**
   * Handle success response, we can override this method in inherit classes
   */
  $scope.handleSuccessResponse = $scope.handleSuccessResponse || function(response) {
    $scope.error = false;
    if (response) {
      var items = vm.retreiveDataForType(response.data);
      if (items && items.length < $scope.defaultLimit) {
        $scope.shouldLoadMore = false;
      }
      if ($scope.currentIndex === 0) {
        $scope.items = [];
      }
      items.forEach(function(item) {
        $scope.items.push(item);
      });
      $scope.currentIndex += items.length;
      vm.processAfterHandleSuccessResponse();
    }
  };

  /**
   * Handle success response, we can override this method in inherit classes
   */
  vm.processAfterHandleSuccessResponse = function() {
    $scope.items.forEach(function(item, index) {
      if ($scope.multipleSelect) {
        var position = $scope.selectedItems.indexOf(item._id);
        if (position < 0) {
          $scope.items[index].objectSelected = false;
        }
        else {
          $scope.items[index].objectSelected = true;
        }
      }
      else {
        if ($scope.selectedItems &&
            $scope.selectedItems.length > 0 &&
            $scope.selectedItems[0]._id === item._id) {
          $scope.items[index].objectSelected = true;
        }
        else {
          $scope.items[index].objectSelected = false;
        }
      }
    });
  };

  vm.retreiveDataForType = function(data) {
    var items = null;
    if (data && typeof data === 'object') {
      switch ($scope.popupType) {
        case "organization":
          items = data.organizations;
          break;
        case "task-dependency":
          items = data.tasks;
          break;
        case "supervisor":
        case "assignee":
        case "assigner":
        case "member":
          items = data.users;
          break;
      }
    }
    return items;
  };

  vm.urlForPopupType($scope.popupType);
  $scope.loadMoreData();
}
