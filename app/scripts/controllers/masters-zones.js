'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ZonesCtrl', function($scope, $log, ngTableParams, $filter, Zones) {

		$scope.page = {
			title: 'Zonas'
		};

		$scope.zones = [];

		$scope.getZones = function() {

			$scope.zones = [];

			Zones.query({}, function(success) {

				$log.log(success);

				for (var i = 0; i < success.data.length; i++) {
					$scope.zones.push({
						name: success.data[i].attributes.name
					});
				}

				$log.log($scope.zones);

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 10, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: $scope.zones.length, // length of zones
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.zones, params.orderBy()) :
							$scope.zones;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}, function(error) {
				$log.log(error);
			});



		};

		$scope.getZones();

	});