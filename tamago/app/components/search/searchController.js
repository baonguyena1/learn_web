/*
 *---------------------------------------------------------------------------
 * File Name      : searchController.js
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
.controller('searchController', searchController);

searchController.$inject = ['$scope', '$log', '$location', '$timeout', 'Pagination', 'getTasksListService',
 'commonValues', 'TASKS_LIST', 'GET_USERS', 'PROJECTS_LIST', 'GET_DOCUMENT', '$q' ];


/**
 * [searchController description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $log          [description]
 * @param  {[type]} PROJECTS_LIST [description]
 * @return {[type]}               [description]
 */
function searchController($scope, $log, $location, $timeout, Pagination, getTasksListService,
 commonValues, TASKS_LIST, GET_USERS, PROJECTS_LIST, GET_DOCUMENT, $q, $rootScope) {
  $scope.type = '';
  $scope.new_task;
  $scope.new_project;
  $scope.searchResults = [];
  $scope.pages = 0;
  //$scope.getCurrentUrl = fnGetCurrentUrl;
  $scope.loadingMore = true;
  $scope.displayName = commonValues.getUserName();
  $scope.userAvatar  = commonValues.getUserAvatar();
 // $scope.getCurrentUrl();
  var loadfirt = true;
  var totalPages = 0;
  var total = 0; // 21
  var limit = 10;
  var offsetVal;
  $scope.message = {};
  var eventListens = commonValues.getData();
  $scope.resetData = commonValues.removeData();
  if(eventListens.key === 'new-task'){
    $scope.new_task = eventListens.value;
    $scope.createTask = true;
    $scope.message = {
    "type": "success",
    "content": "Tác vụ "+
    "<a class=\"cursor-pointer\" ng-href=\"#/dashboard/tasks/" + $scope.new_task._id +"\">"+
    "<strong>" +$scope.new_task.title+"</strong></a> đã được tạo thành công!"
  }
  }

  $scope.search_result = false;
  fnchangeSection($scope.type);
  $scope.changeSection = fnchangeSection;
  $scope.myKeyword = '';
  $scope.kw = '';
  $scope.$watch('myKeyword', function(Vnew , Vold){
    if(Vnew !== Vold){
      fnchangeSection($scope.type);
    }
  })
  function asyncGreet(type) {
    var deferred = $q.defer();

    setTimeout(function() {
      $scope.searchResults = [];
      deferred.resolve('true');
    },200)
    return deferred.promise;
  }

  function fnchangeSection(type) {
    if(type === $scope.type && $scope.kw === $scope.myKeyword)
       return;
    $scope.kw = $scope.myKeyword;
    $scope.type = type;
    $scope.pages = 0;
    var promise = asyncGreet();
    promise.then(function(){
      switch (type){
        case 'project':
          $scope.currentUrl = '/dashboard/project-list';
          getProjects();
          break;
        case 'work':
          $scope.currentUrl = '/dashboard/task-list';
          getTasks();
          break;
        case 'person':
          $scope.currentUrl = '/dashboard/person';
          getUsers();
          break;
        case 'document':
          $scope.currentUrl = '/dashboard/document';
          getDocuments();
          break;
      }
    });

  };

  /**
   * [Get limit tasks from offset address]
   * @return {[type]} [description]
   */
  function getProjects() {
    $log.debug('get projects00');
     if ($scope.pages == 0) {
        offsetVal = 0;
      } else {
        offsetVal = $scope.pages  * limit;
      }
    var iData = {
          offset: offsetVal,
          limit: limit,
          keyword: $scope.myKeyword,
        };
    var requestSearch = getTasksListService.getTasksList(PROJECTS_LIST.METHOD,
    PROJECTS_LIST.API, iData, PROJECTS_LIST.HEADERS);
    requestSearch.success(function(response) {
          total = response.data.total;
          var searchTemp = [];
          var len = response.data.projects.length;
          for (var i = 0; i < len; i++) {
            $scope.searchResults.push({
                thumbnail: response.data.projects[i].thumbnail?
                response.data.projects[i].thumbnail:'./assets/img/icons/project_img_icon.png',
                name: response.data.projects[i].name,
                link: '#/dashboard/projects/'+ response.data.projects[i]._id+'/thongtin',
                document: false
          });
          }
        }).error(function(response) {
        });
  };

 function getTasks() {
    if ($scope.pages == 0) {
      offsetVal = 0;
    } else {
      offsetVal = $scope.pages * limit;
    }
    var iData = {
        project: '',
        user:'',
        orderby: '',
        offset: offsetVal,
        limit: limit,
        keyword: $scope.myKeyword
      };
    var request = getTasksListService.getTasksList(TASKS_LIST.METHOD,
    TASKS_LIST.API, iData, TASKS_LIST.HEADERS);
    request.success(function(response) {
    var len = response.data.tasks.length;
      for (var i = 0; i < len; i++) {
        $scope.searchResults.push({
            thumbnail: response.data.tasks[i].owner.avatar,
            name: response.data.tasks[i].title,
            link: '#/dashboard/tasks/'+response.data.tasks[i]._id,
            document: false
      });
    }
    }).error(function(response) {
    });
  };

 function getUsers() {
    if ($scope.pages == 0) {
      offsetVal = 0;
    } else {
      offsetVal = $scope.pages * limit;
    }
    var iData = {
        offset: offsetVal,
        limit: limit,
        keyword: $scope.myKeyword
      };
    var request = getTasksListService.getTasksList(GET_USERS.METHOD,
    GET_USERS.API, iData, GET_USERS.HEADERS);
    request.success(function(response) {
          var len = response.data.users.length;
          for (var i = 0; i < len; i++) {
            var name = [];
            name.push(response.data.users[i].last_name || '');
            name.push(response.data.users[i].middle_name || '');
            name.push(response.data.users[i].first_name || '');
            $scope.searchResults.push({
                thumbnail: response.data.users[i].avatar,
                name:  name.join(' '),
                id: response.data.users[i]._id,
                document: false
            });

          }
       // }
    }).error(function(response) {

    });
  };

	function getDocuments() {
    if ($scope.pages == 0) {
      offsetVal = 0;
    } else {
      offsetVal = $scope.pages * limit;
    }
    var iData = {
        offset: offsetVal,
        limit: limit,
        keyword: $scope.myKeyword
      };
    var request = getTasksListService.getTasksList(GET_DOCUMENT.METHOD,
    GET_DOCUMENT.API, iData, GET_DOCUMENT.HEADERS);
    request.success(function(response) {
          var len = response.data.documents.length;
          var documents = response.data.documents;
          for (var i = 0; i < len; i++) {
            var imageDocument = "";
            switch (documents[i].type) {
              case 0:
                imageDocument = "in_document.png";
                break;
              case 1:
                imageDocument = "out_document.png";
                break;
              case 2:
                imageDocument = "output_document.png";
                break;
              default:

            }
            $scope.searchResults.push({
                thumbnail: 'assets/img/icons/' + imageDocument,
                name:  documents[i].document_number,
                link: '',
                document: true,
                data: documents[i]
            });
        }
    }).error(function(response) {

    });
  };

  function fnGetCurrentUrl(){
    $scope.currentUrl  = $location.path();
    if ($scope.currentUrl.includes('/dashboard/project-list', 0) || $scope.currentUrl.includes('/dashboard/projects', 0)){
        $scope.type = 'project';
        $scope.searchResults = [];
        getProjects();
    } else {
        $scope.type = 'work';
        $scope.searchResults = [];
        getTasks();
    }
  }
  $scope.loadMore = function(){
    $scope.loadingMore = false;
    $scope.pages++;
    switch($scope.type){
      case 'project':
        getProjects();
      break;
      case 'work':
        getTasks();
      break;
      case 'person':
        getUsers();
      break;
      case 'document':
        getDocuments();
      break;
    }
  }

  $scope.pressSearch = function() {
    $scope.display = $('.search-results').css('display');
    if ($scope.display === 'none') {
      fnGetCurrentUrl();
    }
    $scope.mystyle = {
      'display': 'block'
    };
  };


}
