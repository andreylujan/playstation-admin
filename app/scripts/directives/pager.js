'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:pager
 * @description
 * # pager
 */
angular.module('minovateApp')
  .directive('pager', function($log) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        'prev': '&',
        'next': '&',
        'changePage': '&',
        'currentPage': '=',
        'all': '='
      },
      template: '<form class="form-horizontal">'+
                  '<div class="form-group m-0">'+
                    '<button class="btn col-md-3 col-sm-2 col-xs-2" ng-click="prev({page: currentPage})">«</button>'+
                    '<div class="col-md-3 col-sm-2 col-xs-3">'+
                      '<input type="number" class="form-control" ng-model="currentPage" ng-blur="changePage({page: currentPage})" min="1" max="{{all}}" ng-minlength="1" />'+
                    '</div>'+
                    '<p class="col-md-1 col-xs-1 control-label" style="text-align:center;">de</p><p class="col-md-1 col-xs-1 control-label" style="text-align:center;">{{all}}</p>'+
                    '<button class="btn col-md-3 col-sm-2 col-xs-2" ng-click="next({page: currentPage})">»</button>'+
                  '</div>'+
                '</form>',
      link: function(scope, el, attrs) {

        

      }
    };
  });