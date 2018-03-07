tamagoApp.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$scope', '$rootScope', '$log', '$uibModalInstance', 'Pagination',
  'postCommonService', 'ADD_DOCUMENT', 'projectId', 'selectedMember', 'type', 'taskId', 'parentId', 'selectedOrgs', 'selectedDependencyTasks',
   'PROJECTS_MEMBER', 'PUT_PRIORITY', 'GET_ORG', 'GET_DEPENDENCY_TASK', 'getTasksListService']
function ModalInstanceCtrl($scope, $rootScope, $log, $uibModalInstance, Pagination,
  postCommonService, ADD_DOCUMENT, projectId, selectedMember, type, taskId, parentId, selectedOrgs, selectedDependencyTasks,
   PROJECTS_MEMBER, PUT_PRIORITY, GET_ORG, GET_DEPENDENCY_TASK, getTasksListService) {
  // init var
  var $ctrl = this;
  $ctrl.selected = null;
  $ctrl.selectedOwner = selectedMember;
  $ctrl.selectedMember = selectedMember;
  $ctrl.selectOrg = fnSelectOrg;
  $ctrl.selectDepenTasks = fnSelectDepenTasks;
  $ctrl.selectMember = _fnClickSelectMember;
  $ctrl.projectMembers = _fnGetProjectMembers;
  $ctrl.getListOrg = _fnGetOrganization;
  $ctrl.getDependencyTasks = _fnGetDependencyTasks;
  $ctrl.idProject = projectId;
  $ctrl.membersProject = [];
  $ctrl.organizations = [];
  $ctrl.dependenciesTasks = [];
  $ctrl.type = type;
  $ctrl.isSelected = fnIsSelected;
  $ctrl.isSelectedDepenTask = fnIsSelectedDepenTask;
  $ctrl.updatePriorityUrl = PUT_PRIORITY.API + taskId;
  $ctrl.getParams = fnGetParam;
  $ctrl.getParamsDependency = fnGetParamsDependency;
  $ctrl.selectedOrg = selectedOrgs;
  $scope.selectedDepenTaskOrg = angular.copy(selectedDependencyTasks);
  $ctrl.selectedDepenTask = selectedDependencyTasks;
  $ctrl.doSearch = fnDoSearch;
   /*pagination*/
  $ctrl.limit = 5;
  var pageInfo = Pagination.getNew($ctrl.limit);

  $ctrl.currentPage = 0;
  //event listing
  $ctrl.ok = _fnClickBtnOk;
  $ctrl.completeSuper = _fnClickBtnComplete;
  $ctrl.getListItem = _fnGetListItem;

  $ctrl.getListItem();

  function _fnGetListItem() {
    if ($ctrl.type == 'supervisor') {
      $ctrl.modalTitle = 'Chọn người giám sát';
      $ctrl.pageChanged = fnPageChangedUsers;
      $ctrl.projectMembers();
    } else if ($ctrl.type == 'assignee') {
      $ctrl.modalTitle = 'Chọn người thực hiện';
      $ctrl.pageChanged = fnPageChangedUsers;
      $ctrl.projectMembers();
    } else if ($ctrl.type == 'assigner') {
      $ctrl.modalTitle = 'Chọn người giao việc';
      $ctrl.pageChanged = fnPageChangedUsers;
      $ctrl.projectMembers();
    }else if ($ctrl.type == 'organization') {
      $ctrl.pageChanged = fnPageChangedOrg;
      $ctrl.modalTitle = 'Danh sách cơ quan';
       $ctrl.getListOrg();
    }else if ($ctrl.type == 'dependency_main_task' ||
              $ctrl.type == 'dependency_sub_task'  ||
              $ctrl.type == 'dependency_update_task' ) {
      $ctrl.pageChanged = fnPageChangedDepenTask;
      $ctrl.modalTitle = 'Chọn công việc phụ thuộc';
      $ctrl.getDependencyTasks();
    }
  }

  //$ctrl.saveDocument = _fnSaveDocument;
  function _fnGetProjectMembers() {
    var getProjectMemberUrl =  PROJECTS_MEMBER.API + projectId + '/members';
    var getProjectMember    =  getTasksListService.getTasksList(PROJECTS_MEMBER.METHOD,
    getProjectMemberUrl, $ctrl.getParams(), PROJECTS_MEMBER.HEADERS);
    getProjectMember.success(function(response) {
      $log.debug('projectMembers: ');
      $log.debug(response);
      $ctrl.membersProject = response.data.users;
      $ctrl.totalItems   = response.data.total;
      $ctrl.currentPage  = pageInfo.page;
      $ctrl.numPages = Math.ceil(response.data.total / pageInfo.perPage);
      $ctrl.perPage = pageInfo.perPage;
      //if ($ctrl.selectedMember) {
      if ($ctrl.selectedOwner) {
        $.each($ctrl.membersProject, function(k, v) {
          if ($ctrl.membersProject[k]._id === $ctrl.selectedOwner._id) {
            $ctrl.membersProject[k].is_selected = true;
            return;
          }
        });
      }
    }).error(function(response) {

    });
  }
  function _fnGetOrganization(){
    var getOrg   =  getTasksListService.getTasksList(GET_ORG.METHOD,
    GET_ORG.API, $ctrl.getParams(), GET_ORG.HEADERS);
    getOrg.success(function(response) {
      $ctrl.organizations = response.data.organizations;
      $ctrl.total_user = response.data.total;
      $ctrl.totalItems   = response.data.total;
      $ctrl.currentPage  = pageInfo.page;
      $ctrl.numPages = Math.ceil(response.data.total / pageInfo.perPage);
      $ctrl.perPage = pageInfo.perPage;
    }).error(function(response) {

    });
  }
  function  _fnGetDependencyTasks(){

    var getDependencyTasksUrl = GET_DEPENDENCY_TASK.API;
    if (parentId) {
      getDependencyTasksUrl += '?parent=' + parentId;
    }
    else {
      if (taskId) {
          getDependencyTasksUrl += '?task=' + taskId;
      }
      else {
        getDependencyTasksUrl += '?project=' + projectId;
      }
    }

    //var getDependencyTasksUrl = DEPENDENCY_TASK.API + '/' + taskId +'/dependencies'
    var getDependencyTasks    =  getTasksListService.getTasksList(GET_DEPENDENCY_TASK.METHOD,
    getDependencyTasksUrl, $ctrl.getParamsDependency(), GET_DEPENDENCY_TASK.HEADERS);

    getDependencyTasks.success(function(response) {
        $ctrl.dependenciesTasks = response.data.tasks;
        $log.debug($ctrl.dependenciesTasks);
        $ctrl.total_user = response.data.total;
        $ctrl.totalItems   = response.data.total;
        $ctrl.currentPage  = pageInfo.page;
        $ctrl.numPages = Math.ceil(response.data.total / pageInfo.perPage);
        $ctrl.perPage = pageInfo.perPage;
    }).error(function(response) {
        $log.debug(response);
    });
  }
  function fnGetParam(){
    return {
      keyword : $ctrl.keyword,
      limit : $ctrl.limit,
      offset : $ctrl.currentPage == 0 ? 0 :  (($ctrl.currentPage -1 ) * $ctrl.limit)
    };
  }
  function fnGetParamsDependency(typeTask){
    if (typeTask === 'dependency_main_task'){
      $log.debug('depent main task');
        return {
          keyword : $ctrl.keyword,
          limit : $ctrl.limit,
          offset : $ctrl.currentPage == 0 ? 0 :  (($ctrl.currentPage -1 ) * $ctrl.limit),
          project: projectId
        };
    } else if (typeTask === 'dependency_sub_task'){
      $log.debug('depent sub task');
        return {
          keyword : $ctrl.keyword,
          limit : $ctrl.limit,
          offset : $ctrl.currentPage == 0 ? 0 :  (($ctrl.currentPage -1 ) * $ctrl.limit),
          parent: taskId
        };
    } else if (typeTask === 'dependency_update_task'){
        return {
          keyword : $ctrl.keyword,
          limit : $ctrl.limit,
          offset : $ctrl.currentPage == 0 ? 0 :  (($ctrl.currentPage -1 ) * $ctrl.limit),
          task: taskId
        };
    }
  }
   function fnPageChangedUsers() {
    pageInfo.toPageId($ctrl.currentPage);
    $ctrl.projectMembers();
  }
   function fnPageChangedOrg(){
    pageInfo.toPageId($ctrl.currentPage);
    $ctrl.getListOrg();
  }
  function fnPageChangedDepenTask(){
    pageInfo.toPageId($ctrl.currentPage);
    $ctrl.getDependencyTasks();
  }
   function fnDoSearch(){
    $ctrl.currentPage = 0;
    //$ctrl.getListOrg();
    $ctrl.getListItem();
  }
  ////////////////////////////////////
  /*handel when click btn OK*/
  function _fnClickBtnOk() {
    $uibModalInstance.dismiss('cancel');
  };

  /*click select member function*/
  function _fnClickSelectMember(member) {

    $ctrl.selectedOwner  = member;
    $.each($ctrl.membersProject, function(k, v) {
      $ctrl.membersProject[k].is_selected = false;
    });
    member.is_selected = true;

  }
  /*handel when click btn cancel*/
  function _fnClickBtnComplete() {
    //close modal
    $scope.assignee = $ctrl.selectedOwner;
    $log.debug($scope.assignee);
    if ($ctrl.type == 'supervisor') {
      $rootScope.$broadcast('selected-owner', $ctrl.selectedOwner);
    } else if ($ctrl.type == 'assignee') {
      $rootScope.$broadcast('selected-assign', $ctrl.selectedOwner);
    } else if ($ctrl.type == 'assigner') {

      $ctrl.ownerId = $ctrl.selectedOwner ? $ctrl.selectedOwner._id : '';
      var dataAssignTask = {
          owner: $ctrl.ownerId
        };
      var assignTaskRequest = postCommonService.postMethod(PUT_PRIORITY.METHOD,
              $ctrl.updatePriorityUrl, dataAssignTask, PUT_PRIORITY.HEADERS);

      assignTaskRequest.success(function(response) {
          $rootScope.$broadcast('selected-assign-work', $ctrl.selectedOwner);
          $uibModalInstance.dismiss('cancel');
        }).error(function(response) {
          $rootScope.$broadcast('selected-assign-work', false);
          $uibModalInstance.dismiss('cancel');
        });
    }
    $uibModalInstance.dismiss('cancel');
  };
   $ctrl.showOrg = function(u){
    $ctrl.check = true;
    //case compare member
    if(type === 'viewer'){
      //console.log($ctrl.member)
      $.each($ctrl.member, function(k ,v){
        if(v === u._id){
          $ctrl.check = false;
          return;
        }
      })
    }else{
       $.each($ctrl.viewer, function(k ,v){
        if(v === u._id){
          $ctrl.check = false;
          return;
        }
      })
    }
    return $ctrl.check;
  }
   $ctrl.showDependencyTasks = function(u){
    $ctrl.check = true;
    $.each($ctrl.dependenciesTasks, function(k ,v){
      if(v === u._id){
        $ctrl.check = false;
        return;
      }
    })
    return $ctrl.check;
  }

  /*handel select user*/
  function fnSelectOrg(org){
    var index = $ctrl.selectedOrg.indexOf(org._id);
    var index_org = $ctrl.organizations.indexOf(org);
    if (index > -1) {
      $ctrl.selectedOrg.splice(index, 1);
      $ctrl.organizations[index_org].is_selected = false;
    }else{
      $ctrl.selectedOrg.push(org._id);
      $ctrl.organizations[index_org].is_selected = true;
    }
  }
   function fnSelectDepenTasks(task){
    var index = $ctrl.selectedDepenTask.indexOf (task._id);
    var index_task = $ctrl.dependenciesTasks.indexOf(task);
    if (index > -1) {
      $ctrl.selectedDepenTask.splice(index, 1);
      $ctrl.dependenciesTasks[index_task].is_selected = false;
    }else{
      $ctrl.selectedDepenTask.push(task._id);
      $ctrl.dependenciesTasks[index_task].is_selected = true;
    }
  }
   /*is selected users*/
  function fnIsSelected(org){
    if(!org) return false;
    var index = $ctrl.selectedOrg.indexOf(org._id);
    if(index > -1) {
      return true;
    }
    return false;
  }
    /*is selected users*/
  function fnIsSelectedDepenTask(task){
    if(!task) return false;
    var index = $ctrl.selectedDepenTask.indexOf(task._id);
    if(index > -1) {
      return true;
    }
    return false;
  }
}
