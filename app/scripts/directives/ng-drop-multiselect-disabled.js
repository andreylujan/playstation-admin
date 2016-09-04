'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:activateButton
 * @description
 * # activateButton
 */
angular.module('minovateApp')
  .directive('ngDropdownMultiselectDisabled', function() {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs) {
        var $btn;
        $btn = $element.find('button');
        return $scope.$watch($attrs.ngDropdownMultiselectDisabled, function(newVal) {
          return $btn.attr('disabled', newVal);
        });
      }
    };
  });