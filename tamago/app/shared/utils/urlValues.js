var domain = "http://172.20.2.80:8080/";
//var domain = "https://tamago.work:8090/";
//var domain = "http://localhost:8090/";

tamagoApp
  .constant( 'URL_VALUES', {
    'LOGIN': domain + 'auth/login',
    'LOGOUT': domain + 'auth/logout',
    'TASKS': domain + 'tasks',
    'PROJECTS': domain + 'projects',
    'TASKS_LIST': domain + 'tasks',
    'USERS': domain + 'users',
    'DOCUMENTS': domain + 'documents',
    'ORGANIZATIONS': domain + 'organizations',
    'TASKTEMPLATES': domain + 'tasktemplates',
    'TASKDEPENDENCIES': domain + 'dependencies',
    'REPORT_EXPORT': domain + 'export',
    'DEPARTMENTS': domain + 'users/department-position'
  } );
