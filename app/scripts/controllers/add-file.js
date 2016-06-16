'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:AddFileModalInstanceCtrl
 * @description
 * # AddFileModalInstanceCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('AddFileModalInstanceCtrl', function($scope) {

	$scope.$on('$dropletReady', function whenDropletReady() {
		$scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif']);
	});
});