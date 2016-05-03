'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('DealersCtrl', function($scope, $log, $filter, ngTableParams, Dealers) {

		$scope.page = {
			title: 'Dealers'
		};

		$scope.dealers = [];

		$scope.getDealers = function() {

			$scope.dealers = [];

			Dealers.query({}, function(success) {

				for (var i = 0; i < success.data.length; i++) {
					$scope.dealers.push({
						name: success.data[i].attributes.name
					});
				}

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 10, // count per page
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						name: 'asc'     // initial sorting
					}
				}, {
					total: $scope.dealers.length, // length of $scope.dealers
					getData: function($defer, params) {
						// use build-in angular filter
						var filteredData = params.filter() ?
							$filter('filter')($scope.dealers, params.filter()) :
							$scope.dealers;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.dealers;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}, function(error) {
				$log.log(error);
			});

		};

		$scope.getDealers();

	});