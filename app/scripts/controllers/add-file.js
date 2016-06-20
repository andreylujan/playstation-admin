'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:AddFileModalInstanceCtrl
 * @description
 * # AddFileModalInstanceCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('AddFileModalInstanceCtrl', function($scope, $log, $uibModalInstance, Files) {

	$scope.modal = {
		images: {
			src: null
		}
	};

	var i = 0;
	var imageUrl = null;

	$scope.$on('$dropletReady', function whenDropletReady() {
		$scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif']);
	});

	$scope.uploadImages = function() {

		$log.log($scope.modal.images.src);

		Files.save({
			category_id: null,
			report_id: null,
			last_image: null,
			image: 'data:' + $scope.modal.images.src.filetype + 'base64,' + $scope.modal.images.src.base64
		}, function(success) {
			$log.log(success);
			if (success.data) {
				imageUrl = success.data.attributes.url;
				$uibModalInstance.close(imageUrl);
				$log.log('todo ok');
			}
		}, function(error) {
			$log.error(error);
		});

	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});