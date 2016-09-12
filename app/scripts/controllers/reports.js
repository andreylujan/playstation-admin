'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ReportsCtrl', function($scope, $filter, $log, $timeout, $window, NgTableParams, DailyReports, Reports, Zones, Dealers, Stores, Users, Utils) {

	$scope.page = {
		title: 'Lista de Reportes',
		prevBtn: {
			disabled: true
		},
		nextBtn: {
			disabled: false
		},
		tableLoaded: false
	};

	$scope.pagination = {
		reports: {
			pages: {
				actual: 1,
				size: 30,
				_current: 1,
				total: 0,
			},
			total: 0
		}
	};
	$scope.filters = {
		id: null,
		title: null,
		createdAt: null,
		limitDate: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null
	};

	var filters = {
		id: null,
		title: null,
		createdAt: null,
		limitDate: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null
	};

	var reports = [];
	var zones = [];
	var dealers = [];
	var stores = [];
	var users = [];
	var i, j;
	$scope.currentPage = 0;
	$scope.pageSize = 30;

	$scope.decrementPage = function() {
		if ($scope.pagination.reports.pages._current > 1) {
			$scope.pagination.reports.pages._current--;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, $scope.pageSize, $scope.filters);
		}
	};

	$scope.incrementPage = function() {
		if ($scope.pagination.reports.pages._current <= $scope.pagination.reports.total - 1) {
			$scope.pagination.reports.pages._current++;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, $scope.pageSize, $scope.filters);
		}
	};

	$scope.tableParams = new NgTableParams({
		count: reports.length, // count per page
	}, {
		dataset: reports,
		counts: [],
		total: reports.length, // length of reports
		filterOptions: {
			filterDelay: 1500
		}
	});

	var filterTimeout, filterTimeoutDuration = 1000;

	$scope.$watch('tableParams.filter().id', function(newId) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.id = newId;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				storeName: filters.storeName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParams.filter().createdAt', function(newCreatedAt) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.createdAt = newCreatedAt;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().limitDate', function(newLimitDate) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.limitDate = newLimitDate;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().title', function(newTitle) {
		if (filterTimeout) $timeout.cancel(filterTimeout);
		filterTimeout = $timeout(function() {
			filters.title = newTitle;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().zoneName', function(newZoneName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);
		filterTimeout = $timeout(function() {
			filters.zoneName = newZoneName;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().dealerName', function(newDealerName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);
		filterTimeout = $timeout(function() {
			filters.dealerName = newDealerName;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().storeName', function(newStoreName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);
		filterTimeout = $timeout(function() {
			filters.storeName = newStoreName;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParams.filter().creatorName', function(newCreatorName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);
		filterTimeout = $timeout(function() {
			filters.creatorName = newCreatorName;
			$scope.getReports({
				success: true,
				detail: 'OK'
			}, $scope.pagination.reports.pages._current, 30, {
				id: filters.id,
				title: filters.title,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				zoneName: filters.zoneName,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.getReports = function(e, page, pageSize, filters) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		DailyReports.query({
			all: true,
			'page[number]': page,
			'page[size]': pageSize,
			'filter[id]': filters.id || null,
			'filter[title]': filters.title || null,
			'filter[created_at]': filters.createdAt || null,
			'filter[limit_date]': filters.limitDate || null,
			'filter[zone_name]': filters.zoneName || null,
			'filter[dealer_name]': filters.dealerName || null,
			'filter[store_name]': filters.storeName || null,
			'filter[creator_name]': filters.creatorName || null,
			'fields[reports]': 'zone_name,store_name,dealer_name,created_at,limit_date,task_start,title,assigned_user_names,creator_name,pdf_uploaded,pdf'
		}, function(success) {

			if (success.data) {
				reports = [];
				$scope.pagination.reports.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {

					reports.push({
						id: success.data[i].id,
						reportTypeName: '',
						createdAt: $filter('date')(success.data[i].attributes.created_at, 'dd/MM/yyyy'),
						limitDate: $filter('date')(success.data[i].attributes.limit_date, 'dd/MM/yyyy'),
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
						storeName: success.data[i].attributes.store_name,
						creatorName: success.data[i].attributes.creator_name,
						pdfUploaded: success.data[i].attributes.pdf_uploaded,
						pdf: success.data[i].attributes.pdf
					});

				}
				$scope.tableParams.count(reports.length);
				$scope.tableParams.settings({
					dataset: reports,
					counts: [],
					total: reports.length, // length of reports
					filterOptions: {
						filterDelay: 1500
					},
				});
			} else {
				$log.error(success);
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

				$scope.getReports({
					success: true,
					detail: 'OK'
				}, 1, 30, {
					id: null,
					title: null,
					zoneName: null,
					createdAt: null,
					limitDate: null,
					dealerName: null,
					storeName: null,
					creatorName: null
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