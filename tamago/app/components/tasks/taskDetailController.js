/*
 *---------------------------------------------------------------------------
 * File Name      : taskDetailController.js
 * File Code      : UTF-8
 * Create Date    : September 08, 2016
 * Copyright      : 2016 by GCS.
 *---------------------------------------------------------------------------
 * ver 1.0.0      : September 08, 2016 khuyentn new create
 *---------------------------------------------------------------------------
 * history        :
 *---------------------------------------------------------------------------
 */
'use strict';

tamagoApp
  .controller('taskDetailController', ['$scope', '$rootScope', '$timeout', '$stateParams', '$state', '$log', '$location',
    '$anchorScroll', '$uibModal', 'PROJECTS_DETAIL', 'getCommonService', 'postCommonService',
    'getTasksListService', 'deleteService', 'commonValues', 'TASKS_DETAIL', 'Pagination',
    'GET_COMMENTS', 'POST_COMMENTS', 'CHILDREN_TASKS', 'PUT_PRIORITY', 'PROJECTS_MEMBER',
    'DELETE_TASK', 'TASK_STATUS', 'REPORT_ACTION', 'orderByFilter', 'blockUI', 'blockUIConfig',
    taskDetailController
  ])

var convertDate = function(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var fullDate = day + '/' + month + '/' + year;
  return fullDate;
};

var getTimeComment = function(date) {
  var timeComment = new Date(date);
  var hour = timeComment.getHours();
  var minute = timeComment.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
  }
  var time = hour + ':' + minute;
  return time;
};

/**
 * [Get detail information of task]
 * @param  {[Object]} $scope             [The application object]
 * @param  {[Object]} $stateParams       [The application object]
 * @param  {[Object]} $log               [The application object]
 * @param  {[Object]} $location          [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Function]} getCommonService [Common service]
 * @param  {[Constant]} TASKS_DETAIL     [Defined constant task detail]
 * @return {[type]}                      [None]
 */
function taskDetailController($scope, $rootScope, $timeout, $stateParams, $state, $log, $location,
  $anchorScroll, $uibModal, PROJECTS_DETAIL, getCommonService, postCommonService,
  getTasksListService, deleteService, commonValues, TASKS_DETAIL,
  Pagination, GET_COMMENTS, POST_COMMENTS, CHILDREN_TASKS, PUT_PRIORITY,
  PROJECTS_MEMBER, DELETE_TASK, TASK_STATUS, REPORT_ACTION, orderByFilter, blockUI, blockUIConfig) {

  $scope.$on('event-error', function(event, args) {
    $scope.error = true;
    $scope.mgs_error = args;
  });
  $scope.template_default = {
    url: 'app/components/projects/document-list.html'
  }
  $scope.template_list = [{
    url: 'app/components/projects/document-list.html'
  }, {
    url: 'app/components/projects/document-list.html'
  }]

  $scope.barFooterInfo = {
    leftPosition: 0
  };

  $scope.actionMode = REPORT_ACTION;

  $scope.showProgressBar = false;
  $scope.shouldLoadComment = true;

  $scope.currentdate = new Date();
  $scope.percentCompleted = 0;
  $scope.comments = [];
  //Formated comments to display in UI
  $scope.displayComments = [];
  $scope.commentsTemp = [];
  $scope.selectedItem;
  $scope.selectedMember = '';
  $scope.selectedOwner;
  $scope.statusAssign;
  $scope.messageAssign;
  $scope.getParam = fnGetParam;
  $scope.currentPage;
  $scope.isOwner = false;
  $scope.statusSelected = fnStatusSelected;
  $scope.getComments = fnGetComments;
  $scope.projectId = '';
  $scope.getChildrenTask = fnGetChildrenTask;
  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'app/components/tasks/assign-task.html',
    title: 'Title',
    status: false
  };

  $scope.commentMenu = {
    content: 'Hello, World!',
    templateUrl: 'commentMenu.html',
    title: 'Title',
    status: false
  };

  $scope.type = 'task';
  $scope.autoScroll = fnAutoScroll;
  $scope.total = 0; // 21

  var totalPages = 0;
  $scope.limit = 5;
  var offsetVal;

  var taskId = $stateParams.idTask;
  //var projectId = $stateParams.idTask;
  var taskUrl = TASKS_DETAIL.API + taskId;
  var getCommentUrl = GET_COMMENTS.API + taskId + '/comments';
  var postCommentUrl = POST_COMMENTS.API + taskId + '/comments';
  var getChildrenTaskUrl = CHILDREN_TASKS.API + taskId + '/children-task/';
  var getProjectMemberUrl;

  $scope.updatePriorityUrl = PUT_PRIORITY.API + taskId;
  $scope.initUser = commonValues.getUserId();
  $scope.taskId = taskId;
  $scope.pages = 0;
  $scope.newComent;

  var projectUrl = "";
  var projectDocUrl = "";
  /**
   *
   */
  $scope.barWidthInfo = {
    lateBarWidth: 0,
    newBarWidth: 0,
    inprogressBarWidth: 0
  };

  $scope.runningMan = {
    percent: 0,
    date: '10/10/2015',
    icon: './assets/img/icons/running-man-finished.png',
    marginLeft: 0,
    showRight: true,
    barWidth: 0
  };

  $scope.alerts = [

  ];

  $scope.newBarInfo = {
    width: 0,
    show: true,
    showBeginColumn: true,
    showEndColumn: true
  };

  $scope.inprogressBarInfo = {
    width: 0,
    show: true,
    showBeginColumn: true,
    showEndColumn: true
  };

  $scope.lateBarInfo = {
    width: 0,
    show: true,
    showBeginColumn: true,
    showEndColumn: true
  };

  $scope.tabs = [{
    title: 'Chi tiết',
    url: 'chitiet'
  }, {
    title: 'Công văn',
    url: 'congvan'
  }, {
    title: 'Tác vụ con',
    url: 'tacvucon'
  }];

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

  $scope.status_task = {
    new: {
      icon: './assets/img/icons/new_status.png',
      name: 'Mới',
      id: 0
    },
    inprogress: {
      icon: './assets/img/icons/inprogress_status.png',
      name: 'Đang làm',
      id: 1
    },
    finish: {
      icon: './assets/img/icons/done_status.png',
      name: 'Hoàn thành',
      id: 2
    },
    reopen: {
      icon: './assets/img/icons/reopen_status.png',
      name: 'Làm lại',
      status_name: 'Mở lại',
      id: 3
    },
    cancel: {
      icon: './assets/img/icons/cancel_status.png',
      name: 'Huỷ',
      id: 4
    },
    hold: {

      icon: './assets/img/icons/pause_status.png',
      name: 'Tạm dừng',
      status_name: 'Đang làm',
      id: 5
    },
  };

  $scope.action_task = {
    start: {
      icon: './assets/img/icons/start_action.png',
      name: 'Bắt đầu',
      id: 0
    },
    finish: {
      icon: './assets/img/icons/done_action.png',
      name: 'Hoàn thành',
      id: 1
    },
    reopen: {
      icon: './assets/img/icons/reopen_action.png',
      name: 'Làm lại',
      id: 2
    },
    cancel: {
      icon: './assets/img/icons/cancel_action.png',
      name: 'Huỷ',
      id: 3
    },
    hold: {
      icon: './assets/img/icons/pause_action.png',
      name: 'Tạm dừng',
      id: 4
    },
  };

  $scope.validActionList = null;

  $scope.$on('$viewContentLoaded', function() {
    $scope.currentTab = 'chitiet';
    getTaskDetail();
    $scope.pageInfo = Pagination.getNew(3);
    $scope.getChildrenTask();
  });

  $scope.disabledStatus = [2, 4, 5];

  $scope.checkStatus = function(status) {
      return $scope.disabledStatus.indexOf(status) !== -1;
    }
    /**
    }
   * [countTime description]
   * @param  {[type]} assignDate [description]
   * @return {[type]}            [description]
   */
  var countTime = function(assignDate) {
    moment.updateLocale('vi', {
      relativeTime: {
        future: 'còn %s',
        past: 'trễ %s',
        s: 'vài giây',
        m: 'một phút',
        mm: '%d phút',
        h: 'một giờ',
        hh: '%d giờ',
        d: 'một ngày',
        dd: '%d ngày',
        M: 'một tháng',
        MM: '%d tháng',
        y: 'một năm',
        yy: '%d năm'
      }
    });
    return moment(assignDate).fromNow(true);
  };
  /**/
  var getStatus = function(assignDate) {
    var time;
    var baseStatus;
    var absDiffDay;
    var current_day = new Date();
    var date = new Date(current_day).getTime() - (new Date(assignDate).getTime());
    var diffDays = Math.ceil(date / (1000 * 3600 * 24));
    if (date <= 0) {
      baseStatus = 'Còn ';
    } else {
      baseStatus = 'Đã trễ ';
    }
    absDiffDay = Math.abs(diffDays);
    if (absDiffDay < 1) {
      return baseStatus + absDiffDay + ' giờ';
    } else if (absDiffDay >= 1 && absDiffDay <= 30) {
      return baseStatus + absDiffDay + ' ngày';
    } else if (absDiffDay > 30 && absDiffDay <= 365) {
      var monthTime = Math.round(absDiffDay / 30);
      return baseStatus + monthTime + ' tháng';
    } else if (absDiffDay > 365) {
      var yearTime = Math.round(absDiffDay / 365);
      return baseStatus + yearTime + ' năm';
    }
  };
  $scope.onClickTab = function(tab) {
    $scope.custom = true;
    $scope.currentTab = tab.url;
    $scope.template_default = $scope.template_list[1];
  };

  $scope.isActiveTab = function(tabUrl) {
    return tabUrl == $scope.currentTab;
  };


  // Report menu actions
  $scope.viewReport = function() {
    console.log("Show report detail");
  };

  $scope.deleteReport = function() {
    console.log("Show report detail");
  };

  /**/
  $scope.custom = true;
  $scope.selectAssigner = function() {
    //$scope.custom = false;
    //fnOpenBox();
  };
  var selected = null;
  /**/
  $scope.selectMember = function(member) {
    if (selected !== null) {
      selected.selectedMember = '';
    }
    selected = member;
    selected.selectedMember = 'circle-prior-normal';
    $scope.selectedOwner = selected;
  };
  /**/
  $scope.noHidden = function() {
    $scope.custom = true;
  };
  /**/
  $scope.unselectMember = function(member) {
    member.selectedMember = '';
  };
  $scope.$on('selected-assign-work', function(argv, data) {
    if (data) {
      getTaskDetail();
      $scope.alerts.push({type: 'success', 'message': "Giao việc thành công"});
    } else {
      $scope.alerts.push({type: 'danger', 'message': "Có lỗi trong quá trình giao việc, vui lòng thử lại!"});
    }
  });
  /* Start post comment to server */
  $scope.sendComment = function(contentComment) {
    var iData = {
      comment: contentComment
    };
    var request = postCommonService.postMethod(POST_COMMENTS.METHOD, postCommentUrl, iData, POST_COMMENTS.HEADERS);
    request.success(function(response) {
      $scope.newComent = {
        'message': contentComment,
        'user': {
          'avatar': commonValues.getUserAvatar(),
          '_id': $scope.initUser
        },
        'created_at': new Date().toISOString()
      };
      if ($scope.newComent) {
        $scope.taskInformation.can_delete = false;
      }

      if ($scope.avatars.indexOf(commonValues.getUserAvatar()) < 0) {
        $scope.avatars.push(commonValues.getUserAvatar());
      }

      $scope.commentsDisplay = formatComments([$scope.newComent], $scope.commentsDisplay);
      $scope.comments.push($scope.newComent);
      //$log.debug(response);
      $scope.autoScroll();
    }).error(function(response) {
      $log.debug(response);
    });
    $scope.contentComment = '';
  };
  /* Start set priority */

  $scope.prioritySelected = function(item) {
    $scope.selectedItem = item;
    var idPriority = item.id;
    var dataPriority = {
      priority: idPriority
    };
    var updatePriorityRequest = postCommonService.postMethod(PUT_PRIORITY.METHOD,
      $scope.updatePriorityUrl, dataPriority, PUT_PRIORITY.HEADERS);
      updatePriorityRequest.success(function(response) {
      $scope.taskInformation.iconPriority = $scope.priorities[idPriority]['urlIcon'];
      $scope.taskInformation.namePriority = $scope.priorities[idPriority]['name'];

    }).error(function(response) {
      if (response) {
        if (response.errors && response.errors.length > 0) {
          $scope.alerts.push({type: 'danger', 'message': response.errors[0].message});
        } else {
          $scope.alerts.push({type: 'danger', 'message': 'Có lỗi xảy ra, vui lòng thử lại!'});
        }
      }
      else {
        $scope.alerts.push({type: 'danger', 'message': 'Không kết nối được tới máy chủ, vui lòng thử lại!'});
      }
    });
  }
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
          return $scope.taskId;
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
  }

  //Handle action when click on report button
  $scope.reportAction = function(report, mode) {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/components/reports/weekly-report.html',
      controller: 'weeklyReportController',
      resolve: {
        taskInfo: function() {
          return {
            title: $scope.taskInformation.title,
            _id: $scope.taskInformation._id,
            project: $scope.taskInformation.project.name
          };
        },
        reportInfo: function() {
          return report;
        },
        actionMode: function() {
          return mode;
        }
      }
    });
  };

  $scope.openConfirmBox = function(commentId) {
    $uibModal.open({
      templateUrl: 'app/shared/layout/confirm-dialog.html',
      controller: 'ConfirmDialogController',
      resolve: {
        callback: function() {
          return deleteReportCallback;
        },
        data: function() {
          return {
            title: "Sunware",
            body: "Bạn có muốn xoá báo cáo này?",
            extra: commentId
          };
        }
      }
    });
  };

  $scope.openMemberBox = function(type) {
    if ($scope.disabledStatus.indexOf(status) >= 0) {
      return false;
    } else {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'app/shared/layout/items-popup.html',
        controller: 'ItemsPopupCtroller',
        resolve: {
          title: function() {
            return "Người thực hiện";
          },
          popupType: function() {
            return type;
          },
          canSearch: function() {
            return true;
          },
          multipleSelect: function() {
            return false;
          },
          selectedItems: function() {
            return $scope.selectedAssignees;
          },
          extraData: function() {
            return {projectId: $scope.idProject};
          }
        }
      });
    }
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.openBox = function(type_box, status) {
    if ($scope.disabledStatus.indexOf(status) >= 0) {
      return false;
    } else {
      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'app/shared/layout/box-list-user.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        resolve: {
          projectId: function() {
            return $scope.projectId;
          },
          selectedMember: function() {
            if (type_box === 'supervisor') {
              return $scope.selectedSupervisor;
            }
            return $scope.selectedAssignee;
          },
          type: function() {
            return type_box;
          },
          taskId: function() {
            return $scope.taskId;
          },
          selectedOrgs: function() {
            return '';
          },
          selectedDependencyTasks: function() {
            return '';
          },
          parentId: function() {
            return null;
          }
        }
      });
    }
  }


  $scope.removeTask = function(taskId) {
      var deleteTaskUrl = DELETE_TASK.API + '/' + taskId;
      if (confirm("Bạn có chắc muốn xóa công việc này?")) {
        var deleteTask = deleteService.deleteMethod(DELETE_TASK.METHOD, deleteTaskUrl, DELETE_TASK.HEADERS);
        deleteTask.success(function(response) {
          //$rootScope.$broadcast('event-delete-success', 'Đã xóa tác vụ thành công!');
          commonValues.setData('delete-success', response.data);
          $state.go('dashboard/task-list');
        }).error(function(response) {
          if (response === null) {
            $rootScope.$broadcast('event-error', 'Xóa tác vụ thất bại. Hãy kiểm tra kết nối mạng!');
          }
        });
      }
    }
    /**
     * Get task detail service
     */
  function getTaskDetail() {

    blockUI.start({
      message: 'Đang tải dữ liệu...'
    });
    $('.modal-dialog ').hide();
    $('.modal-backdrop').hide();
    var request = getCommonService.getMethod(TASKS_DETAIL.METHOD, taskUrl, TASKS_DETAIL.HEADERS);

    request.success(function(response) {
      $log.debug("task detail: ");
      $log.debug(response.data);
      blockUI.stop();
      disableStatus(response.data.status);
      $scope.projectId = response.data.project._id;

      projectUrl = PROJECTS_DETAIL.API + $scope.projectId;
      projectDocUrl = PROJECTS_DETAIL.API + $scope.projectId + '/documents';

      // check  is owner
      if (response.data.owner._id === $scope.initUser) {
        $scope.isOwner = true;
      }

      var taskInforTemp = response.data;
      $scope.taskDetail = $.extend(true, {}, taskInforTemp);

      $scope.validActionList = handleValidActions($scope.taskDetail.status);
      processTaskDetailDate();

      handleProgressBar();
      var startDate = new Date(taskInforTemp.plan_start_date);
      taskInforTemp.plan_start_date = convertDate(startDate);
      var endDate = new Date(taskInforTemp.plan_end_date);
      taskInforTemp.plan_end_date = convertDate(endDate);
      switch (taskInforTemp.priority) {
        case 0:
          taskInforTemp.iconPriority = './assets/img/icons/tre_cin.png';
          taskInforTemp.namePriority = 'Thấp';
          break;
        case 1:
          taskInforTemp.iconPriority = './assets/img/icons/binhthuong_icn.png';
          taskInforTemp.namePriority = 'Bình Thường';
          break;
        case 2:
          taskInforTemp.iconPriority = './assets/img/icons/cao_icn.png';
          taskInforTemp.namePriority = 'Cao';
          break;
        case 3:
          taskInforTemp.iconPriority = './assets/img/icons/khancap_icn.png';
          taskInforTemp.namePriority = 'Khẩn Cấp';
          break;
        default:
          taskInforTemp.iconPriority = './assets/img/icons/tre_cin.png';
          taskInforTemp.namePriority = 'Độ Ưu Tiên';
      }

      //Set lock icon for task detail
      switch (taskInforTemp.dependency) {
        case 1:
          taskInforTemp.iconLock = './assets/img/icons/lock-icon.png';
          $("#img_icn_task_lock").show();
          break;
        case 2:
          taskInforTemp.iconLock = './assets/img/icons/icn_unlock.png';
          $("#img_icn_task_lock").show();
          break;
        default:
          $("#img_icn_task_lock").hide();
      }

      $scope.taskInformation = taskInforTemp;
      if ($scope.taskInformation.can_change) {
        $scope.isOwner = true;
      } else {
        $scope.isOwner = false;
      }
      drawProgress();
      /* End get task detail */

      /* Start get project member */
      var dataProjectMember = {
        keyword: ''
      };
      getProjectMemberUrl = PROJECTS_MEMBER.API + $scope.taskInformation.project._id + '/members';
      var getProjectMember = getTasksListService.getTasksList(PROJECTS_MEMBER.METHOD,
        getProjectMemberUrl, dataProjectMember, PROJECTS_MEMBER.HEADERS);
      getProjectMember.success(function(response) {
        $scope.membersProject = response.data;
      });
      $scope.reloadComments();
      /* End set priority */
    }).error(function(response) {
      blockUI.stop();
      //$log.debug(response);
      $location.path('/login');
    });
  }
  /* Start get comment function */
  function fnGetComments() {
    if ($scope.pages == 0) {
      offsetVal = 0;
    } else {
      offsetVal = $scope.pages * $scope.limit;
    }
    if (offsetVal < $scope.comments.length) {
      return;
    }

    $scope.shouldLoadComment = false;
    var iData = {
      offset: offsetVal,
      limit: $scope.limit
    };
    var comment = getTasksListService.getTasksList(GET_COMMENTS.METHOD, getCommentUrl, iData, GET_COMMENTS.HEADERS);
    comment.success(function(response) {
      var commentCellHeight = 70;

      var arrayAvatars = [];
      var found;
      $scope.total = response.data.total;

      var listComments = response.data.comments;
      $scope.autoScroll(listComments.length * commentCellHeight);
      if (listComments.length < $scope.limit) {
        $scope.shouldLoadComment = false;
      }

      for (var i = 0; i < listComments.length; i++) {
        found = undefined;
        for (var y = 0; y < arrayAvatars.length; y++) {
          if (listComments[i].user.avatar === arrayAvatars[y]) {
            found = true;
            break;
          }
        }
        if (!found) {
          arrayAvatars.push(listComments[i].user.avatar);
        }
        console.log(listComments);
        $scope.comments.push(listComments[i]);
      }
      $scope.commentsDisplay = formatComments(listComments, $scope.commentsDisplay);
      $scope.avatars = arrayAvatars;
      $scope.shouldLoadComment = true;
    }).error(function(response) {
      $scope.shouldLoadComment = true;
    });
  }
  /* End get comment function */
  /* Start get children task */
  function fnGetChildrenTask() {
    var getChildrenTasks = getTasksListService.getTasksList(CHILDREN_TASKS.METHOD, getChildrenTaskUrl, $scope.getParam(), CHILDREN_TASKS.HEADERS);
    getChildrenTasks.success(function(response) {
      $scope.childrenTasks = response.data.tasks;
      for (var i = 0; i < $scope.childrenTasks.length; i++) {
        var childrenStatus = getStatus($scope.childrenTasks[i].plan_end_date);
      }
      $scope.page = $scope.pageInfo.page;
      $scope.totalItems = response.data.total;
      $scope.currentPage = $scope.pageInfo.page;
      $scope.numPages = Math.ceil(response.data.total / $scope.pageInfo.perPage);
      $scope.perPage = $scope.pageInfo.perPage;
    }).error(function(response) {
      $log.debug(response);
    });
  };
  /* End get children task */

  /**
   * [Get all tasks by current page]
   * @return {[type]} [description]
   */
  $scope.pageChanged = function() {
    $scope.pageInfo.toPageId($scope.currentPage);
    $scope.getChildrenTask();
  };

  function fnGetParam() {
    if ($scope.pageInfo.page == 0) {
      $scope.offsetVal = 0;
    } else {
      $scope.offsetVal = ($scope.pageInfo.page - 1) * $scope.pageInfo.perPage;
    }
    var iData = {
      offset: $scope.offsetVal,
      limit: $scope.pageInfo.perPage
    };
    return iData;
  }
  /**/
  function fnStatusSelected(target) {
    if (!target.disabled) {
      fnUpdateStatus(target);
    }
  }
  /**/
  function fnUpdateStatus(target) {
    var dataStatus = {
      action: target.id
    };
    var updatePriorityRequest = postCommonService.postMethod(PUT_PRIORITY.METHOD, $scope.updatePriorityUrl, dataStatus, PUT_PRIORITY.HEADERS);

    updatePriorityRequest.success(function(response) {
      getTaskDetail();
    }).error(function(response) {
      if (response) {
        if (response.errors && response.errors.length > 0) {
          var error = response.errors[0];
          $scope.alerts.push({type: 'danger', 'message': error.message});
        } else {
          $scope.alerts.push({type: 'danger', 'message': 'Có lỗi xảy ra, vui lòng thử lại!'});
        }
      }
      else {
        $scope.alerts.push({type: 'danger', 'message': 'Không kết nối được tới máy chủ, vui lòng thử lại!'});
      }
      $timeout(function () {
        $scope.error = false;
        $scope.mgs_error = "";
      }, 5000);
      //$location.path('/login');
    });
  }

  function disableStatus(id) {
    if (id === 0) {
      $scope.status_task_default = $scope.status_task.new;
    } else if (id === 1) {
      $scope.status_task_default = $scope.status_task.inprogress;
    } else if (id === 2) {
      $scope.status_task_default = $scope.status_task.finish;
    } else if (id === 3) {
      $scope.status_task_default = $scope.status_task.reopen;
    } else if (id === 4) {
      $scope.status_task_default = $scope.status_task.cancel;
    } else if (id === 5) {
      $scope.status_task_default = $scope.status_task.hold;
    }
    $log.debug(JSON.stringify($scope.status_task_default));
  }
  /**/
  function drawProgress() {
    /* Start get task detail */
    $scope.iconRunner = './assets/img/icons/icn-run-process.png';
    $scope.hidenPerson = false;
    $scope.percentCompletedReal = 0;
    $scope.percentlated = 0;
    $scope.percentPerson = 0;
    $scope.hiden_current_date = true;

    var taskInforTemp = $scope.taskInformation;
    var start_date = new Date(taskInforTemp.plan_start_date);
    var end_date = new Date(taskInforTemp.plan_end_date);
    var real_start_date = new Date(taskInforTemp.real_start_date);
    var real_end_date = new Date(taskInforTemp.real_end_date);
    var time_start_date = start_date.getTime();
    var time_end_date = end_date.getTime();
    var ranger = dateDiff(end_date, start_date);

    var time_real_start_date = real_start_date.getTime();
    var time_real_end_date = real_end_date.getTime();

    if (taskInforTemp.status == 2) {
      $scope.percentCompleted = 100;
      $scope.iconRunner = './assets/img/icons/veDich_x3.png';
      $scope.percentlated = 0;
      $scope.percentPerson = 100;
      $scope.showPercent = true;
      $scope.percentCompletedReal = 100;
      return;
    }
    //case Invalid Date
    if (isNaN(time_real_start_date)) {
      $scope.percentCompleted = 0;
      $scope.hidenPerson = true;
      return;
    }
    //case real start date less than time end date of task

    //86400 sec  per day

    if (time_end_date > time_real_start_date) {

      var ranger_with_real_start_date = dateDiff(real_start_date, start_date);

      var per = (ranger_with_real_start_date / ranger) * 100;

      if (!isNaN(time_real_end_date)) {
        taskInforTemp.plan_end_date = real_end_date;
        $scope.iconRunner = './assets/img/icons/veDich_x3.png';
        per = 100;
      }

      $scope.percentPerson = $scope.percentCompleted = Math.ceil(per);
      $scope.showPercent = true;
      $scope.percentCompletedReal = $scope.percentPerson;
    } else {

      var k = Math.floor((time_real_start_date - time_end_date) / (1000 * 3600 * 24));
      if (k === 0) {
        $scope.percentCompleted = 50;
        $scope.percentlated = 50;
        $scope.iconRunner = './assets/img/icons/icn-run-process-ending.png';
        $scope.percentPerson = 50;
        $scope.showPercent = false;
        return;
      }
      //case lated and complete task
      if (!isNaN(time_real_end_date)) {
        $scope.percentCompleted = 50;
        $scope.percentlated = 100;
        $scope.iconRunner = './assets/img/icons/veDich_x3.png';
        $scope.percentPerson = 100;
        $scope.showPercent = true;
        $scope.percentCompletedReal = 100;
        return;
      }
      $scope.percentCompleted = 50;
      $scope.percentlated = 75;
      $scope.iconRunner = './assets/img/icons/icn-run-process-ending.png';
      $scope.percentPerson = 75;
      $scope.showPercent = false;
    }

  }

  function dateDiff(date2, date1) {

    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  function fnAutoScroll(position) {
    //scroll to bootom
    var $box_content = $('.nano-content');
    var p_box = $box_content.get(0);
    var h = 0;
    if (position) {
      h = position;
    }
    else {
      h = $box_content.get(0).scrollHeight;
    }

    $(p_box).animate({
      scrollTop: h
    }, '800', 'swing');
  }

  $rootScope.$on('create-weekly-report-sucess', function(event, args){
    $scope.alerts.push({type: 'success', message: 'Tạo báo cáo thành công!'});
    $scope.reloadComments();
   });

   $rootScope.$on('edit-weekly-report-sucess', function(event, args){
     $scope.alerts.push({type: 'success', message: 'Cập nhật báo cáo thành công!'});
     $scope.reloadComments();
    });

   $scope.reloadComments = function() {
     $scope.pages = 0;
     $scope.comments = [];
     $scope.commentsDisplay = [];
     $scope.getComments();
   };

  $scope.loadMoreComment = function() {
    if ($scope.shouldLoadComment) {
      $scope.pages++;
      $scope.numberPage = Math.ceil($scope.total / $scope.limit);
      if ($scope.pages < $scope.numberPage) {
        $scope.getComments();
      }
    }
  };

  function periodBetweenDates(fromDate, toDate) {
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    var timeDiff = fromDate.getTime() - toDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Handle to draw progress bar
   */
  function handleProgressBar() {

    // $scope.taskDetail.status = 2;
    // $scope.taskDetail.plan_end_date = new Date(2016, 5, 30);
    // $scope.taskDetail.real_start_date = new Date(2016, 5, 4);
    // $scope.taskDetail.real_end_date = new Date(2016, 5, 4);

    var task = $scope.taskDetail;

    var status = task.status;
    var planEndDate = task.plan_end_date;
    var realEndDate = null;
    var realStartDate = null;
    $scope.runningMan.showPercent = true;
    $scope.showProgressBar = false;
    switch (status) {
      case TASK_STATUS.INPROGERSS:
      case TASK_STATUS.HOLD:
        realStartDate = task.real_start_date;
        $scope.showProgressBar = true;
        $scope.runningMan.icon = "./assets/img/icons/running-man-processing.png";
        $scope.runningMan.date = new Date();
        drawProgressBar(planEndDate, realStartDate, new Date());

        if (task.children_task && task.children_task > 0) {
          $scope.runningMan.showPercent = true;
          $scope.runningMan.percent = task.percent_completed;
        } else {
          $scope.runningMan.showPercent = false;
        }

        break;
      case TASK_STATUS.DONE:
        $scope.runningMan.showPercent = true;
        $scope.showProgressBar = true;
        realStartDate = task.real_start_date;
        realEndDate = task.real_end_date;
        $scope.runningMan.percent = 100;
        $scope.runningMan.icon = "./assets/img/icons/running-man-finished.png";
        $scope.runningMan.date = task.real_end_date;
        drawProgressBar(planEndDate, realStartDate, realEndDate);
        break;
      default:
    }
  }

  /**
   * Draw progress bar
   *
   * @param  {Date} planEndDate   Task's plan end Date
   * @param  {Date} realStartDate Task's real start Date
   * @param  {Date} realEndDate   Task's real end date, if task is inprogress this value will be current date
   */
  function drawProgressBar(planEndDate, realStartDate, realEndDate) {
    if (!planEndDate || !realStartDate || !realEndDate) {
      $scope.showProgressBar = false;
      return;
    }
    var minPercent = 10;
    var dates = [planEndDate, realStartDate, realEndDate];
    var maxDate = new Date(Math.max.apply(null, dates));
    var minDate = new Date(Math.min.apply(null, dates));

    var totalDate = periodBetweenDates(maxDate, minDate);
    totalDate = Math.abs(totalDate);
    var newBarPeriod = periodBetweenDates(planEndDate, realEndDate);

    var dateValue = new Date(Math.min.apply(null, [realEndDate, planEndDate]));
    var inprogressBarPeriod = periodBetweenDates(dateValue, realStartDate);
    var lateBarPeriod = periodBetweenDates(realEndDate, planEndDate);

    newBarPeriod = newBarPeriod > 0 ? newBarPeriod : 0;
    inprogressBarPeriod = inprogressBarPeriod > 0 ? inprogressBarPeriod : 0;
    lateBarPeriod = lateBarPeriod > 0 ? lateBarPeriod : 0;

    var newBarWidth = barPercentWidth(newBarPeriod, totalDate);
    var inprogressBarWidth = barPercentWidth(inprogressBarPeriod, totalDate);
    var lateBarWidth = barPercentWidth(lateBarPeriod, totalDate);

    $scope.newBarInfo.width = Math.floor(newBarWidth * 100);
    $scope.inprogressBarInfo.width = Math.floor(inprogressBarWidth * 100);
    $scope.lateBarInfo.width = Math.floor(lateBarWidth * 100);

    //Handle case planStart, planEnd, readEnd in the same day
    if (totalDate === 0) {
      if (realStartDate <= planEndDate) {
        $scope.inprogressBarInfo.width = 100;
      } else {
        $scope.lateBarInfo.width = 100;
      }
    }

    processBarInfo($scope.newBarInfo);
    processBarInfo($scope.inprogressBarInfo);
    processBarInfo($scope.lateBarInfo);

    var margin = 10;
    var barWidth = $(".task-progress-bar").width() - margin;
    var runningManWidth = 90;

    if ($scope.lateBarInfo.show) {
      //Handle min width
      if ($scope.taskDetail.status !== TASK_STATUS.DONE) {
        $scope.runningMan.icon = "./assets/img/icons/running-man-late.png";
      }

      if ($scope.lateBarInfo.width < minPercent) {
        $scope.lateBarInfo.width = minPercent;
        $scope.inprogressBarInfo.width = 100 - $scope.lateBarInfo.width;
      }

      if ($scope.inprogressBarInfo.show) {
        $scope.inprogressBarInfo.showEndColumn = false;
        //Handle min width
        if ($scope.inprogressBarInfo.width < minPercent) {
          $scope.inprogressBarInfo.width = minPercent;
          $scope.lateBarInfo.width = 100 - $scope.inprogressBarInfo.width;
        }

        $scope.barFooterInfo.leftPosition = $scope.inprogressBarInfo.width * barWidth / 100 - margin;
      } else {
        var minLeftPosition = -2000;
        $scope.barFooterInfo.leftPosition = minLeftPosition;
      }

      var marginRight = 14;
      var runningManWidthValue = runningManWidth - marginRight;
      //$scope.runningMan.marginLeft = barWidth - runningManWidthValue;
      $scope.runningMan.barWidth = 100;

    } else {
      if ($scope.inprogressBarInfo.show) {
        $scope.newBarInfo.showBeginColumn = false;
        //Handle min width
        if ($scope.inprogressBarInfo.width < minPercent) {
          $scope.inprogressBarInfo.width = minPercent;
          $scope.newBarInfo.width = 100 - $scope.inprogressBarInfo.width;
        }

        //Handle min width
        if ($scope.newBarInfo.show && $scope.newBarInfo.width < minPercent) {
          $scope.newBarInfo.width = minPercent;
          $scope.inprogressBarInfo.width = 100 - $scope.newBarInfo.width;
        }

        //Set running man prosition
        var marginRight = 14;
        var runningManWidthValue = runningManWidth - marginRight;
        //$scope.runningMan.marginLeft = barWidth - runningManWidthValue;
        // var runningManWidth = $(".running-man-right").width() - marginRight;
        //$scope.runningMan.marginLeft = $scope.inprogressBarInfo.width * barWidth / 100 - runningManWidthValue;
        $scope.runningMan.barWidth = $scope.inprogressBarInfo.width
      } else {
        $scope.newBarInfo.showBeginColumn = true;
        $(".new-column.begin-bar-column").css("background", "black");
        $scope.runningMan.showRight = false;
      }

      barWidth = $(".task-progress-bar").width() - 2 * margin;
      $scope.barFooterInfo.leftPosition = barWidth;
    }

  }

  /**
   * Calculate percent width for bar
   * @param  {[type]} barPeriod [description]
   * @param  {[type]} totalDate [description]
   * @return {[type]}           [description]
   */
  function barPercentWidth(barPeriod, totalDate) {
    var result = 0;
    if (totalDate > 0) {
      result = (barPeriod / totalDate).toFixed(2);
    }
    return result;
  }

  function processBarInfo(barInfo) {
    if (barInfo.width === 0) {
      barInfo.show = false;
      barInfo.showBeginColumn = false;
      barInfo.showEndColumn = false;
    }
  }

  function processTaskDetailDate() {
    if ($scope.taskDetail.plan_end_date) {
      $scope.taskDetail.plan_end_date = new Date($scope.taskDetail.plan_end_date);
    }
    if ($scope.taskDetail.plan_start_date) {
      $scope.taskDetail.plan_start_date = new Date($scope.taskDetail.plan_start_date);
    }
    if ($scope.taskDetail.real_end_date) {
      $scope.taskDetail.real_end_date = new Date($scope.taskDetail.real_end_date);
    }
    if ($scope.taskDetail.real_start_date) {
      $scope.taskDetail.real_start_date = new Date($scope.taskDetail.real_start_date);
    }
  }

  function handleValidActions(status) {
    var validActions = [];
    switch (status) {
      case TASK_STATUS.NEW:
        validActions = [$scope.action_task.start, $scope.action_task.finish, $scope.action_task.hold, $scope.action_task.cancel];
        break;
      case TASK_STATUS.INPROGERSS:
        validActions = [$scope.action_task.finish, $scope.action_task.hold, $scope.action_task.cancel];
        break;
      case TASK_STATUS.DONE:
        validActions = [$scope.action_task.reopen];
        break;
      case TASK_STATUS.REOPEN:
        validActions = [$scope.action_task.start, $scope.action_task.finish, $scope.action_task.hold, $scope.action_task.cancel];
        break;
      case TASK_STATUS.CANCEL:
        validActions = [$scope.action_task.reopen];
        break;
      case TASK_STATUS.HOLD:
        validActions = [$scope.action_task.reopen, $scope.action_task.finish, $scope.action_task.cancel];
        break;
      default:
    }
    return validActions;
  }

  /**
   * Format comment to display in UI
   * @param  {array} comments Array of comments
   * @return {array}          Array contain comments have formated
   */
  function formatComments(comments, commentsDisplay) {
    commentsDisplay = commentsDisplay ? commentsDisplay : [];
    if (comments) {
      comments.forEach(function(comment) {
        console.log(comment.message);
        if (comment.comment_type === 2) {
          //comment.message = "Báo cáo tuần " + comment.week_number;
          comment.message_report = "Báo cáo tuần " + comment.week_number + "/" + comment.year;
        }
        if (commentsDisplay.length === 0) {
          commentsDisplay.splice(0, 0, createNewCommentItem(comment));
        }
        else {
          for (var index = commentsDisplay.length - 1; index >= 0; index --) {
            var commentDisplay = commentsDisplay[index];
            if (moment(comment.comment_date).isAfter(moment(commentDisplay.date), 'day')) {
              commentsDisplay.splice(index + 1, 0, createNewCommentItem(comment));
              break;
            } else if (moment(comment.comment_date).isSame(moment(commentDisplay.date), 'day')) {
              commentDisplay.comments.push(comment);
              break;
            } else {
              if (index === 0) {
                commentsDisplay.splice(index, 0, createNewCommentItem(comment));
              }
              break;
            }
          }
        }

        // if ((index === 0 && commentsDisplay.length === 0) || index === commentsDisplay.length) {
        //   commentsDisplay.splice(index, 0, createNewCommentItem(comment));
        // } else {
        //   var commentDisplay = commentsDisplay[index];
        //   commentDisplay.comments.push(comment);
        // }
      });
    }
    return commentsDisplay;
  }

  function createNewCommentItem(comment) {
    var result = null;
    if (comment) {
      result = {
        'date': comment.created_at,
        'dateString': moment(comment.comment_date).format("dddd, DD/MM/YYYY"),
        'comments': [comment]
      };
    }
    return result;
  }

  function deleteReportCallback(result, commentId) {
    if (result) {
      var deleteTaskUrl = DELETE_TASK.API + '/' + taskId + "/comments/" + commentId;
      var deleteTask = deleteService.deleteMethod(DELETE_TASK.METHOD, deleteTaskUrl, DELETE_TASK.HEADERS);
      deleteTask.success(function(response) {
        $scope.alerts.push({type: 'success', 'message': 'Xoá báo cáo thành công!'});
        $scope.reloadComments();
      }).error(function(response) {
        if (response) {
          if (response.errors && response.errors.length > 0) {
            $scope.alerts.push({type: 'danger', 'message': response.errors[0].message});
          } else {
            $scope.alerts.push({type: 'danger', 'message': 'Có lỗi xảy ra, vui lòng thử lại!'});
          }
        }
        else {
          $scope.alerts.push({type: 'danger', 'message': 'Không kết nối được tới máy chủ, vui lòng thử lại!'});
        }
      });
    }
  }
}
