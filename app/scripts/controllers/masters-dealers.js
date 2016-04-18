'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('DealersCtrl', function($scope, $log, ngTableParams, $filter, Dealers) {

		$scope.page = {
			title: 'Dealers'
		};

		$scope.dealers = [];

		$scope.getDealers = function() {

			$scope.dealers = [];

			Dealers.query({}, function(success) {

				$log.log(success);

				for (var i = 0; i < success.data.length; i++) {
					$scope.dealers.push({
						name: success.data[i].attributes.name
					});
				}

				$log.log($scope.dealers);

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 10, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: $scope.dealers.length, // length of dealers
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.dealers, params.orderBy()) :
							$scope.dealers;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}, function(error) {
				$log.log(error);
			});

		};

		$scope.getDealers();

	});