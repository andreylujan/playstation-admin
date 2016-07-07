'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('MyReportsCtrl', function($scope, $log, ngTableParams, $filter, $window, Utils, Reports, Zones, Dealers, Stores) {

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
		var pageSize = 25;

		$scope.getMyreports = function(mode, e) {
			// Valida si el parametro e.success se seteó true para el refresh token
			if (!e.success) {
				$log.error(e.detail);
				return;
			}

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
					$log.error(error);
					if (error.status === 401) {
						Utils.refreshToken($scope.getMyreports);
					}
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

					// $log.log(success);

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
					$log.error(error);
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

		var getZones = function(e) {

			// Valida si el parametro e.success se seteó true para el refresh token
			if (!e.success) {
				$log.error(e.detail);
				return;
			}

			zones = [];

			Zones.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					zones.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				getDealers({
					success: true,
					detail: 'OK'
				});

			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken(getZones);
				}
			});
		};

		var getDealers = function(e) {
			// Valida si el parametro e.success se seteó true para el refresh token
			if (!e.success) {
				$log.error(e.detail);
				return;
			}

			dealers = [];

			Dealers.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					dealers.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				getStores({
					success: true,
					detail: 'OK'
				});
			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken(getDealers);
				}

			});
		};

		var getStores = function(e) {
			// Valida si el parametro e.success se seteó true para el refresh token
			if (!e.success) {
				$log.error(e.detail);
				return;
			}

			stores = [];

			Stores.query({}, function(success) {
				for (var i = 0; i < success.data.length; i++) {
					stores.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				$scope.getMyreports('next', {
					success: true,
					detail: 'OK'
				});

			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken(getStores);
				}
			});
		};

		$scope.downloadPdf = function() {
			var pdf = angular.element(event.target).data('pdf');
			if (pdf) {
				$window.open(pdf, '_blank');
			}
		};

		getZones({
			success: true,
			detail: 'OK'
		});

	});