'use strict';

// Declare app level module which depends on views, and components
var tamagoApp = angular.module('tamago', [
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    'simplePagination',
    'angular-nicescroll',
    'cm.filter',
    'blockUI',
    '$strap.directives',
    'infinite-scroll'
]);

tamagoApp.config(['$logProvider', '$translateProvider','blockUIConfig','$httpProvider', function($logProvider, $translateProvider,blockUIConfig, $httpProvider) {
    //TODO: Should change parameter of this function to false when deploy to server
    $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('authInterceptor');
    // add translation tables
    $translateProvider.translations('vi', translationsVI);
    $translateProvider.preferredLanguage('vi');
    $translateProvider.fallbackLanguage('vi');
    blockUIConfig.autoBlock = false;
}]);
tamagoApp.run(['$rootScope', '$location', '$state', 'commonValues', function($rootScope, $location, $state, commonValues){
   $rootScope.$on('$stateChangeStart', function(e, toState  , toParams
                                                   , fromState, fromParams) {
      //case loging and go to page login then redirect to list task
      $rootScope.isProjectManager = false;
      if( commonValues.getRole() === 'project_manager' ) {
        $rootScope.isProjectManager = true;
      }
      var token = localStorage.accessToken;
      if(token === undefined){
        $location.path('/login');
      }
      // else{
      //   if(toState.name === 'login'){
      //     e.preventDefault();
      //     $state.go('dashboard/task-list');
      //   }
      // }
  });
  $rootScope.shareData = {
    createTask: false,
    new_task: '',
  }
}]);

tamagoApp.factory('authInterceptor', ['$q', 'commonValues', '$location', '$rootScope', function ($q, commonValues, $location, $rootScope) {
  return {
    responseError: function(rejection) {
      if(rejection.status === 403){
        $location.path('/login');
        return $q.reject(rejection);
      }
      // do something on error
      // if(rejection.status === 403){
      //   var message = res.errors[0].message;
      //   alert(message);
      //   // commonValues.removeAccessToken();
      //   // $location.path('/login');
      // }
      return $q.reject(rejection);
    }
  };
}]);
//var domain = 'http://162.243.14.158:8080/';
//var domain = 'http://172.20.6.15:8080/';
//var domain = 'http://172.20.2.80:8080/';
//var domain = 'http://172.20.6.3:8080/';

var domain = "https://tamago.work:2085/";
//var domain = "https://tamago.work:8090/";
//var domain = "http://localhost:8090/";

var headers = {'Content-Type': 'application/json'};
var APP_INFO = {
  URL: window.location.origin
};
// if (APP_INFO.URL == '172.20.2.80' || APP_INFO.URL == '162.243.14.158') {
//   APP_INFO.URL = APP_INFO.URL +'/tamago';
// }

tamagoApp
.constant('LOGIN', {
  'METHOD': 'POST',
  'API': domain + 'auth/login',
  'HEADERS': headers
})
.constant('LOGOUT', {
  'METHOD': 'GET',
  'API': domain + 'auth/logout',
  'HEADERS': headers
}).constant('TASKS_LIST', {
  'METHOD': 'GET',
  'API': domain + 'tasks',
  'HEADERS': headers
}).constant('TASKS_DETAIL', {
  'METHOD': 'GET',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('PROJECTS_CREATE', {
  'METHOD': 'POST',
  'API': domain + 'projects/',
  'HEADERS': headers
}).constant('PROJECTS_EDIT', {
  'METHOD': 'PUT',
  'API': domain + 'projects/',
  'HEADERS': headers
}).constant('PROJECTS_LIST', {
  'METHOD': 'GET',
  'API': domain + 'projects',
  'HEADERS': headers
}).constant('PROJECTS_DETAIL', {
  'METHOD': 'GET',
  'API': domain + 'projects/',
  'HEADERS': headers
}).constant('PROJECTS_TASK', {
  'METHOD': 'GET',
  'API': domain + 'projects/',
  'HEADERS': headers
}).constant('PROJECTS_MEMBER', {
  'METHOD': 'GET',
  'API': domain + 'projects/',
  'HEADERS': headers
}).constant('GET_COMMENTS', {
  'METHOD': 'GET',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('POST_COMMENTS', {
  'METHOD': 'POST',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('CHILDREN_TASKS', {
  'METHOD': 'GET',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('PUT_PRIORITY', {
  'METHOD': 'PUT',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('GET_USERS', {
  'METHOD': 'GET',
  'API': domain + 'users',
  'HEADERS': headers
}).constant('ADD_DOCUMENT', {
  'METHOD': 'POST',
  'API': domain + 'documents',
  'HEADERS': headers
}).constant('UPDATE_DOCUMENT', {
  'METHOD': 'PUT',
  'API': domain + 'documents/',
  'HEADERS': headers
}).constant('TASK_CREATE', {
  'METHOD': 'POST',
  'API': domain + 'tasks',
  'HEADERS': headers
}).constant('TASK_EDIT', {
  'METHOD': 'PUT',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('GET_DOCUMENT', {
  'METHOD': 'GET',
  'API': domain + 'documents',
  'HEADERS': headers
}).constant('GET_ORG', {
  'METHOD': 'GET',
  'API': domain + 'organizations',
  'HEADERS': headers
}).constant('GET_TASK_TEMPLATES', {
  'METHOD': 'GET',
  'API': domain + 'tasktemplates',
  'HEADERS': headers
}).constant('DELETE_TASK', {
  'METHOD': 'DELETE',
  'API': domain + 'tasks/',
  'HEADERS': headers
}).constant('DEPENDENCY_TASK', {
  'METHOD': 'GET',
  'API': domain,
  'HEADERS': headers
}).constant('GET_DEPENDENCY_TASK', {
  'METHOD': 'GET',
  'API': domain + 'dependencies',
  'HEADERS': headers
}).constant('STORAGE_KEYS', {
  'PROJECT_STAUS_KEY': 'project_status_key',
  'TASK_STAUS_KEY': 'task_status_key',
}).constant('EXPORT_REPORT', {
  'METHOD': 'GET',
  'API': domain + 'export/',
  'HEADERS': headers
});

/// config status and filter
tamagoApp
.constant('LIST_STATUS', {
  recently :{
    icon :'./assets/img/icons/New_96.png',
    name:'Mới nhận',
    id: 0
  },
  working :{
    icon :'./assets/img/icons/inprogress_icn.png',
    name:'Đang làm',
    id: 1
  },
  late :{
    icon :'./assets/img/icons/deadline_icon.png',
    name:'Trễ hạn',
    id: 6
  },
  finish : {
    icon :'./assets/img/icons/Done_icon.png',
    name:'Hoàn thành',
    id: 2
  },
  all: {
    icon :'./assets/img/icons/icn-gridview.png',
    name:'Tất cả',
    id: ''
  }
})
.constant('LIST_SORT',{
  date : {
    icon : './assets/img/icons/icn-start-date.png',
    name : 'Ngày bắt đầu',
    id: 0
  },
  normal : {
    icon : './assets/img/icons/tre_cin.png',
    name : 'Độ ưu tiên',
    id: 1
  },
  lated : {
    icon : './assets/img/icons/deadline_icon.png',
    name : 'Ngày kết thúc',
    id: 2
  }
})
.constant('PROJECT_LIST_SORT',{
  start_date : {
    icon : './assets/img/icons/icn-start-date.png',
    name : 'Ngày bắt đầu',
    id: 0
  },
  name : {
    icon : './assets/img/icons/project_name_icon.png',
    name : 'Tên dự án',
    id: 1
  },
  end_date : {
    icon : './assets/img/icons/deadline_icon.png',
    name : 'Ngày kết thúc',
    id: 2
  }
})
.constant('TASK_STATUS', {
  'NEW': 0,
  'INPROGERSS': 1,
  'DONE': 2,
  'REOPEN': 3,
  'CANCEL': 4,
  'HOLD': 5,
})
.constant('REPORT_ACTION', {
  'VIEW': 0,
  'EDIT': 1,
  'CREATE': 2,
});
