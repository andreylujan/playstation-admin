'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ProductsCtrl', function($scope, $log, $filter, ngTableParams, Products) {

		$scope.page = {
			title: 'Zonas'
		};

		$scope.products = [];

		$scope.getProducts = function() {

			$scope.products = [];

			Products.query({}, function(success) {

				$log.log(success);

				// for (var i = 0; i < success.data.length; i++) {
				// 	$scope.products.push({
				// 		name: success.data[i].attributes.name
				// 	});
				// }

				$log.log($scope.products);

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 10, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: $scope.products.length, // length of products
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.stores, params.orderBy()) :
							$scope.products;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}, function(error) {
				$log.log(error);
			});

		};

		$scope.getProducts();

	});