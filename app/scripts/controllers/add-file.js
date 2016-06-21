'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:AddFileModalInstanceCtrl
 * @description
 * # AddFileModalInstanceCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('AddFileModalInstanceCtrl', function($scope, $log, $uibModalInstance, $window, Files) {

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
			if (success.data) {
				imageUrl = success.data.attributes.url;
				$uibModalInstance.close(imageUrl);
			} else {
				$window.alert('Error al subir la imágen, por favor intente nuevamente');
			}
		}, function(error) {
			$log.error(error);
			$window.alert('Error al subir la imágen, por favor intente nuevamente');
		});

	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});