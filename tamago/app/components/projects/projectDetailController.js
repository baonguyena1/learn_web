/*
 *---------------------------------------------------------------------------
 * File Name      : projectDetailController.js
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
.controller('projectDetailController', ['$scope', '$stateParams', '$log', '$location', 'Pagination', 'commonValues',
                                         'getCommonService', 'getTasksListService', 'PROJECTS_DETAIL',
                                         'PROJECTS_TASK', 'blockUI','blockUIConfig', '$uibModal','postCommonService','$timeout', projectDetailController]);

/**
 * [Get detail information of project]
 * @param  {[Object]} $scope             [The application object]
 * @param  {[Object]} $stateParams       [The application object]
 * @param  {[Object]} $log               [The application object]
 * @param  {[Object]} $location          [This service provides methods for parsing and changing the URL in the browser's address bar]
 * @param  {[Function]} getCommonService [Common service]
 * @param  {[Constant]} PROJECTS_DETAIL  [Defined constant project detail]
 * @return {[type]}                      [None]
 */
function projectDetailController($scope, $stateParams, $log, $location, Pagination, commonValues,
                                   getCommonService, getTasksListService, PROJECTS_DETAIL,
                                   PROJECTS_TASK, blockUI, blockUIConfig, $uibModal, postCommonService, $timeout) {
  var projectId  = $stateParams.idProject;
  var projectUrl = PROJECTS_DETAIL.API + projectId;
  var projectTaskUrl = PROJECTS_TASK.API + projectId + '/tasks';
  var projectDocUrl = PROJECTS_DETAIL.API + projectId + '/documents';
  $scope.getParam = fnGetParam;
  $scope.getTaskProject = fnGetTaskProject;
  $scope.pageInfo = Pagination.getNew(2);

  $scope.noData = false;
  $scope.projectId = projectId;
  $scope.name_owners = '';
  $scope.position_name = '';
  $scope.type = 'project';
  $scope.currentPage = 0;
  $scope.currentTab = $stateParams.nameTab ? $stateParams.nameTab : 'thongtin';
  $scope.canCreateMainTask = commonValues.getCanCreateMainTask();

  $scope.$on('$viewContentLoaded', function(){
    blockUI.start({message: 'Đang tải dữ liệu...'});

    $scope.getTaskProject();

    var request = getCommonService.getMethod(PROJECTS_DETAIL.METHOD, projectUrl, PROJECTS_DETAIL.HEADERS);

    request.success(function(response) {
      blockUI.stop();
      $scope.projectInfomation = response.data;
      $log.debug($scope.projectInfomation);
      if ($scope.projectInfomation.length == 0) {
        $scope.noData = true;
      }
      $scope.percentComplete = $scope.projectInfomation.percent_completed;
      $scope.projectInfomation.percentComplete =  $scope.percentComplete;
      var labelWidth = $('.name-project-manager').width();

      var tmpName = [];
      tmpName.push($scope.projectInfomation.owner.last_name);
      tmpName.push($scope.projectInfomation.owner.middle_name);
      tmpName.push($scope.projectInfomation.owner.first_name);

      var nameLength = tmpName.join(' ').length;

      var name = [];
      name.push($scope.projectInfomation.owner.last_name);
      if (nameLength * 8 > labelWidth) {
        name.push($scope.projectInfomation.owner.middle_name[0] + '.');
      } else {
        name.push($scope.projectInfomation.owner.middle_name);
      }
      name.push($scope.projectInfomation.owner.first_name);

      $scope.name_owners = name.join(' ');

      // ($scope.projectInfomation.owner.position.name.length > labelWidth) ? '...':'';
      $scope.position_name = $scope.projectInfomation.owner.position.name;
      $scope.positionNameLength = (labelWidth / 8) - 3;

    }).error(function(response) {
      $log.debug(response);
      blockUI.stop();
      $location.path('/login');
    });

  });

  $scope.openConfirmBoxCancelProject = function( projectId ) {
    $uibModal.open( {
      templateUrl: 'app/shared/layout/confirm-dialog.html',
      controller: 'ConfirmDialogController',
      resolve: {
        callback: function() {
          return cancelPojectCallback;
        },
        data: function() {
          return {
            title: "Sunware",
            body: "Bạn có muốn hủy dự án này?",
            extra: projectId
          };
        }
      }
    } );
  };

  function cancelPojectCallback( result, projectId ) {
    if( result ) {
      var requestCancelUrl = PROJECTS_DETAIL.API + projectId;
      var valueRequest = {
        description: 'do some thing'
      };
      var request = postCommonService.postMethod( 'PUT', requestCancelUrl, valueRequest );
      request.success( function( ) {
        $scope.alertsMsg = {
          type: 'success',
          message: 'Hủy dự án thành công!'
        };
      } ).error( function() {
        $scope.alertsMsg = {
            type: 'danger',
            message: 'Không thể hủy dự án vui lòng kiểm tra lại!'
        };
      } );
      $timeout( function() {
        $scope.alertsMsg = null;
      }, 1000 );
    }
  }
  /**
   * [Start tab in show project task]
   * @type {Array}
   */
  $scope.projectTabs = [{
        title: 'Tác vụ',
        icon: './assets/img/icons/icn-choose-major-task.png',
        icon_highlight: './assets/img/icons/icn-Task-detail-highlight-tab.png',
        url: 'tacvu'
      },
      {
        title: 'Thông tin',
        icon: './assets/img/icons/icn-information-tab.png',
        icon_highlight: './assets/img/icons/icn-information-highlight-tab.png',
        url: 'thongtin'
      },
      {
        title: 'Công văn',
        icon: './assets/img/icons/icn-paragraph-tab.png',
        icon_highlight: './assets/img/icons/icn-paragraph-highlight-tab.png',
        url: 'vanban'
      }
      ];

  $scope.onClickTab = function(tab) {
    $scope.currentTab = tab.url;
  };

  $scope.isActiveTab = function(tabUrl) {
    return tabUrl == $scope.currentTab;
  };

  $scope.currentIcon = function(tab) {
      if ($scope.isActiveTab(tab.url)) {
        return tab.icon_highlight;
      } else {
        return tab.icon;
      }
    };

  function fnGetTaskProject() {
    var taskProjectRequest = getTasksListService.getTasksList(PROJECTS_TASK.METHOD, projectTaskUrl, $scope.getParam(), PROJECTS_TASK.HEADERS);
    taskProjectRequest.success(function(response) {
      $scope.tasksProject = response.data.tasks;
      $scope.totalItems   = response.data.total;
      $scope.numPages = Math.ceil(response.data.total / $scope.pageInfo.perPage);
      $scope.perPage = $scope.pageInfo.perPage;
    }).error(function(response) {
      $log.debug(response);
    });
  };
  $scope.pageChanged = function() {
    $scope.pageInfo.toPageId($scope.currentPage);
    $scope.getTaskProject();
  };

  function fnGetParam() {
    if ($scope.currentPage == 0) {
      $scope.offsetVal = 0;
    } else {
      $scope.offsetVal = ($scope.currentPage - 1) * $scope.pageInfo.perPage;
    }
    var iData = {
        offset: $scope.offsetVal,
        limit: $scope.pageInfo.perPage
      };
    return iData;
  };
  /**
   * [End tab in show project task]
   * @type {[type]}
   */


  /*open modal*/
  $scope.animationsEnabled = true;
  $scope.open = function(size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'app/shared/layout/add-document.html',
      controller: 'ModalAddDocumentCtrl',
      controllerAs: '$ctrl',
      size: size,
      resolve: {
        items: function() {
          return projectId;
        },
        documentFor: function() {
          return 0;
        },
        documents: function() {
          return 0;
        },
        method: function() {
          return 'add';
        },
        data: function() {
          return {};
        }
      }
    });
  };
};

tamagoApp.controller('ModalAddDocumentCtrl', ModalAddDocumentCtrl);
ModalAddDocumentCtrl.$inject = ['$uibModalInstance', '$log', '$uibModal', '$rootScope', '$scope', 'postCommonService', 'ADD_DOCUMENT', 'UPDATE_DOCUMENT', 'items', 'documentFor', 'documents', 'method', 'data'];
function ModalAddDocumentCtrl($uibModalInstance, $log, $uibModal, $rootScope, $scope, postCommonService, ADD_DOCUMENT, UPDATE_DOCUMENT, items, documentFor, documents, method, data) {
  // init var
  var $ctrl = this;
  $scope.addFor =  documentFor;
  $ctrl.method = method;
  $ctrl.projec_id = items;
  $ctrl.iUrl = ADD_DOCUMENT.API + '?object_type=' + $scope.addFor + '&object_id=' + $ctrl.projec_id;
  $ctrl.type = '1';
  $ctrl.submiting = false;
  $scope.error = false;
  $scope.organizations = data.organization ? [data.organization] : [];
  if (method == 'edit') {
    $ctrl.document_number = data.document_number;
    $ctrl.issuer = data.issuer;
    $ctrl.description = data.description;
    $ctrl.type = data.type;
    $ctrl.objectType = data.object_type;
    $ctrl.publish_date = data.publish_date;

  }
  if (method == 'show') {
    $ctrl.document_number = data.document_number;
    $ctrl.issuer = data.issuer;
    $ctrl.description = data.description;
    $ctrl.type = data.type;
    $ctrl.publish_date = data.publish_date;
    $ctrl.organization = data.organization;
    $ctrl.objectType = data.object_type;
    $ctrl.types = [
      {
        name: 'Công văn đến',
        value: 0
      },{
        name: 'Công văn đi',
        value: 1
      }
    ];
  }
  //event listing
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.cancel = _fnClickBtnCancel;
  $ctrl.listFiles = [];

  /*Start select publish date*/
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

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.organizationName = function () {
    var name = "Chọn cơ quan";
    if ($scope.organizations && $scope.organizations.length > 0) {
      name = $scope.organizations[0].name;
    }
    else {
      if ($ctrl.issuer) {
        name = $ctrl.issuer;
      }
    }
    return name;
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    showWeeks: false,
    formatYear: 'yy',
    startingDay: 1
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
            return false;
          },
          selectedItems: function() {
            console.log($scope.organizations);
            return $scope.organizations;
          },
          extraData: function() {
            return null;
          }
        }
      });
    };

  // Disable weekend selection
  function disabled(data) {
    // var date = data.date,
    //   mode = data.mode;
    // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.projectNameChanged = function() {
    $scope.error = false;
  };

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

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  $scope.animationsEnabled = true;
  /*End select publish date*/

  ////////////////////////////////////
  /*handel when click btn OK*/
  function _fnClickBtnOk() {
    //disable btn submit
    $ctrl.submiting = true;
    $scope.error = false;
    //set cursor is wait
    $('body').css('cursor', 'wait');

    var organizationId = null;
    var issuerValue = null;
    if ($scope.organizations && $scope.organizations.length > 0) {
      organizationId = $scope.organizations[0]._id;
      issuerValue = $scope.organizations[0].name;
    }
    //set data
    var iData = {
      issuer: $ctrl.issuer ? $ctrl.issuer : issuerValue,
      description: $ctrl.description,
      document_number: $ctrl.document_number,
      publish_date: $ctrl.publish_date,
      type: parseInt($ctrl.type),
      organization: organizationId,
      owner: ''
    };
    if (method === 'edit') {
      $ctrl.iUrl = UPDATE_DOCUMENT.API + data._id;
      var postService = postCommonService.postMethod(UPDATE_DOCUMENT.METHOD, $ctrl.iUrl , iData, UPDATE_DOCUMENT.HEADERS);
      postService.success(function(response) {
        //enable btn submit
        $ctrl.submiting = false;
        //set cursor is pointer
        $('body').css('cursor', 'pointer');

        //close modal
        $uibModalInstance.dismiss('cancel');
        $rootScope.$broadcast('reload-list-document');
      }).error(function(response) {
        $('body').css('cursor', 'pointer');
        $ctrl.submiting = false;
        console.log("error add document");
        handleErrorResponse(response);
      });
    } else {
      var postService = postCommonService.postMethod(ADD_DOCUMENT.METHOD, $ctrl.iUrl, iData, ADD_DOCUMENT.HEADERS);
      postService.success(function(response) {
        //enable btn submit
        $ctrl.submiting = false;
        //set cursor is pointer
        $('body').css('cursor', 'pointer');

        //close modal
        $uibModalInstance.dismiss('cancel');
        $rootScope.$broadcast('reload-list-document');
      }).error(function(response) {
        $('body').css('cursor', 'pointer');
        $ctrl.submiting = false;
        handleErrorResponse(response);
        $log.debug(response);

      });
      //}
    }
  };

  function handleErrorResponse(response) {
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
    $('body').css('cursor', 'normal');

  }

  /*handel when click btn cancel*/
  function _fnClickBtnCancel() {
    //close modal
    $uibModalInstance.dismiss('cancel');
  };
}

tamagoApp.controller('DocumentController', DocumentController);
DocumentController.$inject = ['$scope', '$stateParams', '$log', '$location', 'Pagination',
                                   'getCommonService', 'getTasksListService', 'PROJECTS_DETAIL',
                                   'PROJECTS_TASK', 'TASKS_DETAIL', 'blockUI', 'blockUIConfig', '$uibModal'];
function DocumentController($scope, $stateParams, $log, $location, Pagination,
                                   getCommonService, getTasksListService, PROJECTS_DETAIL,
                                   PROJECTS_TASK, TASKS_DETAIL, blockUI, blockUIConfig, $uibModal) {
  $scope.documentUrl = '';
  switch ($scope.type){
    case 'task':
      $scope.documentUrl = TASKS_DETAIL.API + $scope.taskId + '/documents';;
    break;
    case 'project':
      $scope.documentUrl = PROJECTS_TASK.API + $scope.projectId  + '/documents';
    break;
  }

  /*List document*/
  $scope.pageInfoDoc = Pagination.getNew(2);
  $scope.getGetDocuments = fnGeDocuments;
  $scope.getGetDocuments();
  $scope.offsetVal = 0;
  $scope.error = false;

  function fnGeDocuments() {
    blockUI.start({message: 'Đang tải dữ liệu...'});
    var getService = getTasksListService.getTasksList(PROJECTS_DETAIL.METHOD, $scope.documentUrl , fnGetParamDoc() , PROJECTS_DETAIL.HEADERS);
    getService.success(function(response) {

      $scope.documentList = response.data.documents;
      $log.debug($scope.documentList);

      $log.debug(response);
      $scope.totalDocs = response.data.total;
      blockUI.stop();
    }).error(function() {
      blockUI.stop();

    });
  };

  $scope.pageChangedDoc = function() {
    $scope.pageInfoDoc.toPageId($scope.pageInfoDoc.page);
    $scope.getGetDocuments();
  };

  $scope.$on('reload-list-document', function() {
    $scope.getGetDocuments();
  });

  /**/
  function fnGetParamDoc() {
    if ($scope.pageInfoDoc.page == 0) {
      $scope.offsetVal = 0;
    } else {
      $scope.offsetVal = ($scope.pageInfoDoc.page - 1) * $scope.pageInfoDoc.perPage;
    }
    var iData = {
        offset: $scope.offsetVal,
        limit: $scope.pageInfoDoc.perPage
      };
    return iData;
  }
  /**/
}
