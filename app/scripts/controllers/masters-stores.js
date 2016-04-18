'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('StoresCtrl', function($scope, $log, $filter, ngTableParams, Stores) {

		$scope.page = {
			title: 'Zonas'
		};

		$scope.stores = [];

		$scope.getStores = function() {

			$scope.stores = [];

			Stores.query({}, function(success) {

				$log.log(success);

				for (var i = 0; i < success.data.length; i++) {
					$scope.stores.push({
						name: success.data[i].attributes.name
					});
				}

				$log.log($scope.stores);

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 10, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: $scope.stores.length, // length of stores
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.stores, params.orderBy()) :
							$scope.stores;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}, function(error) {
				$log.log(error);
			});



		};

		$scope.getStores();

	});