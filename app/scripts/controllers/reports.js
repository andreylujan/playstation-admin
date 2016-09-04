'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ReportsCtrl', function($scope, $filter, $log, $window, NgTableParams, DailyReports, Reports, Zones, Dealers, Stores, Users, Utils) {

	$scope.page = {
		title: 'Lista de reportes',
		prevBtn: {
			disabled: true
		},
		nextBtn: {
			disabled: false
		},
		tableLoaded: false
	};

	var reports = [];
	var zones = [];
	var dealers = [];
	var stores = [];
	var users = [];
	var i, j;
	$scope.currentPage = 0;
	var pageSize = 30;

	$scope.getReports = function(mode, e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		reports = [];

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

		reports = [];

		DailyReports.query({
			all: true,
			'page[number]': $scope.currentPage,
			'page[size]': pageSize
		}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {

					var zoneId = success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location ? zoneId = parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.zone) : zoneId = null;
					var dealerId = success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location ? dealerId = parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.dealer) : dealerId = null;
					var storeId = success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location ? storeId = parseInt(success.data[i].attributes.dynamic_attributes.sections[0].data_section[1].zone_location.store) : dealerId = null;

					reports.push({
						id: success.data[i].id,
						reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
						createdAt:  $filter('date')(success.data[i].attributes.created_at, 'dd-MM-yyyy'),
						limitDate: $filter('date')(success.data[i].attributes.limit_date, 'dd-MM-yyyy'),
						zoneId: zoneId,
						zoneName: '-',
						dealerId: dealerId,
						dealerName: '-',
						storeId: storeId,
						storeName: '-',
						creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
						pdfUploaded: success.data[i].attributes.pdf_uploaded,
						pdf: success.data[i].attributes.pdf,
						assigned_user_id: success.data[i].attributes.assigned_user_id,
						assignedUserName: '-'
					});

				}

				for (i = 0; i < reports.length; i++) {
					for (j = 0; j < zones.length; j++) {
						if (reports[i].zoneId === zones[j].id) {
							reports[i].zoneName = zones[j].name;
							break;
						}
					}
				}

				for (i = 0; i < reports.length; i++) {
					for (j = 0; j < dealers.length; j++) {
						if (reports[i].dealerId === dealers[j].id) {
							reports[i].dealerName = dealers[j].name;
							break;
						}
					}
				}

				for (i = 0; i < reports.length; i++) {
					for (j = 0; j < stores.length; j++) {
						if (reports[i].storeId === stores[j].id) {
							reports[i].storeName = stores[j].name;
							break;
						}
					}
				}

				for (i = 0; i < reports.length; i++) {
					for (j = 0; j < users.length; j++) {
						if (reports[i].storeId === users[j].id) {
							reports[i].assignedUserName = users[j].fullName;
							break;
						}
					}
				}

				// Si la cantidad de reportes es menor a la cantidad de reportes que se solicitan, el boton siguiente se bloquea
				if (reports.length < pageSize) {
					$scope.page.nextBtn.disabled = true;
				} else {
					$scope.page.nextBtn.disabled = false;
				}

				$scope.tableParams = new NgTableParams({
					count: reports.length, // count per page
					sorting: {
						'reportTypeName': 'desc' // initial sorting
					}
				}, {
					dataset: reports,
					counts: [],
					total: reports.length, // length of reports
				});
				$scope.page.tableLoaded = true;

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getReports);
			}
		});
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
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					stores.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}
				getUsers({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getStores);
			}
		});
	};

	var getUsers = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		users = [];

		Users.query({}, function(success) {
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					if (success.data[i].attributes.active) {
						users.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}

				$scope.getReports('next', {
					success: true,
					detail: 'OK'
				});

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
		});
	};

	getZones({
		success: true,
		detail: 'OK'
	});

	$scope.downloadPdf = function(event) {
		var pdf = angular.element(event.target).data('pdf');
		if (pdf) {
			$window.open(pdf, '_blank');
		}
	};

});