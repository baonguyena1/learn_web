/*
 *---------------------------------------------------------------------------
 * File Name      : projectListController.js
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

tamagoApp.controller('projectInfoController', projectInfoController);

projectInfoController.$inject = ['$scope', '$log', '$uibModal', 'Pagination', 'getTasksListService', 'commonValues',
                                  'PROJECTS_LIST', 'blockUI','blockUIConfig','LIST_STATUS','PROJECT_LIST_SORT'];

function projectInfoController($scope, $log, $uibModal, Pagination, getTasksListService, commonValues, PROJECTS_LIST,
                              blockUI, blockUIConfig, LIST_STATUS, LIST_SORT) {
    $scope.openBox = function(type_box, projectId) {
          var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/shared/layout/box-task-list-project.html',
          controller: 'ModalTasksCtrl',
          controllerAs: '$ctrl',
          resolve: {
            projectId: function() {
                return projectId;
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
              }
          }
        });
        };
}
tamagoApp.controller('ModalTasksCtrl', ModalTasksCtrl);

function ModalTasksCtrl($scope, $rootScope, $log, $uibModalInstance,
  postCommonService, ADD_DOCUMENT, projectId, selectedMember, type,
  taskId, blockUI, PROJECTS_TASK, PUT_PRIORITY, getTasksListService) {
  // init var
  var $ctrl = this;
  $ctrl.getParam = fnGetParam;
  $ctrl.getTasksProject = _fnGetTasksProject;
  $ctrl.getTasksProject();
  $ctrl.idProject = projectId;
  $ctrl.membersProject = [];
  $ctrl.type = type;
  $ctrl.statusPopup;
  //event listing
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.completeSuper = _fnClickBtnComplete;
  if ($ctrl.type == 6) {
    $ctrl.modalTitle = 'Tác vụ đang trễ';
  } else if ($ctrl.type == 2) {
    $ctrl.modalTitle = 'Tác vụ đã hoàn thành';
  } else if ($ctrl.type == 0) {
    $ctrl.modalTitle = 'Tác vụ mới';
  }
  //$ctrl.saveDocument = _fnSaveDocument;
  $log.debug($ctrl.idProject);
  var dataProjectMember = {
            keyword: ''
          };

  $rootScope.$on('hiden-popup', function(event, args){
    $ctrl.statusPopup = args;
  });
  if ($ctrl.statusPopup){
     $uibModalInstance.dismiss('cancel');
  }
  console.log('status popup : ' + $ctrl.statusPopup);
  function _fnGetTasksProject() {
    blockUI.start("Đang xử lý ...");
    $ctrl.tasksProjectUrl =  PROJECTS_TASK.API + projectId + '/tasks';
    $log.debug($ctrl.getParam());
    var tasksProject  =  getTasksListService.getTasksList(PROJECTS_TASK.METHOD,
    $ctrl.tasksProjectUrl, $ctrl.getParam(), PROJECTS_TASK.HEADERS);

    tasksProject.success(function(response) {
      blockUI.stop();
      $ctrl.tasksProject = response.data.tasks;
      // if ($ctrl.selectedMember) {
      //   $.each($ctrl.membersProject, function(k, v) {
      //     if ($ctrl.membersProject[k]._id === $ctrl.selectedMember._id) {
      //       $ctrl.membersProject[k].is_selected = true;
      //       return;
      //     }
      //   });
      // }

    }).error(function(response) {
      blockUI.stop();
      $log.debug('error');
    });
  }

  function fnGetParam() {
    var iData = {
        status: type,
        offset: 0,
        //limit: 10
      };
    return iData;
  };
  ////////////////////////////////////
  /*handel when click btn OK*/
  function _fnClickBtnOk() {
    $uibModalInstance.dismiss('cancel');
  };

  /*click select member function*/
  function _fnClickSelectMember(member) {
  }
  /*handel when click btn cancel*/
  function _fnClickBtnComplete() {
    $uibModalInstance.dismiss('cancel');
  };
}
