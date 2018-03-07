'use strict';
tamagoApp.directive( "handelActivedNav", handelActivedNav );
tamagoApp.directive( "editDocument", [ '$uibModal', editDocument ] );
tamagoApp.directive( "showDocument", [ '$uibModal', showDocument ] );

tamagoApp
  .directive( 'itemOrganization', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        organization: '='
      },
      templateUrl: 'app/shared/layout/item-organization.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'itemDependency', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        task: '='
      },
      templateUrl: 'app/shared/layout/item-dependency.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'itemMember', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        member: '='
      },
      templateUrl: 'app/shared/layout/item-member.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'projectSearch', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        search: '='
      },
      templateUrl: 'app/components/projects/project-search.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'projectReportSearch', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        search: '='
      },
      templateUrl: 'app/components/projects/project-report-search.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'weekForExportReport', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        weeks: '='
      },
      templateUrl: 'app/components/reports/week-for-export-report.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'historyWeekExportReport', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        histories: '='
      },
      templateUrl: 'app/components/reports/history-week-export-report.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'yearExportReport', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      replace: true,
      scope: {
        years: '='
      },
      templateUrl: 'app/components/reports/year-export-report.html',
      link: function( scope ) {}
    };
  } )
  .directive( 'whenScrolled', function() {
    return function( scope, elm, attr ) {
      var raw = elm[ 0 ];
      elm.bind( 'scroll', function() {
        if( raw.scrollTop + raw.offsetHeight >= raw.scrollHeight ) {
          scope.$apply( attr.whenScrolled );

        }
      } );
    };
  } ).directive( 'commentScrolled', function() {
    return function( scope, elm, attr ) {
      var raw = elm[ 0 ];
      elm.bind( 'scroll', function() {
        //console.log(raw.scrollTop);
        if( raw.scrollTop === 0 ) {
          scope.$apply( attr.commentScrolled );

        }
      } );
    };
  } )
  .directive( 'clickOutside', [ '$document', function( $document ) {
    return {
      restrict: 'A',
      link: function( scope, elem, attr, ctrl ) {
        $( document ).click( function( e ) {
          var $keyword = $( "input[name='keyWord']" );
          var $search_ele = $( ".search-results" );
          var $menu_bar = $( ".navbar-menu" );
          if( ( !$menu_bar.is( e.target ) // if the target of the click isn't the $search_ele...
              &&
              $menu_bar.has( e.target ).length === 0 ) &&
            ( !$keyword.is( e.target ) // if the target of the click isn't the $search_ele...
              &&
              $keyword.has( e.target ).length === 0 ) ) { // ... nor a descendant of the $search_ele

            $search_ele.hide();

          } else {

            $search_ele.show();

          }
        } );

      }
    };
  } ] )
  .directive( 'clickOutsideExportReport', [ '$document', function( $document ) {
    return {
      restrict: 'A',
      link: function( scope, elem, attr, ctrl ) {
        $( document ).click( function( e ) {
          var $keyword = $( "input[ng-model='myKeywordReportProject']" );
          var $search_bar_export_report = $( ".search-results-rp-project" );
          if( !$keyword.is( e.target ) && $keyword.is( ":visible" ) ) {
            //if (!$keyword.is(e.target)){
            $search_bar_export_report.hide();
          }
        } );
      }
    }
  } ] )
  .directive( 'clickOutsideWeekList', [ '$document', function( $document ) {
    return {
      restrict: 'A',
      link: function( scope, elem, attr, ctrl ) {
        $( document ).click( function( e ) {
          var $areaSelectWeekly = $( ".area-er-select-weekly" );
          var $popupSelectWeek = $( ".select-week-dropdown" );
          if( !$areaSelectWeekly.is( e.target ) && $areaSelectWeekly.is( ":visible" ) ) {
            //if ($areaSelectWeekly.is(":visible")) {

            $popupSelectWeek.hide();
          }
        } );
      }
    };
  } ] )
  .directive( 'clickOutsideYearList', [ '$document', function( $document ) {
    return {
      restrict: 'A',
      link: function( scope, elem, attr, ctrl ) {
        $( document ).click( function( e ) {
          var $areaSelectYear = $( ".area-er-select-year" );
          var $popupSelectYear = $( ".select-year-dropdown" );

          if( !$areaSelectYear.is( e.target ) && $areaSelectYear.is( ":visible" ) ) {
            //if ($areaSelectYear.is(":visible")) {
            console.log( $areaSelectYear );
            $popupSelectYear.hide();
          }
        } );
      }
    };
  } ] )
  .directive( 'weekReportClickOutside', [ '$document', function( $document ) {
    return {
      restrict: 'A',
      link: function( scope, elem, attr, ctrl ) {
        $( document ).click( function( e ) {
          var $areaSelectYear = $( ".report-year-select" );
          var $popupSelectYear = $( ".select-year-dropdown" );
          if( !$areaSelectYear.is( e.target ) ) {
            $popupSelectYear.hide();
          }

          var $areaSelectWeekly = $( ".report-week-select" );
          var $popupSelectWeek = $( ".select-week-dropdown" );
          if( !$areaSelectWeekly.is( e.target ) && $areaSelectWeekly.is( ":visible" ) ) {
            //if (!$areaSelectWeekly.is(e.target)){
            $popupSelectWeek.hide();
          }
        } );
      }
    }
  } ] )
  .directive( 'projectInfor', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        project: '='
      },
      templateUrl: 'app/components/projects/project-info.html',
      controller: 'projectInfoController'
    };
  } )
  .directive( 'projectTask', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        task: '='
      },
      templateUrl: 'app/components/projects/project-task.html',
    };
  } )

  .directive( 'documentList', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        documents: '='
      },
      templateUrl: 'app/components/projects/document-list.html',
    };
  } )

  .directive( "fileread", [ '$parse', '$rootScope', function( $parse, $rootScope ) {
    return {
      link: function( scope, element, attributes ) {
        element.bind( "change", function( changeEvent ) {
          var type = element[ 0 ].files[ 0 ].type;
          // only accect image file
          if( /images*/i.test( type ) ) {

            $rootScope.$broadcast( 'event-upload', element[ 0 ].files[ 0 ] );
            var reader = new FileReader();
            reader.onload = function( loadEvent ) {

              scope.fileurl = loadEvent.target.result;
              $( "#thumbnail-project" ).attr( 'src', scope.fileurl )

            }
            reader.readAsDataURL( changeEvent.target.files[ 0 ] );
          } else {
            $rootScope.$broadcast( 'event-error', 'Ch? du?c ch?n ?nh' );
          }

        } );
      }
    }
  } ] )
  .directive( 'listTask', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        member: '='
      },
      templateUrl: 'app/components/tasks/info-assign.html',
      link: function( scope, Element ) {

      }
    };
  } )
  .directive( 'childrenTasks', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        children: '='
      },
      templateUrl: 'app/components/tasks/children-task.html',
    };
  } ).directive( 'assignTask', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        member: '='
      },
      templateUrl: 'app/components/tasks/info-assign.html',
    };
  } )
  .directive( 'listTask', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        member: '='
      },
      templateUrl: 'app/components/tasks/info-assign.html',
      link: function( scope, Element ) {

      }
    };
  } )
  .directive( 'taskInfor', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        task: '='
      },
      templateUrl: 'app/components/tasks/task-info.html',
    };
  } )
  .directive( 'myTaskInfor', function() {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      scope: {
        task: '='
      },
      templateUrl: 'app/components/tasks/my-task-info.html',
    };
  } )
  .directive( 'selectWeek', [ 'weekSelectService', function( weekSelectService ) {

    var weekSelectController = [ '$scope', function WeekSelectCotroller( $scope ) {
      $scope.objWeekSelected = {};
      $scope.objYearSelected = {};
      $scope.weeksExportReportResults = [];
      $scope.historiesExportReportResults = [];
      $scope.yearsExportReportResults = [];
      $scope.error = false;

      $scope.weekSelected = weekSelectService.weekSelected;


      /****************************************
       *  FUNCTIONS FOR GET DATA IN LIST OF WEEKS
       ****************************************/
      function getWeekNumber( d ) {
        // Copy date so don't modify original
        var d = new Date( +d );
        d.setHours( 0, 0, 0 );
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate( d.getDate() + 4 - ( d.getDay() || 7 ) );
        // Get first day of year
        var yearStart = new Date( d.getFullYear(), 0, 1 );
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil( ( ( ( d - yearStart ) / 86400000 ) + 1 ) / 7 )
        // Return array of year and week number
        return [ d.getFullYear(), weekNo ];
      };

      function getStartDateOfWeek( w, y ) {
        var simple = new Date( y, 0, 1 + ( w - 1 ) * 7 );
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if( dow <= 4 )
          ISOweekStart.setDate( simple.getDate() - simple.getDay() + 1 );
        else
          ISOweekStart.setDate( simple.getDate() + 8 - simple.getDay() );
        return ISOweekStart;
      }

      function getEndDateOfWeek( w, y ) {
        var startDate = getStartDateOfWeek( w, y );
        return startDate.setDate( startDate.getDate() + 6 );
      }

      function getDateRangeOfWeek( weekNo, year, firstOrLastDate ) {
        var startDate = getStartDateOfWeek( weekNo, year );
        var rangeIsFrom = startDate.getDate() + "/" + eval( startDate.getMonth() + 1 ) + "/" + startDate.getFullYear();
        startDate.setDate( startDate.getDate() + 6 );
        var rangeIsTo = startDate.getDate() + "/" + eval( startDate.getMonth() + 1 ) + "/" + startDate.getFullYear();
        if( firstOrLastDate == 'last' ) {
          return rangeIsTo;
        } else {
          return rangeIsFrom;
        }
      };

      function weeksInYear( year ) {
        var d = new Date( year, 11, 31 );
        var week = getWeekNumber( d )[ 1 ];
        return week == 1 ? getWeekNumber( d.setDate( 24 ) )[ 1 ] : week;
      };

      $scope.getListOfAllWeeksOfYear = function( year ) {
        $scope.objWeekSelected = null;
        //Check and remove all objects in array $scope.searchReportResults
        if( $scope.weeksExportReportResults.length > 0 ) {
          $scope.weeksExportReportResults = [];
        }
        //Remove all html before add new cell
        $( '.select-week-dropdown li ul week-for-export-report' ).children().remove();

        var date = new Date();
        var selectedYear = date.getFullYear();
        var endWeekNumber = moment().week();
        if( typeof year != 'undefined' && year != selectedYear ) {
          endWeekNumber = weeksInYear( year );
          selectedYear = year;
        }
        // else {
        //   $scope.objYearSelected['yearNumber'] = selectedYear;
        // }
        $scope.objYearSelected[ 'yearNumber' ] = selectedYear;

        for( var i = ( endWeekNumber ); i >= 1; i-- ) {
          var item = {};
          item[ 'weekNumber' ] = i;
          item[ 'fromDate' ] = getDateRangeOfWeek( i, selectedYear, 'first' );
          item[ 'toDate' ] = getDateRangeOfWeek( i, selectedYear, 'last' );
          $scope.weeksExportReportResults.push( item );

          if( i === $scope.weekSelected.week ) {
            $scope.objWeekSelected = item;
          }
        }

        if( !$scope.objWeekSelected ) {
          $scope.objWeekSelected = $scope.weeksExportReportResults[ 0 ];
        }
        fnSetWeekSelected();
      };
      $scope.getListOfYearsFromNow = function() {
        var currentYear = new Date().getFullYear();
        for( var i = currentYear; i >= ( currentYear - 10 ); i-- ) {
          var item = {};
          item[ 'yearNumber' ] = i;
          $scope.yearsExportReportResults.push( item );
        }
      };

      $scope.tapShowSelectWeek = function() {
        $( '.report-week-contain .select-week-dropdown' ).toggle();
      };

      $scope.tapShowSelectYear = function() {
        $( '.report-week-contain .select-year-dropdown' ).toggle();
      };


      $scope.tapSelectYear = function( y ) {
        $scope.objYearSelected = y;
        fnSetYearSelected();
        $scope.weekSelected.year = y[ 'yearNumber' ];
        $scope.getListOfAllWeeksOfYear( y[ 'yearNumber' ] );
      };

      function fnSetWeekSelected() {
        var numberWeekSelected = $scope.objWeekSelected[ 'weekNumber' ];
        var dateFrom = $scope.objWeekSelected[ 'fromDate' ];
        var dateTo = $scope.objWeekSelected[ 'toDate' ];
        $( '.p-number-week' ).html( 'Tuần ' + numberWeekSelected );
        $( '.p-fromto-week' ).html( 'Từ ' + dateFrom + ' đến ' + dateTo );
        $( '.report-week-contain .select-week-dropdown' ).css( 'display', 'none' );
      }

      function fnSetYearSelected() {
        var numberYearSelected = $scope.objYearSelected[ 'yearNumber' ];
        $( '.p-year' ).html( numberYearSelected );
        $( '.report-week-contain .select-year-dropdown' ).css( 'display', 'none' );
      }

      $scope.tapWeekNumber = function( w ) {
        $scope.objWeekSelected = w;
        $scope.weekSelected.week = w.weekNumber;
        fnSetWeekSelected();
      };


    } ]
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      controller: weekSelectController,
      replace: true,
      scope: {
        weekSelected: '=weekSelected'
      },
      templateUrl: 'app/shared/layout/week-select.html',
      link: function( scope, element, attrs ) {
        if( attrs.disabled == "true" ) {
          $( ".report-week-select" ).css( 'pointer-events', 'none' );
          $( ".report-year-select" ).css( 'pointer-events', 'none' );
        } else {
          $( ".report-week-select" ).css( 'pointer-events', 'auto' );
          $( ".report-year-select" ).css( 'pointer-events', 'auto' );
        }
        var year = scope.weekSelected.year;
        if( year && typeof year === 'number' ) {
          scope.getListOfAllWeeksOfYear( year );
        } else {
          scope.getListOfAllWeeksOfYear();
        }
        scope.getListOfYearsFromNow();
      }
    };
  } ] )
  .directive( 'checkAvatarImage', [ '$http', function( $http ) {
    return {
      restrict: 'A',
      link: function( scope, element, attrs ) {
        //element.attr('data-toggle', "tooltip"); // set default image
        //element.attr('ngSrc', "./assets/img/icons/default_avatar.png"); // set default image
        attrs.$observe( 'ngSrc', function( ngSrc ) {
          if( ngSrc ) {
            $http.get( ngSrc ).success( function() {

            } ).error( function( error ) {
              //We just set image to default when error reponse is null, because in some cases, server return error but image still loaded (cross-site)
              if( error ) {
                element.attr( 'src', "./assets/img/icons/default_avatar.png" ); // set default image
              }
            } );
          } else {
            element.attr( 'src', "./assets/img/icons/default_avatar.png" ); // set default image
          }
        } );
      }
    };
  } ] ).directive( 'notification', [ '$timeout', function( $timeout ) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '='
      },
      template: '<div class="alert alert-success display-new-task" bs-alert="ngModel"></div>',
      link: function( scope, element, attrs ) {
        $timeout( function() {
          element.hide();
        }, 9000 );
      }
    };
  } ] );


/*injection for provider*/
handelActivedNav.$inject = [ '$state' ]
/*implement for provider*/

function handelActivedNav( $state ) {
  var icon = {
    project: {
      hightling: './assets/img/icons/icn-highlight-project.png',
      normal: './assets/img/icons/icn-project.png'
    },
    task: {
      hightling: './assets/img/icons/icn-highlight-congviec.png',
      normal: './assets/img/icons/icn-congviec.png'
    },
    report: {
      hightling: './assets/img/icons/icon-report-highlight.png',
      normal: './assets/img/icons/icon-report.png'
    },
    schedule: {
      hightling: './assets/img/icons/icn-highlight-lich.png',
      normal: './assets/img/icons/icn-lich.png'
    },
    users: {
      hightling: './assets/img/admin/active-admin-icon.png',
      normal: './assets/img/admin/normal-admin-icon.png'
    },
    organizations: {
      hightling: './assets/img/admin/active-admin-icon.png',
      normal: './assets/img/admin/normal-admin-icon.png'
    }
  };
  return {
    link: function( scope, element, attributes ) {
      scope.isShowedChildMenu = false;
      if( $state.current.parent == 'users' || $state.current.parent == 'organizations' ) {
        icon.users.normal = './assets/img/admin/active-admin-icon.png';
        scope.isShowedChildMenu = true;
      } else {
        scope.isShowedChildMenu = false;
        icon.users.normal = './assets/img/admin/normal-admin-icon.png';
      }
      var current_name = $state.current.parent;
      var current_name_element = attributes.parent;
      element.removeClass( 'active' );
      var $img = element.find( 'img' );
      $img.attr( 'src', icon[ current_name_element ].normal );
      if( current_name === current_name_element ) {
        element.addClass( 'active' );
        $img.attr( 'src', icon[ current_name_element ].hightling );
      }
    }
  };

}

function editDocument( $uibModal ) {
  return {
    restrict: 'A',
    scope: {
      document: '=',
    },
    link: function( scope, element, attributes ) {
      $( element ).click( function() {

        var directive = $uibModal.open( {
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/shared/layout/add-document.html',
          controller: 'ModalAddDocumentCtrl',
          controllerAs: '$ctrl',
          //size: size,
          resolve: {
            items: function() {
              return scope.projectId;
            },
            documentFor: function() {
              return 0;
            },
            documents: function() {
              return 0;
            },
            method: function() {
              return 'edit';
            },
            data: function() {
              return scope.document;
            }
          }
        } );
      } );
    }
  };
}

function showDocument( $uibModal ) {
  return {
    restrict: 'A',
    scope: {
      document: '=',
    },
    link: function( scope, element, attributes ) {
      $( element ).click( function() {
        console.log( "element document: " );
        console.log( element );
        var directive = $uibModal.open( {
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/shared/layout/show-document.html',
          controller: 'ModalAddDocumentCtrl',
          controllerAs: '$ctrl',
          //size: size,
          resolve: {
            items: function() {
              return scope.projectId;
            },
            documentFor: function() {
              return 0;
            },
            documents: function() {
              return 0;
            },
            method: function() {
              return 'show';
            },
            data: function() {
              return scope.document;
            }
          }
        } );
      } );
    }
  };
}
