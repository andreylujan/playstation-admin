'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ReportsCtrl', function($scope, $filter, $log, ngTableParams, Reports, Zones, Dealers, Stores) {

		$scope.page = {
			title: 'Reportes'
		};

		$scope.reports = [];
		var zones = [];
		var dealers = [];
		var stores = [];

		var getReports = function() {

			$scope.reports = [];

			Reports.query({}, function(success) {

				$log.log(success);

				if (success.data) {

					for (var i = 0; i < success.data.length; i++) {

						$scope.reports.push({
							reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
							createdAt: success.data[i].attributes.created_at,
							limitDate: success.data[i].attributes.limit_date,
							zoneId: success.data[i].attributes.dynamic_attributes.zone_id,
							zoneName: null,
							dealerId: success.data[i].attributes.dynamic_attributes.dealer_id,
							dealerName: null,
							storeId: success.data[i].attributes.dynamic_attributes.store_id,
							storeName: null,
							creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
						});

					}

					for (var i = 0; i < $scope.reports.length; i++) {
						for (var j = 0; j < zones.length; j++) {
							if ($scope.reports[i].zoneId === zones[j].id) {
								$scope.reports[i].zoneName = zones[j].name;
								break;
							}
						}
					}

					for (var i = 0; i < $scope.reports.length; i++) {
						for (var j = 0; j < dealers.length; j++) {
							if ($scope.reports[i].dealerId === dealers[j].id) {
								$scope.reports[i].dealerName = dealers[j].name;
								break;
							}
						}
					}

					for (var i = 0; i < $scope.reports.length; i++) {
						for (var j = 0; j < stores.length; j++) {
							if ($scope.reports[i].storeId === stores[j].id) {
								$scope.reports[i].storeName = stores[j].name;
								break;
							}
						}
					}

				}
			}, function(error) {
				$log.log(error);
			});


			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: 10, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: $scope.reports.length, // length of reports
				getData: function($defer, params) {
					// use build-in angular filter
					var orderedData = params.sorting() ?
						$filter('orderBy')($scope.reports, params.orderBy()) :
						$scope.reports;

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		};

		var getZones = function() {

			zones = [];

			Zones.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					zones.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				getDealers();

			}, function(error) {
				$log.log(error);
			});
		};

		var getDealers = function() {

			dealers = [];

			Dealers.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					dealers.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				getStores();
			}, function(error) {
				$log.log(error);
			});
		};

		var getStores = function() {

			stores = [];

			Stores.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					stores.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				getReports();

			}, function(error) {
				$log.log(error);
			});
		};

		getZones();

	});