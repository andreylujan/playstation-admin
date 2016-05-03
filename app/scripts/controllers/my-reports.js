'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('MyReportsCtrl', function($scope, $log, ngTableParams, $filter, Utils, Reports, Zones, Dealers, Stores) {

		$scope.page = {
			title: 'Mis Reportes',
			prevBtn: {
				disabled: true
			},
			myReportsMysTasksSel: [{
				id: 1,
				name: 'Mis Reportes'
			}, {
				name: 'Mis Tareas',
				id: 2
			}]
		};

		$scope.option = $scope.page.myReportsMysTasksSel[0];

		$scope.reports = [];
		var zones = [];
		var dealers = [];
		var stores = [];
		var loggedUserId = Utils.getInStorage('userid');
		var i, j;
		$scope.currentPage = 0;
		var pageSize = 4;

		$scope.getMyreports = function(mode) {

			$scope.reports = [];

			if ($scope.currentPage === 2) {
				$scope.page.prevBtn.disabled = true;
			}

			if (mode === 'prev') {
				if ($scope.currentPage > 1) {
					$scope.currentPage--;
				}
			} else if (mode === 'next') {
				$scope.currentPage++;
				if ($scope.currentPage > 1) {
					$scope.page.prevBtn.disabled = false;
				}
			}

			if ($scope.option.id === 1) {

				Reports.query({
					'page[number]': $scope.currentPage,
					'page[size]': pageSize,
					'filter[creator_id]': loggedUserId
				}, function(success) {

					if (success.data) {

						for (i = 0; i < success.data.length; i++) {
							$scope.reports.push({
								reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
								createdAt: success.data[i].attributes.created_at,
								limitDate: success.data[i].attributes.limit_date,
								zoneId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.zone),
								zoneName: null,
								dealerId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.dealer),
								dealerName: null,
								storeId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.store),
								storeName: null,
								creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
								pdfUploaded: success.data[i].attributes.pdf_uploaded,
								pdf: success.data[i].attributes.pdf
							});
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < zones.length; j++) {
								if ($scope.reports[i].zoneId === zones[j].id) {
									$scope.reports[i].zoneName = zones[j].name;
									break;
								}
							}
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < dealers.length; j++) {
								if ($scope.reports[i].dealerId === dealers[j].id) {
									$scope.reports[i].dealerName = dealers[j].name;
									break;
								}
							}
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < stores.length; j++) {
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
					count: $scope.reports.length, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					counts: [],
					total: $scope.reports.length, // length of reports
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.reports, params.orderBy()) :
							$scope.reports;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			} else if ($scope.option.id === 2) {

				Reports.query({
					'page[number]': $scope.currentPage,
					'page[size]': pageSize,
					'filter[assigned_user_id]': loggedUserId
				}, function(success) {

					$log.log(success);

					if (success.data) {

						for (i = 0; i < success.data.length; i++) {
							$scope.reports.push({
								reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
								createdAt: success.data[i].attributes.created_at,
								limitDate: success.data[i].attributes.limit_date,
								zoneId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.zone),
								zoneName: null,
								dealerId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.dealer),
								dealerName: null,
								storeId: parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.store),
								storeName: null,
								creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
								pdfUploaded: success.data[i].attributes.pdf_uploaded,
								pdf: success.data[i].attributes.pdf
							});
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < zones.length; j++) {
								if ($scope.reports[i].zoneId === zones[j].id) {
									$scope.reports[i].zoneName = zones[j].name;
									break;
								}
							}
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < dealers.length; j++) {
								if ($scope.reports[i].dealerId === dealers[j].id) {
									$scope.reports[i].dealerName = dealers[j].name;
									break;
								}
							}
						}

						for (i = 0; i < $scope.reports.length; i++) {
							for (j = 0; j < stores.length; j++) {
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
					count: $scope.reports.length, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					counts: [],
					total: $scope.reports.length, // length of reports
					getData: function($defer, params) {
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.reports, params.orderBy()) :
							$scope.reports;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			}

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

				$scope.getMyreports('next');

			}, function(error) {
				$log.log(error);
			});
		};

		getZones();

	});