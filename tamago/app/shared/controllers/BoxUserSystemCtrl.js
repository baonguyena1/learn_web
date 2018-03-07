tamagoApp.controller('BoxUserSystemCtrl', BoxUserSystemCtrl);
BoxUserSystemCtrl.$inject = ['$rootScope', '$scope', '$log', 'items', 'type', 'member', 'title', 'viewer', '$uibModalInstance', 'GET_USERS', 'getTasksListService', 'Pagination']
/*handel modal user*/
function BoxUserSystemCtrl($rootScope, $scope, $log, items, type, member, title, viewer, $uibModalInstance, GET_USERS, getTasksListService, Pagination) {

  $ctrl = this;
  $ctrl.modalTitle = title;
  $ctrl.members = [];
  $ctrl.getListUser = fnGetUserlist;
  $ctrl.doSearch = fnDoSearch;
  $ctrl.keyword = '';
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.cancel = _fnClickBtnCancel;
  $ctrl.viewer = viewer;
  $ctrl.member = member;

  $ctrl.selectedUser = angular.copy(items);

  $ctrl.selectUser = fnSelectUser;
  $ctrl.iData = fnGetParam;
  /*pagination*/
  $ctrl.limit = 5;
  var pageInfo = Pagination.getNew($ctrl.limit);
  $ctrl.getListUser();

  $ctrl.pageChanged = fnPageChanged;
  $ctrl.currentPage = 0;
  ////////////////////////////////////
  function fnDoSearch() {
    $ctrl.currentPage = 0;
    $ctrl.getListUser();
  }
  function fnPageChanged() {
    pageInfo.toPageId($ctrl.currentPage);
    $ctrl.getListUser();
  }

  function fnGetParam() {
    return {
      keyword: $ctrl.keyword,
      limit: $ctrl.limit,
      offset: $ctrl.currentPage == 0 ? 0 :  (($ctrl.currentPage - 1) * $ctrl.limit)
    };
  }
  /*handel when click btn OK*/
  function _fnClickBtnCancel() {
    $ctrl.selectedUser = angular.copy($ctrl.selectedUser_old);
    $uibModalInstance.dismiss('cancel');
  };
  /*handel when click btn OK*/
  function _fnClickBtnOk() {
    $rootScope.$broadcast('select-user', $ctrl.selectedUser);
    $uibModalInstance.dismiss('cancel');
  };
  /*request*/
  function fnGetUserlist() {
    var user_service = getTasksListService.getTasksList(GET_USERS.METHOD, GET_USERS.API, $ctrl.iData(), GET_USERS.HEADERS);
    user_service.success(function(res) {
      if (!res.data) {
        return;
      }
      if (res.data.users) {
        $ctrl.members = res.data.users;
        for (var i = 0; i < $ctrl.members.length; i++) {
          var checkIndex = $ctrl.selectedUser.indexOf($ctrl.members[i]._id);
            if (checkIndex > -1) {
              $ctrl.members[i].is_selected = true;
            }
        }
        $ctrl.total_user = res.data.total;
        $ctrl.totalItems   = res.data.total;
        $ctrl.currentPage  = pageInfo.page;
        $ctrl.numPages = Math.ceil(res.data.total / pageInfo.perPage);
        $ctrl.perPage = pageInfo.perPage;
      }

    });
  }

  /*handel select user*/
  function fnSelectUser(user) {
    var index_user = $ctrl.members.indexOf(user);
    $ctrl.members[index_user].is_selected = !$ctrl.members[index_user].is_selected;

    var index = $ctrl.selectedUser.indexOf(user._id);
    if (index > -1) {
      $ctrl.selectedUser.splice(index, 1);
    }
    else {
      $ctrl.selectedUser.push(user._id);
    }
  }
}
/*directive for read file */
