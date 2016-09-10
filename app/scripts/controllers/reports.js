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
		zoneName: '',
		dealerName: '',
		storeName: '',
		creatorName: ''
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

	var reportsFilter = function(data, filterValues) {
		$log.info('data');
		$log.info(data);

		$scope.filters = {
			zoneName: filterValues.zoneName || '',
			dealerName: filterValues.dealerName || '',
			storeName: filterValues.storeName || '',
			creatorName: filterValues.creatorName || ''
		};

		$scope.getReports({
			success: true,
			detail: 'OK'
		}, $scope.pagination.reports.pages._current, $scope.pageSize, {
			zoneName: $scope.filters.zoneName,
			dealerName: $scope.filters.dealerName,
			storeName: $scope.filters.storeName,
			creatorName: $scope.filters.creatorName
		});

		return data.filter(function(item) {

			var zoneName = $scope.filters.zoneName === undefined ? '' : $scope.filters.zoneName;
			var dealerName = $scope.filters.dealerName === undefined ? '' : $scope.filters.dealerName;
			var storeName = $scope.filters.storeName === undefined ? '' : $scope.filters.storeName;
			var creatorName = $scope.filters.creatorName === undefined ? '' : $scope.filters.creatorName;

			// $log.log('zoneName: ' + zoneName);
			// $log.log('item.zoneName: ' + item.zoneName);

			// $log.log('dealerName: ' + dealerName);
			// $log.log('item.dealerName: ' + item.dealerName);

			// $log.log('storeName: ' + storeName);
			// $log.log('item.storeName: ' + item.storeName);

			// $log.log('creatorName: ' + creatorName);
			// $log.log('item.creatorName: ' + item.creatorName);

			var isZoneName = item.zoneName.toLowerCase().indexOf(zoneName.toLowerCase()) !== -1;
			var isDealerName = item.dealerName.toLowerCase().indexOf(dealerName.toLowerCase()) !== -1;
			var isStoreName = item.storeName.toLowerCase().indexOf(storeName.toLowerCase()) !== -1;
			var isCreatorName = item.creatorName.toLowerCase().indexOf(creatorName.toLowerCase()) !== -1;

			// $log.log('isZoneName : ' + (isZoneName));
			// $log.log('isDealerName : ' + (isDealerName));
			// $log.log('isStoreName : ' + (isStoreName));
			// $log.log('isCreatorName : ' + (isCreatorName));

			return isZoneName && isDealerName && isStoreName && isCreatorName;
		});
	};

	$scope.tableParams = new NgTableParams({
		count: reports.length, // count per page
	}, {
		dataset: reports,
		counts: [],
		total: reports.length, // length of reports
		filterOptions: {
			filterFn: reportsFilter
		}
	});

	$scope.getReports = function(e, page, pageSize, filters) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		// reports = [{
		// 	id: 1,
		// 	reportTypeName: '',
		// 	createdAt: '2016-02-03',
		// 	limitDate: '2016-02-03',
		// 	zoneName: 'zone_name',
		// 	dealerName: 'dealer_name',
		// 	storeName: 'store_name',
		// 	creatorName: 'creator_name',
		// 	pdfUploaded: 'pdf_uploaded',
		// 	pdf: 'pdf'
		// }, {
		// 	id: 2,
		// 	reportTypeName: '',
		// 	createdAt: '2016-02-03',
		// 	limitDate: '2016-02-03',
		// 	zoneName: 'zone_name',
		// 	dealerName: 'dealer_name',
		// 	storeName: 'store_name',
		// 	creatorName: 'creator_name',
		// 	pdfUploaded: 'pdf_uploaded',
		// 	pdf: 'pdf'
		// }];

		// $log.log('hola');

		// $scope.tableParams.count(reports.length);
		// $scope.tableParams.settings({2
		// 	dataset: reports,
		// 	counts: [],
		// 	total: reports.length, // length of reports
		// 	filterOptions: {
		// 		filterComparator: false,
		// 		filterFn: reportsFilter
		// 	},
		// });
		DailyReports.query({
			all: true,
			'page[number]': page,
			'page[size]': pageSize,
			'filter[zone_name]': $scope.filters.zoneName,
			'filter[dealer_name]': $scope.filters.dealerName,
			'filter[store_name]': $scope.filters.storeName,
			'filter[creator_name]': $scope.filters.creatorName,
			'fields[reports]': 'zone_name,store_name,dealer_name,created_at,limit_date,task_start,title,assigned_user_names,creator_name,pdf_uploaded,pdf'
		}, function(success) {

			if (success.data) {
				reports = [];
				$scope.pagination.reports.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {

					reports.push({
						id: success.data[i].id,
						reportTypeName: '',
						createdAt: $filter('date')(success.data[i].attributes.created_at, 'dd-MM-yyyy'),
						limitDate: $filter('date')(success.data[i].attributes.limit_date, 'dd-MM-yyyy'),
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
						storeName: success.data[i].attributes.store_name,
						creatorName: success.data[i].attributes.creator_name,
						pdfUploaded: success.data[i].attributes.pdf_uploaded,
						pdf: success.data[i].attributes.pdf
					});

				}
				$log.log(reports);

				$scope.tableParams.count(reports.length);
				$scope.tableParams.settings({
					dataset: reports,
					counts: [],
					total: reports.length, // length of reports
					filterOptions: {
						filterComparator: false,
						filterFn: reportsFilter,
						// filterDelay: 1000
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
				}, $scope.pagination.reports.pages._current, 30, {
					zoneName: '',
					dealerName: '',
					storeName: '',
					creatorName: ''
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