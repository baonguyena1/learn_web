
tamagoApp.controller('BoxMainTasksCtrl', BoxMainTasksCtrl);

BoxMainTasksCtrl.$inject = ['$rootScope', '$scope', '$log', 'items', 'mainTasks', 'type', 'title', 'viewer', 'member', '$uibModalInstance', 'GET_TASK_TEMPLATES', 'getTasksListService', 'Pagination', 'blockUI']

/*handel modal main task*/
function BoxMainTasksCtrl($rootScope, $scope, $log, items, mainTasks, type, title, viewer, member, $uibModalInstance, GET_TASK_TEMPLATES, getTasksListService, Pagination, blockUI) {

  $ctrl = this;
  $ctrl.modalTitle = title;
  $ctrl.membersProject = [];
  $ctrl.getTaskTemplates = fnGetTaskTemplates;
  $ctrl.doSearch = fnDoSearch;
  $ctrl.keyword = '';
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.cancel = _fnClickBtnCancel;
  $ctrl.viewer = viewer;
  $ctrl.member = member;
  $ctrl.mainTasks = mainTasks;

  $ctrl.selectedTask = angular.copy(items);
  $ctrl.taskTemplates = [];
  $ctrl.selectedTask_old = angular.copy( $ctrl.selectedTask);
  $ctrl.isSelected = fnIsSelected;
  $ctrl.selectTask = fnSelectTasks;
  $ctrl.iData = fnGetParam;
  /*pagination*/
  $ctrl.limit = 5;
  var pageInfo = Pagination.getNew($ctrl.limit);
  $ctrl.getTaskTemplates();
  $ctrl.pageChanged = fnPageChanged;
  $ctrl.currentPage = 0;

  $ctrl.showUser = function(u) {

    $ctrl.check = true;
    //case compare member
    if (type === 'viewer') {
      $.each($ctrl.member, function(k, v) {
        if (v === u._id) {
          $ctrl.check = false;
          return;
        }
      });
    }else {
      $.each($ctrl.viewer, function(k, v) {
        if (v === u._id) {
          $ctrl.check = false;
          return;
        }
      });
    }
    return $ctrl.check;
  };

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
      offset: $ctrl.currentPage == 0 ? 1 :  (($ctrl.currentPage - 1) * $ctrl.limit)
    };
  }
  /*handel when click btn OK*/
  function _fnClickBtnCancel() {
    $ctrl.selectedTask = angular.copy($ctrl.selectedTask_old);
    $uibModalInstance.dismiss('cancel');
  }

  /*handel when click btn OK*/
  function _fnClickBtnOk() {
    // insert  taskTemplates has true into selectedTask
    $ctrl.selectedTask = [];
    $ctrl.myTaskTemplates = [];
    for (var i = $ctrl.taskTemplates.length - 1; i >= 0; i--) {
      if ($ctrl.taskTemplates[i].is_selected === false) {
        $ctrl.taskTemplates.splice(i, 1);
      }
      else {
        $ctrl.selectedTask.push($ctrl.taskTemplates[i]._id);
        var children = $ctrl.taskTemplates[i].children;
        if (children) {
          for (var j = children.length - 1; j >= 0; j--) {
            if (children[j].is_selected === false) {
              children.splice(j, 1);
            }
            else {
              $ctrl.selectedTask.push(children[j]._id);
            }
          }
        }
      }
    }

    $rootScope.$broadcast('select-task', $ctrl.selectedTask);
    $rootScope.$broadcast('list-main-task', $ctrl.taskTemplates);
    $uibModalInstance.dismiss('cancel');
  }
  /*request*/
  function fnGetTaskTemplates() {
    blockUI.start({message: 'Đang tải dữ liệu...'});
    var user_service = getTasksListService.getTasksList(GET_TASK_TEMPLATES.METHOD, GET_TASK_TEMPLATES.API, $ctrl.iData(), GET_TASK_TEMPLATES.HEADERS);
    user_service.success(function(res) {
      if (!res.data) {
        return;
      }
      if (res.data.templates) {
        $ctrl.taskTemplates = res.data.templates;
        $ctrl.taskTemplates.isCollapsed = false;

        for (var index = 0; index < $ctrl.taskTemplates.length; index ++) {
          if ($ctrl.selectedTask) {
            //If a task is in selected task list, set is_selected = true
            var taskIndex = $ctrl.selectedTask.indexOf($ctrl.taskTemplates[index]._id);
            if ( taskIndex >= 0) {
              $ctrl.taskTemplates[index].is_selected = true;
              var childrenTemplate = $ctrl.taskTemplates[index].children;

              if (childrenTemplate) {
                for (var i = 0; i < childrenTemplate.length; i ++) {
                  childrenTemplateTask = childrenTemplate[i];
                  if ($ctrl.selectedTask.indexOf(childrenTemplateTask._id) >= 0) {
                    childrenTemplate[i].is_selected = true;
                  }
                  else {
                    childrenTemplate[i].is_selected = false;
                  }
                }
              }
            }
            else {
              $ctrl.taskTemplates[index].is_selected = false;
            }
          }
          else {
            $ctrl.taskTemplates[index].is_selected = true;
            var childrenTemplate = $ctrl.taskTemplates[index].children;
            for (var i = 0; i < childrenTemplate.length; i ++) {
              childrenTemplate[i].is_selected = true;
            }
          }
        }

        $ctrl.totalItems   = res.data.total;
        $ctrl.currentPage  = pageInfo.page;
        $ctrl.numPages = Math.ceil(res.data.total / pageInfo.perPage);
        $ctrl.perPage = pageInfo.perPage;
      }
      blockUI.stop();
    });
  }

  /*handel select user*/
  function fnSelectTasks(task, childrenTask, type) {
    var index_p = $ctrl.taskTemplates.indexOf(task);
    if (type === 'parent') {
      $ctrl.taskTemplates[index_p].is_selected = !$ctrl.taskTemplates[index_p].is_selected;
      for (var i = $ctrl.taskTemplates[index_p].children.length - 1; i >= 0; i--) {
        $ctrl.taskTemplates[index_p].children[i].is_selected = $ctrl.taskTemplates[index_p].is_selected;
      }
    } else {
      var index_c = $ctrl.taskTemplates[index_p].children.indexOf(childrenTask);
      $ctrl.taskTemplates[index_p].children[index_c].is_selected = !$ctrl.taskTemplates[index_p].children[index_c].is_selected;
      var flag = $ctrl.taskTemplates[index_p].is_selected;
      for (var i = $ctrl.taskTemplates[index_p].children.length - 1; i >= 0; i--) {
        if ($ctrl.taskTemplates[index_p].children[i].is_selected) {
          flag = true;
          break;
        }
      }
      $ctrl.taskTemplates[index_p].is_selected = flag;
    }

  }
  /*is selected users*/
  function fnIsSelected(task) {
    if (!task) return false;
    var index = $ctrl.selectedTask.indexOf(task._id);
    if (index > -1) {
      return true;
    }
    return false;
  }
}
/*directive for read file */
/*add more protype for Date*/
Date.prototype.yyyymmdd = function() {
  var mm = (this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)  ; // getMonth() is zero-based
  var dd = this.getDate() < 10 ? '0' + this.getDate() : this.getDate();

  return [this.getFullYear(), mm , dd].join('-'); // padding
};

function isNumeric(n) {
  var pa = parseInt(n);
  if (pa < 0) return false;
  return !isNaN(pa) && isFinite(n);
}
