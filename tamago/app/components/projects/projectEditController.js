'use strict';

tamagoApp.controller('projectEditController', projectEditController);

projectEditController.$inject = ['$scope', '$log', 'postCommonService', 'PROJECTS_DETAIL', 'PROJECTS_EDIT', 'PROJECTS_CREATE',
  'commonValues', '$http', '$rootScope', '$state', 'getCommonService', '$stateParams',
  '$filter', '$uibModal', 'blockUI', 'getTasksListService'
];
/*controller edit project*/

function projectEditController($scope, $log, postCommonService, PROJECTS_DETAIL, PROJECTS_EDIT, PROJECTS_CREATE,
  commonValues, $http, $rootScope, $state, getCommonService, $stateParams,
  $filter, $uibModal, blockUI, getTasksListService) {
  $scope.projectId = $stateParams.idProject;
  var projectUrl = PROJECTS_DETAIL.API + $scope.projectId;

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
  $scope.format = $scope.formats[2];
  $scope.error = false;
  $scope.eventClickChooseFile = fnEventClickChooseFile;

  $scope.total_member = 0;
  $scope.total_viewer = 0;
  $scope.doEdit = fnDoEdit;

  $scope.selected_viewer = [];
  $scope.selected_member = [];

  $scope.selected_tasks = [];
  $scope.list_main_tasks = [];
  $scope.task_templates = [];
  $scope.openMainTask = fnOpenBoxMainTask;

  $scope.$on('select-user', function(event, args) {
    $scope.selected_member = args;
  });
  fnGetProjectDetail();

  function fnGetUserOfProject(type) {
    var url_get_user = PROJECTS_DETAIL.API + $scope.projectId + '/' + type;

    var iData = {
      limit: type === 'members' ? $scope.project.total_member : $scope.project.total_viewer,
    };

    var getUser = getTasksListService.getTasksList(PROJECTS_DETAIL.METHOD, url_get_user, iData, PROJECTS_DETAIL.HEADERS);

    getUser.success(function(res) {

      if (type === 'members') {

        if (res.data.users) {
          $.each(res.data.users, function(k, member) {
            $scope.selected_member.push(member._id);
          });
        }

      } else {

        if (res.data.users) {
          $.each(res.data.users, function(k, member) {
            $scope.selected_viewer.push(member._id);
          });
        }

      }

    });

  }

  $scope.changeProjectName = function() {
    $scope.error = false;
    $scope.mgs_error = "";
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };
  $scope.dateOptions = {
    showWeeks: false,
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.$on('event-upload', function(event, args) {

    $scope.photo = args;

  });

  $scope.$on('event-error', function(event, args) {
    $scope.error = true;
    $scope.mgs_error = args;

  });

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  function getParam() {
    var data = {
      name: $scope.project.name || '',
      owner: commonValues.getUserId() || '',
      description: $scope.project.description || '', //[string]
      location: $scope.project.location || '', //[string]
      scale: $scope.project.scale || '', //[number]
      total_investment: $scope.project.total_investment || '', //[number]
      investor_unit: $scope.project.investor_unit || '', //[string]
      manager_unit: $scope.project.manager_unit || '', //[string]
      members: $scope.selected_member || [], //[array]
      plan_start_date: '',
      plan_end_date: '',
    };
    if (typeof $scope.project.plan_start_date === 'object') {
      data.plan_start_date = $scope.project.plan_start_date.yyyymmdd();
    }
    if (typeof $scope.project.plan_end_date === 'object') {
      data.plan_end_date = $scope.project.plan_end_date.yyyymmdd();
    }
    return data;

  }

  function fnDoEdit() {

    var data = getParam();
    //date
    if (typeof $scope.project.plan_start_date === 'object' &&
      typeof $scope.project.plan_end_date === 'object') {

      var time_start = $scope.project.plan_start_date.getTime();
      var time_end = $scope.project.plan_end_date.getTime();
      if (time_start > time_end) {
        $rootScope.$broadcast('event-error', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        return;
      }

    }

    if (data.scale !== '') {
      if (!isNumeric(data.scale)) {
        $rootScope.$broadcast('event-error', 'Diện tích phải nhập số hoặc để trống');
        return;
      }
    }
    if (data.total_investment !== '') {
      if (!isNumeric(data.total_investment)) {
        $rootScope.$broadcast('event-error', 'Số tiền phải nhập số hoặc để trống');
        return;
      }
    }
    var request_edit = postCommonService.postMethod(PROJECTS_EDIT.METHOD, projectUrl, data, PROJECTS_EDIT.HEADERS);

    request_edit.success(function(res) {
      var url = $('#link-back').attr('href');

      if (typeof $scope.photo !== 'undefined') {

        var iurl_upload = PROJECTS_CREATE.API + res.data._id + '/thumbnail';
        // with brower then content-type is undefined
        var headers = {
          'Content-Type': undefined
        };
        // create formdata to send
        var fd = new FormData();
        fd.append('photo', $scope.photo);

        var uploadService = postCommonService.uploadMethod(PROJECTS_CREATE.METHOD, iurl_upload, fd, headers);

        uploadService.success(function(res) {
          $state.go('dashboard.project-infomation', {
            idProject: $scope.projectId
          });
        });

      } else {
        $state.go('dashboard.project-infomation', {
          idProject: $scope.projectId
        });
      }

    }).error(function(res) {
      if (res.errors && res.errors.length > 0) {
        var error = res.errors[0];
        $scope.mgs_error = error.message;
      } else if (res.data) {
        if (res.data.parameters[0] === 'total_investment.total') {
          $scope.mgs_error = 'Số tiền phải nhập số hoặc để trống';
        }
        if (res.data.parameters[0] === 'scale.total') {
          $scope.mgs_error = 'Diện tích phải nhập số hoặc để trống';
        }
      } else {
        $scope.mgs_error = 'Có lỗi xảy ra, vui lòng thử lại!';
      }

      $scope.error = true;
    });
  }
  ////////////////////////////
  function fnGetProjectDetail() {
    blockUI.start({
      message: "Đang xử lý ..."
    });
    var request = getCommonService.getMethod(PROJECTS_DETAIL.METHOD, projectUrl, PROJECTS_DETAIL.HEADERS);
    console.log($scope.selected_member)
    request.success(function(res) {
      blockUI.stop();
      $scope.project = res.data;
      $scope.project.plan_start_date = $scope.project.plan_start_date ? new Date($scope.project.plan_start_date) : '';
      $scope.project.plan_end_date = $scope.project.plan_end_date ? new Date($scope.project.plan_end_date) : '';
      $scope.project.owner = $scope.project.owner._id;
      $scope.project.total_investment = $scope.project.total_investment ? $scope.project.total_investment.total : '';
      $scope.project.scale = $scope.project.scale ? $scope.project.scale.total : '';
      $scope.project.thumbnail = $filter('photo')($scope.project.thumbnail);
      $scope.baseData = angular.copy($scope.project);
      if ($scope.project.total_member) {
        fnGetUserOfProject('members');
      }
      $scope.baseData = {
        'name': $scope.baseData.name,
        'owner': commonValues.getUserId(),
        'description': $scope.baseData.description || '', //[string]
        'location': $scope.baseData.location || '', //[string]
        'scale': $scope.baseData.scale || '', //[number]
        'total_investment': $scope.baseData.total_investment || '', //[number]
        'investor_unit': $scope.baseData.investor_unit || '', //[string]
        'manager_unit': $scope.baseData.manager_unit || '', //[string]
        'members': $scope.selected_member || [], //[array]
        'plan_start_date': $scope.baseData.plan_start_date,
        'plan_end_date': $scope.baseData.plan_end_date,
      };
      setMasterData($scope.baseData);

      //if ($scope.)
    }).error(function(res) {
      blockUI.stop();
    });
  }

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
  /*hadnel click in avatar */
  function fnEventClickChooseFile() {

    $('input[fileread]').trigger('click');

  }


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
          if (type === 'member') {
            return 'Chọn thành viên';
          }
          return "Chọn người giám sát";
        },
        popupType: function() {
          return type;
        },
        canSearch: function() {
          return true;
        },
        multipleSelect: function() {
          return true;
        },
        selectedItems: function() {
          if (type === 'member') {
            return $scope.selected_member;
          }
          return $scope.selected_viewer;
        },
        extraData: function() {
          return {
            projectId: $scope.idProject
          };
        }
      }
    });
  };

  /*open modal*/
  function fnOpenBoxMainTask(type) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/box-select-main-task.html',
      controller: 'BoxMainTasksCtrl',
      controllerAs: '$ctrl',
      resolve: {
        items: function() {
          return $scope.selected_tasks;
        },
        viewer: function() {
          return $scope.selected_viewer;
        },
        member: function() {
          return $scope.selected_member;
        },
        type: function() {
          return type;
        },
        title: function() {
          return 'Chọn tác vụ chính';
        },
        mainTasks: function() {
          return $scope.list_main_tasks;
        }
      }
    });
  }

  /**/
  function setMasterData(value) {
    $scope.master_data = angular.copy(value);
  }
}
