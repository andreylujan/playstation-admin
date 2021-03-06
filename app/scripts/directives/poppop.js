'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:activateButton
 * @description
 * # activateButton
 */
angular.module('minovateApp')
  .directive('poppop', function pop($tooltip, $timeout) {
    var tooltip = $tooltip('pop', 'pop', 'event');
    var compile = angular.copy(tooltip.compile);
    tooltip.compile = function(element, attrs) {
      var first = true;
      attrs.$observe('popShow', function(val) {
        if (JSON.parse(!first || val || false)) {
          $timeout(function() {
            element.triggerHandler('event');
          });
        }
        first = false;
      });
      return compile(element, attrs);
    };
    return tooltip;
  });