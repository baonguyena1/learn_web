/**
 * Route base on url
 */

tamagoApp.config( [ '$stateProvider', '$urlRouterProvider', function ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/login' );
  $stateProvider
    .state( 'base', {
      abstract: true,
      url: '',
      templateUrl: 'app/shared/layout/base.html'
    } )
    .state( 'login', {
      url: '/login',
      parent: 'base',
      templateUrl: 'app/components/auth/login.html',
      controller: 'loginController'
    } )
    .state( 'dashboard', {
      url: '/dashboard',
      parent: 'base',
      templateUrl: 'app/shared/layout/dashboard.html',
      controller: 'searchController'
    } )

    //project
    .state( 'project', {
      url: '/dashboard',
      templateUrl: 'app/shared/layout/dashboard.html',
      controller: 'searchController'
    } )
    .state( 'dashboard.project-list', {
      url: '/project-list',
      parent: 'project',
      templateUrl: 'app/components/projects/projects-list.html',
      controller: 'projectListController'
    } )
    .state( 'dashboard.project-infomation', {
      url: '/projects/:idProject/:nameTab',
      parent: 'project',
      templateUrl: 'app/components/projects/show-project-information.html',
      controller: 'projectDetailController'
    } )
    .state( 'dashboard.create-project', {
      url: '/create-project',
      parent: 'project',
      templateUrl: 'app/components/projects/create-new-project.html',
    } )
    .state( 'dashboard.project-create', {
      url: '/project-create',
      parent: 'project',
      templateUrl: 'app/components/projects/project-create.html',
      controller: 'projectCreateController'
    } )
    .state( 'dashboard.edit-project', {
      url: '/edit-project/:idProject',
      parent: 'project',
      templateUrl: 'app/components/projects/project-edit.html',
      controller: 'projectEditController'
    } )
    .state( 'dashboard.task-create', {
      url: '/task-create/:idProject',
      parent: 'project',
      templateUrl: 'app/components/tasks/task-create.html',
      controller: "taskCreateController",
      resolve: {
        addFor: function () {
          return 'task';
        }
      }
    } )
    /// task
    .state( 'task', {
      url: '/dashboard',
      templateUrl: 'app/shared/layout/dashboard.html',
    } )
    .state( 'dashboard/task-list', {
      url: '/task-list',
      parent: 'task',
      templateUrl: 'app/components/tasks/task-list.html',
      controller: 'taskListController'
    } )
    .state( 'dashboard.task-detail', {
      url: '/tasks/:idTask',
      parent: 'task',
      templateUrl: 'app/components/tasks/task-detail.html',
      controller: 'taskDetailController'
    } )
    .state( 'dashboard.search', {
      url: '/search',
      parent: 'dashboard',
    } )
    .state( 'dashboard.sub-task-create', {
      url: '/task-create/:idProject/:idTask',
      parent: 'project',
      templateUrl: 'app/components/tasks/task-create.html',
      controller: "taskCreateController",
    } )
    .state( 'dashboard.edit-task', {
      url: '/edit-task/:idTask',
      parent: 'task',
      templateUrl: 'app/components/tasks/task-edit.html',
      controller: "taskEditController",
    } )
    .state( 'profile', {
      url: '/dashboard',
      parent: 'base',
      templateUrl: 'app/shared/layout/dashboard.html',
    } )
    .state( 'dashboard.user-profile', {
      url: '/profile',
      parent: 'profile',
      templateUrl: 'app/components/profile/user-profile.html',
      controller: "",
    } )
    //reports
    .state( 'report', {
      url: '/dashboard',
      templateUrl: 'app/shared/layout/dashboard.html',
    } )
    .state( 'dashboard/report-export', {
      url: '/report-export',
      parent: 'report',
      templateUrl: 'app/components/reports/export-report.html',
      controller: 'exportReportController'
    } )
    .state( 'users', {
      url: '/dashboard',
      templateUrl: 'app/shared/layout/dashboard.html',
    } )
    .state( 'dashboard/users', {
      url: '/users',
      parent: 'users',
      templateUrl: 'app/components/users/user-list.html',
      controller: 'userCtrl'
    } )
    // .state( 'users/:userID', {
    //   url: '/users/:userID',
    //   parent: 'users',
    //   templateUrl: 'app/components/users/detail.html',
    //   controller: 'userController'
    // } )
    .state( 'dashboard/users/create', {
      url: '/users/create',
      parent: 'users',
      templateUrl: 'app/components/users/create.html',
      controller: 'userCtrl'
    } )
    .state( 'organizations', {
      url: '/dashboard',
      templateUrl: 'app/shared/layout/dashboard.html',
    } )
    .state( 'dashboard/organizations', {
      url: '/organizations',
      parent: 'organizations',
      templateUrl: 'app/components/organizations/organization-list.html',
      controller: 'organizationCtrl'
    } );
} ] );
