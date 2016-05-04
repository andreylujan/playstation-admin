'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ReportsCtrl', function($scope, $filter, $log, $window, ngTableParams, Reports, Zones, Dealers, Stores) {

		$scope.page = {
			title: 'Lista de reportes',
			prevBtn: {
				disabled: true
			},
			nextBtn: {
				disabled: false
			}
		};

		$scope.reports = [];
		var zones = [];
		var dealers = [];
		var stores = [];
		var i, j;
		$scope.currentPage = 0;
		var pageSize = 4;

		$scope.getReports = function(mode) {

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

			Reports.query({
				all: true,
				'page[number]': $scope.currentPage,
				'page[size]': pageSize
			}, function(success) {

				if (success.data) {

					for (i = 0; i < success.data.length; i++) {

						$scope.reports.push({
							id: success.data[i].id,
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

					// Si la cantidad de reportes es menor a la cantidad de reportes que se solicitan, el boton siguiente se bloquea
					if ($scope.reports.length < pageSize) {
						$scope.page.nextBtn.disabled = true;
					} else {
						$scope.page.nextBtn.disabled = false;
					}

					$scope.tableParams = new ngTableParams({
						page: 1, // show first page
						count: $scope.reports.length, // count per page
						filter: {
							//name: 'M'       // initial filter
						},
						sorting: {
							'report.id': 'asc' // initial sorting
						}
					}, {
						counts: [],
						total: $scope.reports.length, // length of $scope.reports
						getData: function($defer, params) {
							var filteredData = params.filter() ?
								$filter('filter')($scope.reports, params.filter()) :
								$scope.reports;
							var orderedData = params.sorting() ?
								$filter('orderBy')(filteredData, params.orderBy()) :
								$scope.reports;

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

				$scope.getReports('next');

			}, function(error) {
				$log.log(error);
			});
		};

		getZones();

		$scope.downloadPdf = function() {
			var pdf = angular.element(event.target).data('pdf');
			if (pdf) {
				$window.open(pdf, '_blank');
			}
		};

	});