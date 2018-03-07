'use strict';

tamagoApp.controller('projectCreateController', projectCreateController);

/*injection for controller*/

projectCreateController.$inject = ['$scope', '$log', 'postCommonService', 'PROJECTS_CREATE',
  'commonValues', '$http', '$rootScope', '$state', '$uibModal', 'blockUI'
];


/**/
function projectCreateController($scope, $log, postCommonService, PROJECTS_CREATE,
  commonValues, $http, $rootScope, $state, $uibModal, blockUI) {


  $scope.params = fnGetParams;
  $scope.doAdd = fnDoAdd;
  $scope.doCancel = commonValues.removeData();
  $scope.eventClickChooseFile = fnEventClickChooseFile;
  $scope.clickOnChooseImg = _fnClickOnChooseImg;
  $scope.processing = false;
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
  $scope.format = $scope.formats[2];
  $scope.altInputFormats = ['M!/d!/yyyy'];
  $scope.error = false;
  $scope.selected_viewer = [];
  $scope.selected_tasks = null;
  $scope.list_main_tasks = null;
  $scope.selected_member = [];
  $scope.task_templates = [];

  $scope.openMainTask = fnOpenBoxMainTask;
  $scope.$on('event-upload', function(event, args) {
    $scope.photo = args;
  });
  $scope.$on('event-error', function(event, args) {
    $scope.error = true;
    $scope.mgs_error = args;
  });

  $scope.$on('select-task', function(event, args) {
    $scope.selected_tasks = args;
  });

  $scope.$on('select-user', function(event, args) {
    $scope.selected_member = args;
  });
  $scope.$on('list-main-task', function(event, args) {
    $scope.list_main_tasks = args;
  });
  $scope.dbClick = function() {
    $scope.processing = true;
  }

  $scope.hideAlert = function() {
    $("button.close").parent().hide();
  };
  /**
   * get Param
   *
   * @return {Object}
   *
   */
  function fnGetParams() {
    return {
      name: $scope.name || '',
      owner: commonValues.getUserId(),
      description: $scope.description || '', //[string]
      location: $scope.location || '', //[string]
      scale: $scope.scale || '', //[number]
      total_investment: $scope.total_investment || '', //[number]
      investor_unit: $scope.investor_unit || '', //[string]
      manager_unit: $scope.manager_unit || '', //[string]
      plan_start_date: $scope.plan_start_date ? $scope.plan_start_date.yyyymmdd() : '', //[date]
      plan_end_date: $scope.plan_end_date ? $scope.plan_end_date.yyyymmdd() : '', //[date]
      members: $scope.selected_member || [], //[array]
      viewers: $scope.selected_viewer || [], //[array]
      task_templates: $scope.list_main_tasks || null
    };

  }
  /**
   * handel when submit form
   *
   */
  function fnDoAdd() {
    var iData = $scope.params();
    // check
    if (typeof $scope.plan_start_date !== 'undefined' &&
      typeof $scope.plan_end_date !== 'undefined') {
      var time_start = $scope.plan_start_date.getTime();
      var time_end = $scope.plan_end_date.getTime();
      if (time_start > time_end) {
        $rootScope.$broadcast('event-error', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        return;
      }
    }
    if (iData.scale !== '') {
      if (!isNumeric(iData.scale)) {
        $rootScope.$broadcast('event-error', 'Diện tích phải nhập số hoặc để trống');
        return;
      }
    }
    if (iData.total_investment !== '') {
      if (!isNumeric(iData.total_investment)) {
        $rootScope.$broadcast('event-error', 'Số tiền phải nhập số hoặc để trống');
        return;
      }
    }
    $log.debug('data project: ');
    $log.debug(iData);
    blockUI.start("Đang xử lý ...");
    $scope.processing = true;
    var postService = postCommonService.postMethod(PROJECTS_CREATE.METHOD, PROJECTS_CREATE.API, iData, PROJECTS_CREATE.HEADERS);
    postService.success(function(res) {
      $scope.processing = false;
      // continue upload image
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


        uploadService.success(function(resPhoto) {
          blockUI.stop();
          commonValues.setData('new-project', res.data);
          $state.go('dashboard.project-list');
        }).error(function(err) {
          blockUI.stop();
        });

      } else {
        $scope.processing = false;
        blockUI.stop();
        commonValues.setData('new-project', res.data);
        var eventListens = commonValues.getData();
        $state.go('dashboard.project-list');
      }
    }).error(function(res) {
      blockUI.stop();
      $scope.error = true;
      $scope.processing = false;
      if (res.errors && res.errors.length > 0) {
        var error = res.errors[0];
        $scope.mgs_error = error.message;
      } else {
        $scope.mgs_error = 'Có lỗi xảy ra, vui lòng thử lại!';
      }
    });
  }

  /*hadnel click in avatar */
  function fnEventClickChooseFile() {
    $('input[fileread]').trigger('click');
  }

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    showWeeks: false,
    formatYear: 'yy',
    startingDay: 1
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

  $scope.changeProjectName = function() {
    $scope.error = false;
    $scope.mgs_error = "";
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [{
    date: tomorrow,
    status: 'full'
  }, {
    date: afterTomorrow,
    status: 'partially'
  }];

  $scope.animationsEnabled = true;


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
  //
  // /*open modal*/
  // function fnOpenBox(type) {
  //   var modalInstance = $uibModal.open({
  //     animation: $scope.animationsEnabled,
  //     ariaLabelledBy: 'modal-title',
  //     ariaDescribedBy: 'modal-body',
  //     templateUrl: 'app/shared/layout/box-list-user-system.html',
  //     controller: 'BoxUserSystemCtrl',
  //     controllerAs: '$ctrl',
  //     resolve: {
  //       items: function() {
  //         if (type === 'viewer') {
  //           return $scope.selected_viewer;
  //         }
  //         return $scope.selected_member;
  //       },
  //       viewer: function() {
  //         return $scope.selected_viewer;
  //       },
  //       member: function() {
  //         return $scope.selected_member;
  //       },
  //       type: function() {
  //         return type;
  //       },
  //       title: function() {
  //         if (type === 'viewer') {
  //           return 'Chọn người theo dõi';
  //         }
  //         return 'Chọn thành viên';
  //       }
  //     }
  //   });
  // }
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
          return $scope.selected_tasks;
        }
      }
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

  function _fnClickOnChooseImg() {
    $('.project-create-choose-img').trigger('click');
  }
};
