'use strict';

tamagoApp
  .controller('taskEditController', ['$rootScope', '$scope', '$log', '$uibModal', '$stateParams', '$state', '$location', 'postCommonService', 'getTasksListService', 'TASK_EDIT', 'PROJECTS_MEMBER', 'ADD_DOCUMENT',
    'getCommonService', 'commonValues', 'blockUI', 'TASKS_DETAIL', 'DEPENDENCY_TASK', taskEditController
  ])


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
 * @param  {[type]} TASK_EDIT         [description]
 * @param  {[type]} PROJECTS_MEMBER     [description]
 * @return {[type]}                     [description]
 */
function taskEditController($rootScope, $scope, $log, $uibModal, $stateParams, $state, $location, postCommonService, getTasksListService, TASK_EDIT, PROJECTS_MEMBER, ADD_DOCUMENT, getCommonService, commonValues, blockUI, TASKS_DETAIL, DEPENDENCY_TASK) {

  $scope.myVal = 'hello';
  $scope.title_page = 'Tạo Tác Vụ';
  $scope.idProject = $stateParams.idProject;
  $scope.membersProject;
  $scope.selectedMember = '';
  $scope.selectAssignee = '';
  $scope.selectAssigner = '';
  $scope.selectedSupervisors = [];
  $scope.selectedAssignees = [];
  $scope.selectedAssigners = [];
  $scope.name_supervisor = 'Chọn người giám sát';
  $scope.name_assigner = 'Chọn người thực hiện';
  $scope.namePriority = 'Độ ưu tiên';
  $scope.iconPriority = './assets/img/icons/tre_cin.png';
  $scope.idPriority = 0;
  $scope.numberFile = 0;
  $scope.listDocuments = [];
  $scope.selected_org = [];
  $scope.selectedDependencyTasks = [];
  $scope.isCreatSubTask = false;
  $scope.comments = '';
  $scope.taskId = '';
  $scope.status = false;
  $scope.taskUrl = TASKS_DETAIL.API + $stateParams.idTask;
  _fnGetTaskDetail();


  /**
   * [inlineOptions description]
   * @type {Object}
   */
  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };
  /**
   * [if description]
   * @param  {[type]} $stateParams.idTask [description]
   * @return {[type]}                     [description]
   */
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
  /**
   * [dateOptions description]
   * @type {Object}
   */
  $scope.dateOptions = {
    dateDisabled: disabled,
    showWeeks: false,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };
  /**
   * [priorities description]
   * @type {Array}
   */
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
  /**
   * [_fnGetFullName description]
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  function _fnGetFullName(user) {
    var first_name = user.first_name ? user.first_name : '';
    var middle_name = user.middle_name ? user.middle_name : '';
    var last_name = user.last_name ? user.last_name : '';
    var full_name = first_name + ' ' + middle_name + ' ' + last_name;
    return full_name;
  }

  /**
   * Get assignee name
   */
  $scope.assigneeName = function() {
    var name = 'Người thực hiện';
    if ($scope.selectedAssignees && $scope.selectedAssignees.length > 0) {
      var assignee = $scope.selectedAssignees[0];
      name = assignee.last_name ? assignee.last_name : '';
      if (assignee.middle_name) {
        name = name + ' ' + assignee.middle_name;
      }
      if (assignee.first_name) {
        name = name + ' ' + assignee.first_name;
      }
    }
    return name;
  };

  $scope.assignerName = function() {
    var name = 'Người giao việc';
    if ($scope.selectedAssigners && $scope.selectedAssigners.length > 0) {
      var assigner = $scope.selectedAssigners[0];
      name = assigner.last_name ? assigner.last_name : '';
      if (assigner.middle_name) {
        name = name + ' ' + assigner.middle_name;
      }
      if (assigner.first_name) {
        name = name + ' ' + assigner.first_name;
      }
    }
    return name;
  };

  $scope.openBoxOrganization = function() {
    var modalInstance = $uibModal.open({
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


  /**
   * Open task dependency popup
   */
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
            taskId: $scope.taskId,
            parentId: $scope.taskDetail.parent
          };
        }
      }
    });
  };


  /**
   * Open member box to select member as supervisor or assignee
   */
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
            return 'Người giám sát';
          }
          else if (type === 'assigner') {
            return "Chọn người giao việc";
          }
          return "Người thực hiện";
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
          return {
            projectId: $scope.idProject
          };
        }
      }
    });
  };

  function fnGetParamsDependency() {
    return {
      //task: taskId
    };
  }

  function _fnGetDependenciesTasks(taskId) {
    var getDependencyOfTasksUrl = DEPENDENCY_TASK.API + 'tasks/' + taskId + '/dependencies';
    var getDependencyOfTasks = getTasksListService.getTasksList(DEPENDENCY_TASK.METHOD,
      getDependencyOfTasksUrl, fnGetParamsDependency(), DEPENDENCY_TASK.HEADERS);
    getDependencyOfTasks.success(function(res) {
      $scope.dependencies_task = res.data.tasks;
      if ($scope.dependencies_task) {
        $.each($scope.dependencies_task, function(k, task) {
          $scope.selectedDependencyTasks.push(task._id);
        });
      }
    }).error(function(response) {
      $log.debug("response");
    });
  }

  /**
   * [_fnGetTaskDetail description]
   * @return {[type]} [description]
   */
  function _fnGetTaskDetail() {
    blockUI.start("Đang xử lý ...");
    var request = getCommonService.getMethod(TASKS_DETAIL.METHOD, $scope.taskUrl, TASKS_DETAIL.HEADERS);
    request.success(function(response) {
      $scope.isChangedMasterData = isChangedMasterData;
      $scope.task = response.data;
      $scope.orginData = response.data;
      $scope.idProject = $scope.task.project._id;
      $log.debug($scope.task.dependency_num);
      $scope.dependency_num = $scope.task.dependency_num;
      $scope.taskId = $scope.task._id;
      if ($scope.dependency_num) {
        _fnGetDependenciesTasks($scope.taskId);
      }

      //$scope.selected_org = $scope.orginData.organizations;
      if ($scope.orginData.organizations) {
        $scope.orginData.organizations.forEach(function(organ) {
          $scope.selected_org.push(organ._id);
        });
      }

      // var document_url = $scope.taskUrl + '/documents';
      // var getDocument = getCommonService.getMethod(TASKS_DETAIL.METHOD, document_url, TASKS_DETAIL.HEADERS);
      // getDocument.success(function(res_document){

      $scope.baseData = angular.copy($scope.task);
      $scope.baseData = {
        'title': $scope.baseData.title,
        'project': $scope.baseData.project._id,
        'owner': $scope.baseData.owner._id,
        'supervisor': $scope.baseData.supervisor ? $scope.baseData.supervisor._id : '',
        'dependencies': $scope.selectedDependencyTasks,
        'description': $scope.baseData.description,
        'priority': $scope.baseData.priority,
        'organizations': $scope.baseData.organizations,
        'parent': $scope.idTask ? $scope.idTask : '',
        'plan_start_date': new Date($scope.baseData.plan_start_date),
        'plan_end_date': new Date($scope.baseData.plan_end_date),
      };
      //$scope.name_assigner = _fnGetFullName($scope.task.assigner);
      $scope.id_assigner = $scope.task.assigner ? $scope.task.assigner._id : '';
      //$scope.name_supervisor = $scope.task.supervisor?_fnGetFullName($scope.task.supervisor):'Người theo dõi';
      $scope.id_supervisor = $scope.task.supervisor ? $scope.task.supervisor._id : '';
      $scope.task.plan_start_date = $scope.task.plan_start_date ? new Date($scope.task.plan_start_date) : '';
      $scope.task.plan_end_date = $scope.task.plan_end_date ? new Date($scope.task.plan_end_date) : '';

      $scope.task = {
        'title': $scope.task.title,
        'project': $scope.task.project._id,
        'owner': $scope.task.owner._id,
        'supervisor': $scope.task.supervisor ? $scope.task.supervisor._id : '',
        'dependencies': $scope.selectedDependencyTasks,
        'description': $scope.task.description,
        'priority': $scope.task.priority,
        'parent': $scope.idTask ? $scope.idTask : '',
        'plan_start_date': new Date($scope.task.plan_start_date),
        'plan_end_date': new Date($scope.task.plan_end_date)
      };

      setMasterData($scope.baseData);

      if (response.data.owner) {
        $scope.selectedAssignees = [response.data.owner];
      }

      if (response.data.assigner) {
        $scope.selectedAssigners = [response.data.assigner];
      }

      $scope.id_assigner = response.data.owner ? response.data.owner._id : '';
      if (response.data.supervisors) {
        response.data.supervisors.forEach(function(supervisor) {
          $scope.selectedSupervisors.push(supervisor._id);
        });
      }

      $scope.id_supervisor = response.data.supervisor ? response.data.supervisor._id : '';
      $scope.task.plan_start_date = response.data.plan_start_date ? new Date(response.data.plan_start_date) : '';
      $scope.task.plan_end_date = response.data.plan_end_date ? new Date(response.data.plan_end_date) : '';
      $scope.idProject = response.data.project._id;

      switch ($scope.task.priority) {
        case 0:
          $scope.iconPriority = './assets/img/icons/tre_cin.png';
          $scope.namePriority = 'Trễ';
          break;
        case 1:
          $scope.iconPriority = './assets/img/icons/binhthuong_icn.png';
          $scope.namePriority = 'Bình Thường';
          break;
        case 2:
          $scope.iconPriority = './assets/img/icons/cao_icn.png';
          $scope.namePriority = 'Cao';
          break;
        case 3:
          $scope.iconPriority = './assets/img/icons/khancap_icn.png';
          $scope.namePriority = 'Khẩn Cấp';
          break;
        default:
          $scope.iconPriority = './assets/img/icons/tre_cin.png';
          $scope.namePriority = 'Độ Ưu Tiên';
      }
      $scope.name_task;
      blockUI.stop();
    }).error(function(response) {
      blockUI.stop();
    });
  }
  /**
   * [prioritySelected description]
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  $scope.prioritySelected = function(item) {
    $scope.namePriority = item.name;
    $scope.iconPriority = item.urlIcon;
    $scope.idPriority = item.id;
    $scope.task.priority = item.id;
  };



  /**
   * [addDocument description]
   * @param {[type]} size [description]
   */
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
        idTask: function() {
          return '';
        },
        listDocuments: function() {
          return $scope.listDocuments;
        },
        method: function() {
          return ''
        },
        data: function() {
          return {};
        }
      }
    });
  };
  /**
   * [description]
   * @param  {[type]} argv  [description]
   * @param  {[type]} data) {               $scope.selectedSupervisor [description]
   * @return {[type]}       [description]
   */
  // $scope.$on('selected-owner', function(argv, data) {
  //   $scope.selectedSupervisor = data;
  //   if ($scope.selectedSupervisor != 'undefined') {
  //     var name = [];
  //     name.push($scope.selectedSupervisor.last_name || '');
  //     name.push($scope.selectedSupervisor.middle_name || '');
  //     name.push($scope.selectedSupervisor.first_name || '');
  //     $scope.name_supervisor = name.join(' ');
  //     $scope.task.supervisor = $scope.selectedSupervisor._id;
  //   }
  // });
  /**
   * [description]
   * @param  {[type]} argv  [description]
   * @param  {[type]} data) {               $scope.selectedAssignee [description]
   * @return {[type]}       [description]
   */
  // $scope.$on('selected-assign', function(argv, data) {
  //   //$log.debug('name assignee: ' + $scope.name_assigner);
  //   $scope.selectedAssignee = data;
  //   if ($scope.selectedAssignee != 'undefined') {
  //     var name = [];
  //     name.push($scope.selectedAssignee.first_name || '');
  //     name.push($scope.selectedAssignee.middle_name || '');
  //     name.push($scope.selectedAssignee.last_name || '');
  //
  //     $scope.name_assigner = name.join(' ');
  //     $scope.task.owner = $scope.assigneeId = $scope.selectedAssignee._id;
  //
  //   }
  // });

  /**
   * [description]
   * @param  {[type]} argv    [description]
   * @param  {[type]} data){               } [description]
   * @return {[type]}         [description]
   */
  $scope.$on('get-comments', function(argv, data) {
    $scope.comments = data;
  });
  /**
   * [description]
   * @param  {[type]} argv  [description]
   * @param  {[type]} data) {               $scope.listDocuments.push(data);    $scope.numberFile [description]
   * @return {[type]}       [description]
   */
  $scope.$on('list-file', function(argv, data) {
    $scope.listDocuments.push(data);
    $scope.numberFile += $scope.listDocuments.length;
    //$scope.task.attack = $scope.numberFile;
    //list-file
  });
  /**
   * [_fnOpenModalChange description]
   * @return {[type]} [description]
   */
  function _fnOpenModalChange(iData) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'modalConfirmChange.html',
      controller: 'BoxResonChange',
      controllerAs: '$ctrl',
      resolve: {
        projectId: function() {
          return $scope.idProject;
        },
        selectedMember: function() {
          return $scope.selectedMember;
        },
        type: function() {
          return 'supervisor';
        },
        data: function() {
          return iData;
        },
        idTask: function() {
          return $stateParams.idTask;
        },
        listDocuments: function() {
          return $scope.listDocuments;
        }
      }
    });
  };

  function _fnBuildUpdateData() {
    var assigneeId = null;
    if ($scope.selectedAssignees && $scope.selectedAssignees.length > 0) {
      assigneeId = $scope.selectedAssignees[0]._id;
    }

    var assignerId = null;
    if ($scope.selectedAssigners && $scope.selectedAssigners.length > 0) {
      assignerId = $scope.selectedAssigners[0]._id;
    }

    //$log.debug('assignee id: ');
    //$log.debug($scope.selectedAssignee);
    var iData = {
      'title': $scope.task.title || '',
      'project': $scope.idProject,
      'supervisors': $scope.selectedSupervisors,
      'dependencies': $scope.selectedDependencyTasks,
      'description': $scope.task.description,
      'priority': $scope.idPriority,
      'parent': $scope.idTask ? $scope.idTask : '',
      'plan_start_date': $scope.task.plan_start_date,
      'plan_end_date': $scope.task.plan_end_date,
      'owner': assigneeId,
      'assigner': assignerId,
      'organizations': $scope.selected_org
    };
    $log.debug("iData Edit Task: ");
    $log.debug(iData);
    return iData;
  }

  $scope.editTask = function() {

      if (!$scope.task.title) {
        $rootScope.$broadcast('event-error', 'Tên công việc không được để trống!');
        return;
      }
      if (!$scope.task.plan_start_date && !$scope.task.plan_end_date) {
        $rootScope.$broadcast('event-error', 'Ngày bắt đầu và ngày kết thúc không được để trống!');
        return;
      }
      if (!$scope.task.plan_start_date) {
        $rootScope.$broadcast('event-error', 'Ngày bắt đầu không được để trống!');
        return;
      }
      if (!$scope.task.plan_end_date) {
        $rootScope.$broadcast('event-error', 'Ngày kết thúc không được để trống!');
        return;
      }

      var time_start = $scope.task.plan_start_date.getTime();
      var time_end = $scope.task.plan_end_date.getTime();
      if (time_start > time_end) {
        $rootScope.$broadcast('event-error', 'Ngày kết thúc phải lớn hơn ngày bắt đầu!');
        return;
      }

      var data = _fnBuildUpdateData();

      var editURL = TASK_EDIT.API + $scope.taskId;
      if (angular.equals($scope.task.plan_end_date, $scope.baseData.plan_end_date)) {
        data.plan_end_date = null;
        var request = postCommonService.postMethod(TASK_EDIT.METHOD, editURL, data, TASK_EDIT.HEADERS);
        request.success(function(response) {
          /* Add documents to the server */
          var type = 1;
          var iUrl = ADD_DOCUMENT.API + '?object_type=' + type + '&object_id=' + $scope.taskId;
          for (var i = 0; i < $scope.listDocuments.length; i++) {
            var iData = {
              issuer: $scope.listDocuments[i].issuer,
              description: $scope.listDocuments[i].description,
              document_number: $scope.listDocuments[i].document_number,
              type: $scope.listDocuments[i].type
            };
            var postService = postCommonService.postMethod(ADD_DOCUMENT.METHOD, iUrl, iData, ADD_DOCUMENT.HEADERS);
            postService.success(function(response) {}).error(function(response) {
              $log.debug(response);
            });
          }
          $state.go('dashboard.task-detail', {
            idTask: $scope.taskId
          });
        }).error(function(response) {
          $log.debug(response);
        });
      } else {
        _fnOpenModalChange(data);
      }

      //_fnOpenModalChange(data);
    }
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
  /**/
  function setMasterData(value) {
    $scope.master_data = angular.copy(value);
  }
  /**/
  function isChangedMasterData() {
    if (!$scope.task.title) {
      return true;
    }
    return angular.equals($scope.task, $scope.master_data);
  }
};
tamagoApp.controller('BoxResonChange', BoxResonChange);
/**
 * [ModalInstanceCtrl description]
 * @param {[type]} $scope              [description]
 * @param {[type]} $rootScope          [description]
 * @param {[type]} $log                [description]
 * @param {[type]} $uibModalInstance   [description]
 * @param {[type]} postCommonService   [description]
 * @param {[type]} ADD_DOCUMENT        [description]
 * @param {[type]} projectId           [description]
 * @param {[type]} selectedMember      [description]
 * @param {[type]} type                [description]
 * @param {[type]} PROJECTS_MEMBER     [description]
 * @param {[type]} getTasksListService [description]
 */

function BoxResonChange($scope, $state, $rootScope, $log, $uibModalInstance,
  postCommonService, ADD_DOCUMENT, TASK_EDIT, projectId, selectedMember, type, data, idTask, listDocuments, PROJECTS_MEMBER, getTasksListService) {
  // init var
  var $ctrl = this;

  $ctrl.type = type;
  $ctrl.iData = data;
  $ctrl.taskUrl = TASK_EDIT.API + idTask;
  $ctrl.listDocuments = listDocuments;
  //event listing
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.sendComments = _fnGetEditerComments;
  /**
   * [_fnGetEditerComments description]
   * @return {[type]} [description]
   */
  function _fnGetEditerComments() {
    if ($ctrl.editer_comments) {
      $ctrl.iData.comment = $ctrl.editer_comments;
      $log.debug("$ctrl.iData: ");
      $log.debug($ctrl.iData);
      var request = postCommonService.postMethod(TASK_EDIT.METHOD, $ctrl.taskUrl, $ctrl.iData, TASK_EDIT.HEADERS);
      request.success(function(response) {

        /* Add documents to the server */
        var type = 1;
        var iUrl = ADD_DOCUMENT.API + '?object_type=' + type + '&object_id=' + idTask;
        for (var i = 0; i < $ctrl.listDocuments.length; i++) {
          var iData = {
            issuer: $ctrl.listDocuments[i].issuer,
            description: $ctrl.listDocuments[i].description,
            document_number: $ctrl.listDocuments[i].document_number,
            type: $ctrl.listDocuments[i].type
          };
          var postService = postCommonService.postMethod(ADD_DOCUMENT.METHOD, iUrl, iData, ADD_DOCUMENT.HEADERS);
          postService.success(function(response) {}).error(function(response) {
            $log.debug(response);
          });
        }
        $state.go('dashboard.task-detail', {
          idTask: idTask
        });
      }).error(function(response) {
        $log.debug(response);
      });
    } else {
      $rootScope.$broadcast('event-error', 'Vui lòng nhập lý do thay đổi!');
    }
    $uibModalInstance.dismiss('cancel');

  }

  function _fnClickBtnOk() {
    $uibModalInstance.dismiss('cancel');
  }
};
