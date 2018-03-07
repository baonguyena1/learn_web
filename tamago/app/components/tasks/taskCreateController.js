'use strict';

tamagoApp
  .controller('taskCreateController', ['$rootScope', '$scope', '$log', '$uibModal', '$stateParams', '$state', '$location', '$translate', 'postCommonService', 'getTasksListService', 'TASK_CREATE', 'PROJECTS_MEMBER', 'ADD_DOCUMENT',
    'getCommonService', 'commonValues', 'TASKS_DETAIL', 'blockUI', taskCreateController
  ]);

var $ctrl = this;
$ctrl.animationsEnabled = true;
$ctrl.items = ['item1', 'item2', 'item3'];

/**
 * [convertDate description]
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
var convertDate = function(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var fullDate = year + '-' + month + '-' + day;
  return fullDate;
};

/**
 * [taskCreateController description]
 * @param  {[type]} $scope              [description]
 * @param  {[type]} $log                [description]
 * @param  {[type]} $uibModal           [description]
 * @param  {[type]} $stateParams        [description]
 * @param  {[type]} postCommonService   [description]
 * @param  {[type]} getTasksListService [description]
 * @param  {[type]} TASK_CREATE         [description]
 * @param  {[type]} PROJECTS_MEMBER     [description]
 * @return {[type]}                     [description]
 */
function taskCreateController($rootScope, $scope, $log, $uibModal, $stateParams, $state, $location, $translate, postCommonService, getTasksListService, TASK_CREATE, PROJECTS_MEMBER, ADD_DOCUMENT, getCommonService, commonValues, TASKS_DETAIL, blockUI) {

  $scope.myVal = 'hello';
  $scope.title_page = 'Tạo Tác Vụ';
  $scope.idProject = $stateParams.idProject;
  $scope.membersProject;
  $scope.selectedMember = '';
  $scope.selectAssignee = {};
  $scope.selectAssigner = {};
  $scope.selectedSupervisors = [];
  $scope.selectedAssignees = [];
  $scope.selectedAssigners = [];
  $scope.labelSupervisor = 'Người giám sát';
  $scope.labelAssignee = 'Người thực hiện';
  $scope.labelAssigner = 'Người giao việc';
  $scope.namePriority = 'Độ ưu tiên';
  $scope.iconPriority = './assets/img/icons/tre_cin.png';
  $scope.idPriority = 0;
  $scope.numberFile = 0;
  $scope.listDocuments = [];
  $scope.selected_org = [];
  $scope.selectedDependencyTasks = [];
  $scope.isCreatSubTask = false;
  $scope.processing = false;
  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  if ($stateParams.idTask) {
    $scope.isCreatSubTask = true;
    $scope.idTask = $stateParams.idTask;
    $scope.title_page = 'Tạo Tác Vụ Con';
    var taskUrl = TASKS_DETAIL.API + $scope.idTask;
    var getTaskDetail = getCommonService.getMethod(TASKS_DETAIL.METHOD, taskUrl, TASKS_DETAIL.HEADERS);
    getTaskDetail.success(function(res) {
      $scope.taskDetail = res.data;
    });
  }

  $scope.dateOptions = {
    dateDisabled: disabled,
    showWeeks: false,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };


  $scope.assigneeName = function() {
    var name = "Người thực hiện";
    if ($scope.selectedAssignees && $scope.selectedAssignees.length > 0) {
      var assignee = $scope.selectedAssignees[0];
      name = fullName(assignee);
    }
    return name;
  };

  $scope.assignerName = function() {
    var name = 'Người giao việc';
    if ($scope.selectedAssigners && $scope.selectedAssigners.length > 0) {
      var assigner = $scope.selectedAssigners[0];
      name = fullName(assigner);
    }
    return name;
  };

  $scope.priorities = [{
    name: 'Thấp',
    urlIcon: './assets/img/icons/tre_cin.png',
    id: 0
  }, {
    name: 'Bình Thường',
    urlIcon: './assets/img/icons/binhthuong_icn.png',
    id: 1
  }, {
    name: 'Cao',
    urlIcon: './assets/img/icons/cao_icn.png',
    id: 2
  }, {
    name: 'Khẩn Cấp',
    urlIcon: './assets/img/icons/khancap_icn.png',
    id: 3
  }];
  $scope.$on('event-error', function(event, args) {
    $scope.error = true;
    $scope.mgs_error = args;
  });
  $scope.prioritySelected = function(item) {
    $scope.namePriority = item.name;
    $scope.iconPriority = item.urlIcon;
    $scope.idPriority = item.id;
  };

  $scope.openMemberBox = function(type) {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/items-popup.html',
      controller: 'ItemsPopupCtroller',
      resolve: {
        title: function() {
          if (type === 'supervisor') {
            return 'Chọn người giám sát';
          }
          else if (type === 'assigner') {
            return "Chọn người giao việc";
          }
          return "Chọn người thực hiện";
        },
        popupType: function() {
          return type;
        },
        canSearch: function() {
          return true;
        },
        multipleSelect: function() {
          if (type === 'supervisor') {
            return true;
          }
          return false;
        },
        selectedItems: function() {
          if (type === 'supervisor') {
            return $scope.selectedSupervisors;
          }
          else if (type === 'assigner') {
            return $scope.selectedAssigners;
          }
          return $scope.selectedAssignees;
        },
        extraData: function() {
          return {projectId: $scope.idProject};
        }
      }
    });
  };

  $scope.openBoxOrganization = function() {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/items-popup.html',
      controller: 'ItemsPopupCtroller',
      resolve: {
        title: function() {
          return "Danh sách cơ quan";
        },
        popupType: function() {
          return "organization";
        },
        canSearch: function() {
          return true;
        },
        multipleSelect: function() {
          return true;
        },
        selectedItems: function() {
          return $scope.selected_org;
        },
        extraData: function() {
          return null;
        }
      }
    });
  };


  $scope.openBoxTaskDependency = function() {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/items-popup.html',
      controller: 'ItemsPopupCtroller',
      resolve: {
        title: function() {
          return "Công việc phụ thuộc";
        },
        popupType: function() {
          return "task-dependency";
        },
        canSearch: function() {
          return false;
        },
        multipleSelect: function() {
          return true;
        },
        selectedItems: function() {
          return $scope.selectedDependencyTasks;
        },
        extraData: function() {
          return {
            projectId: $scope.idProject,
            taskId: null,
            parentId: $scope.idTask
          };
        }
      }
    });
  };

  $scope.addDocument = function(size) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/add-document.html',
      controller: 'ModalAddDocumentCtrl',
      controllerAs: '$ctrl',
      scope: $scope,
      size: size,
      resolve: {
        items: function() {
          return $scope.idProject;
        },
        documentFor: function() {
          //1 is for task
          return 1;
        },
        documents: function() {
          return $scope.listDocuments;
        },
        method: function() {
          return '';
        },
        data: function() {
          return {};
        }
      }
    });
  };

  // $scope.$on('selected-owner', function(argv, data) {
  //   $scope.selectedSupervisor = data;
  //   if ($scope.selectedSupervisor != 'undefined') {
  //     var name = [];
  //     name.push($scope.selectedSupervisor.first_name || '');
  //     name.push($scope.selectedSupervisor.middle_name || '');
  //     name.push($scope.selectedSupervisor.last_name || '');
  //     $scope.labelSupervisor = name.join(' ');
  //   }
  // });

  // $scope.$on('selected-assign', function(argv, data) {
  //   $scope.selectedAssignee = data;
  //   if ($scope.selectedSupervisor != 'undefined') {
  //     var name = [];
  //     name.push($scope.selectedAssignee.first_name || '');
  //     name.push($scope.selectedAssignee.middle_name || '');
  //     name.push($scope.selectedAssignee.last_name || '');
  //
  //     $scope.labelAssignee = name.join(' ');
  //   }
  // });



  //$log.debug($scope.listDocuments);
  $scope.createNewTask = function() {
    var assigneeId = null;
    var assignerId = null;
    if ($scope.selectedAssignees && $scope.selectedAssignees.length > 0) {
      assigneeId = $scope.selectedAssignees[0]._id;
    }

    if ($scope.selectedAssigners && $scope.selectedAssigners.length > 0) {
      assignerId = $scope.selectedAssigners[0]._id;
    }

    $scope.start_date = convertDate(new Date($scope.plan_start_date));
    $scope.end_date = convertDate(new Date($scope.plan_end_date));

    if (!$scope.title) {
      $rootScope.$broadcast('event-error', 'Tên công việc không được để trống!');
      return;
    }

    if (!$scope.plan_start_date && !$scope.plan_end_date) {
      $rootScope.$broadcast('event-error', 'Ngày bắt đầu và ngày kết thúc không được để trống!');
      return;
    }
    if (!$scope.plan_start_date) {
      $rootScope.$broadcast('event-error', 'Ngày bắt đầu không được để trống!');
      return;
    }
    if (!$scope.plan_end_date) {
      $rootScope.$broadcast('event-error', 'Ngày kết thúc không được để trống!');
      return;
    }
    var time_start = $scope.plan_start_date.getTime();
    var time_end = $scope.plan_end_date.getTime();
    if (time_start > time_end) {
      $rootScope.$broadcast('event-error', 'Ngày kết thúc phải lớn hơn ngày bắt đầu!');
      return;
    }

    var iData = {
      'title': $scope.title,
      'project': $scope.idProject,
      'supervisors': $scope.selectedSupervisors,
      'dependencies': $scope.selectedDependencyTasks ? $scope.selectedDependencyTasks : [],
      'description': $scope.description,
      'priority': $scope.idPriority,
      'parent': $scope.idTask ? $scope.idTask : '',
      'owner': commonValues.getUserId(),
      'assignee': assigneeId,
      'assigner': assignerId,
      'organizations': $scope.selected_org,
      'plan_start_date': $scope.start_date,
      'plan_end_date': $scope.end_date
    };

    if (!$scope.processing) {
      blockUI.start("Đang xử lý ...");
      var request = postCommonService.postMethod(TASK_CREATE.METHOD, TASK_CREATE.API, iData, TASK_CREATE.HEADERS);
      request.success(function(response) {
        $scope.processing = true;
        commonValues.setData('new-task', response.data);
        if ($stateParams.idTask) {
          $state.go('dashboard.task-detail', {
            'idTask': $scope.idTask
          });
        } else {
          $state.go('dashboard.project-infomation', {
            'idProject': $scope.idProject,
            'nameTab': 'tacvu'
          });
        }
        blockUI.stop();
      }).error(function(response) {
        $scope.processing = false;
        blockUI.stop();
      });
    } else {
      return false;
    }
  };

  // Disable weekend selection
  function disabled(data) {
    // var date = data.date,
    //   mode = data.mode;
    // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
  $scope.format = $scope.formats[2];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };
  $scope.changeStartDate = function() {
    $scope.changeStartDateStyle = 'color:inherit;';
  };
  $scope.changeEndDate = function() {
    $scope.changeEndDateStyle = 'color:inherit;';
  };

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  function fullName(user) {
    var name = null;
    if (user) {
      name = user.last_name ? user.last_name : '';
      if (user.middle_name) {
        name = name + ' ' + user.middle_name;
      }
      if (user.first_name) {
        name = name + ' ' + user.first_name;
      }
    }
    else {

    }
    return name;
  }
}
