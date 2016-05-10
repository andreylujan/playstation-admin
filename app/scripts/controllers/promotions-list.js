'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('PromotionsListCtrl', function($scope, $filter, $log, $window, $state, $modal, ngTableParams, Promotions) {

	$scope.page = {
		title: 'Promociones'
	};

	var i;

	$scope.promotions = [];

	$scope.getPromotions = function() {

		$scope.promotions = [];

		Promotions.query({}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {

					$scope.promotions.push({
						id: success.data[i].id,
						title: success.data[i].attributes.title,
						startDate: success.data[i].attributes.start_date,
						endDate: success.data[i].attributes.end_date,

						// zoneId: success.data[i].attributes.zoneId,
						// zoneName: success.data[i].attributes.zoneName,
						// dealerId: success.data[i].attributes.dealerId,
						// dealerName: success.data[i].attributes.dealerName,
						// storeId: success.data[i].attributes.storeId,
						// storeName: success.data[i].attributes.storeName
					});

				}

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						title: 'asc' // initial sorting
					}
				}, {
					total: $scope.promotions.length, // length of $scope.promotions
					getData: function($defer, params) {
						var filteredData = params.filter() ?
							$filter('filter')($scope.promotions, params.filter()) :
							$scope.promotions;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.promotions;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

				// $log.log($scope.promotions);

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

	};

	$scope.getPromotions();

	$scope.gotoNewPromotion = function() {

		$state.go('app.promotions.new');

	};

	$scope.openModalRemovePromotion = function(idPromotion) {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'removeModal.html',
			controller: 'RemoveModalInstance',
			resolve: {
				idPromotion: function() {
					return idPromotion;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getPromotions();
		}, function() {
			// $scope.getPromotions();
		});
	};
})

.controller('RemoveModalInstance', function($scope, $filter, $log, $modalInstance, idPromotion, Promotions) {

	$scope.modal = {
		promotion: {
			title: ''
		}
	};

	var getInfoPromotion = function() {
		Promotions.query({
			idPromotion: idPromotion
		}, function(success) {
			if (success.data) {
				$scope.modal.promotion.title = success.data.attributes.title;
			} else {
				$log.log('no se pudo obtener el titulo');
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});
	};

	$scope.removePromotion = function() {
		Promotions.delete({
			idPromotion: idPromotion
		}, function(success) {
			if (!success.errors) {
				$modalInstance.close();
			} else {
				$log.log('no se puso borrar');
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	getInfoPromotion();

});