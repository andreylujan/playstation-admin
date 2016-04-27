'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ZonesCtrl
 * @description
 * # ZonesCtrl
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

		Zones.query({

		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.zones.push({
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
						name: 'asc' // initial sorting
					}
				}, {
					total: $scope.zones.length, // length of zones
					getData: function($defer, params) {
						var filteredData = params.filter() ?
							$filter('filter')($scope.zones, params.filter()) :
							$scope.zones;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.zones;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});
			} else {
				$log.log(success);
			}

		}, function(error) {
			$log.log(error);
		});

	};

	$scope.getZones();

});