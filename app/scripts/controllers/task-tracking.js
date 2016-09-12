'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('TaskTrackingCtrl', function($scope, $filter, $log, $window, $timeout, AssignedReports, NgTableParams, Reports, Zones, Dealers, Stores, Users, Utils) {

	$scope.page = {
		title: 'Seguimiento Tareas',
		finishedTasks: {
			total: 0
		},
		pendingTasks: {
			total: 0
		}
	};

	$scope.pagination = {
		finishedTasks: {
			pages: {
				actual: 1,
				size: 10,
				_current: 1,
				total: 0,
			}
		},
		pendingTasks: {
			pages: {
				actual: 1,
				size: 15,
				_current: 1,
				total: 0,
			}
		}
	};
	$scope.filters = {
		id: null,
		title: null,
		createdAt: null,
		limitDate: null,
		finishedAt: null,
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
		finishedAt: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null
	};

	var zones = [];
	var dealers = [];
	var stores = [];
	var users = [];
	var i, j;
	var finishedTasks = [],
		pendingTasks = [];

	$scope.tableParamsFinishedTasks = new NgTableParams({
		count: finishedTasks.length, // count per page
	}, {
		dataset: finishedTasks,
		counts: [],
		total: finishedTasks.length, // length of finishedTasks
		filterOptions: {
			filterDelay: 1500
		}
	});

	var filterTimeout, filterTimeoutDuration = 1000;

	$scope.$watch('tableParamsFinishedTasks.filter().id', function(newId) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.id = newId;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().createdAt', function(newCreatedAt) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.createdAt = newCreatedAt;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().limitDate', function(newLimitDate) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.limitDate = newLimitDate;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().title', function(newTitle) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.title = newTitle;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().zoneName', function(newZoneName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.zoneName = newZoneName;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().dealerName', function(newDealerName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.dealerName = newDealerName;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().storeName', function(newStoreName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.storeName = newStoreName;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsFinishedTasks.filter().creatorName', function(newCreatorName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.creatorName = newCreatorName;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.tableParamsPendingTasks = new NgTableParams({
		count: pendingTasks.length, // count per page
	}, {
		dataset: pendingTasks,
		counts: [],
		total: pendingTasks.length, // length of pendingTasks
		filterOptions: {
			filterDelay: 1500
		}
	});

	$scope.$watch('tableParamsPendingTasks.filter().id', function(newId) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.id = newId;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().createdAt', function(newCreatedAt) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.createdAt = newCreatedAt;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingTasks.filter().limitDate', function(newLimitDate) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.limitDate = newLimitDate;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().title', function(newTitle) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.title = newTitle;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().zoneName', function(newZoneName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.zoneName = newZoneName;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().dealerName', function(newDealerName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.dealerName = newDealerName;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().storeName', function(newStoreName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.storeName = newStoreName;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.$watch('tableParamsPendingTasks.filter().creatorName', function(newCreatorName) {
		if (filterTimeout) $timeout.cancel(filterTimeout);

		filterTimeout = $timeout(function() {
			filters.creatorName = newCreatorName;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				finishedAt: filters.finishedAt,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}, filterTimeoutDuration);

	});

	$scope.incrementPageFinishedTasks = function() {
		if ($scope.pagination.finishedTasks.pages._current <= $scope.pagination.finishedTasks.pages.total - 1) {
			$scope.pagination.finishedTasks.pages._current++;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}
	};

	$scope.decrementPageFinishedTasks = function() {
		if ($scope.pagination.finishedTasks.pages._current > 1) {
			$scope.pagination.finishedTasks.pages._current--;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}
	};

	$scope.incrementPagePendingTasks = function() {
		if ($scope.pagination.pendingTasks.pages._current <= $scope.pagination.pendingTasks.pages.total - 1) {
			$scope.pagination.pendingTasks.pages._current++;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
			});
		}
	};

	$scope.decrementPagePendingTasks = function() {
		if ($scope.pagination.pendingTasks.pages._current > 1) {
			$scope.pagination.pendingTasks.pages._current--;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current, 15, {
				id: filters.id,
				title: filters.title,
				zoneName: filters.zoneName,
				createdAt: filters.createdAt,
				limitDate: filters.limitDate,
				dealerName: filters.dalerName,
				storeName: filters.storeName,
				creatorName: filters.creatorName
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

	$scope.getFinishedTasks = function(e, page, pageSize, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		AssignedReports.query({
			'all': true,
			'page[number]': page,
			'page[size]': pageSize,
			'filter[finished]': true,
			'filter[id]': filters.id || null,
			'filter[created_at]': filters.createdAt || null,
			'filter[limit_date]': filters.limitDate || null,
			'filter[finished_at]': filters.finishedAt || null,
			'filter[title]': filters.title || null,
			'filter[zone_name]': filters.zoneName || null,
			'filter[dealer_name]': filters.dealerName || null,
			'filter[store_name]': filters.storeName || null,
			'filter[creator_name]': filters.creatorName || null,
			'fields[reports]': 'zone_name,store_name,dealer_name,created_at,limit_date,task_start,title,assigned_user_names,creator_name,pdf_uploaded,pdf'
		}, function(success) {

			if (success.data) {
				finishedTasks = [];
				$scope.page.finishedTasks.total = success.meta.finished_reports_count;
				$scope.pagination.finishedTasks.pages.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {
					finishedTasks.push({
						id: success.data[i].id,
						createdAt: success.data[i].attributes.created_at,
						taskStart: success.data[i].attributes.task_start,
						limitDate: success.data[i].attributes.limit_date,
						finishedAt: success.data[i].attributes.finished_at,
						finshed: success.data[i].attributes.finished,
						pdf: success.data[i].attributes.pdf,
						pdfUploaded: success.data[i].attributes.pdf_uploaded,
						title: success.data[i].attributes.title,
						description: success.data[i].attributes.description,
						assignedUserName: success.data[i].attributes.assigned_user_names,
						creatorName: success.data[i].attributes.creator_name,
						storeName: success.data[i].attributes.store_name,
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
					});
				}

				$scope.tableParamsFinishedTasks.count(finishedTasks.length);
				$scope.tableParamsFinishedTasks.settings({
					dataset: finishedTasks,
					counts: [],
					total: finishedTasks.length, // length of finishedTasks
					filterOptions: {
						filterDelay: 1500
					},
				});

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getFinishedTasks);
			}
		});
	};

	$scope.getPendingTasks = function(e, page, pageSize, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		AssignedReports.query({
			'all': true,
			'page[number]': page,
			'page[size]': pageSize,
			'filter[finished]': false,
			'filter[id]': filters.id || null,
			'filter[created_at]': filters.createdAt || null,
			'filter[limit_date]': filters.limitDate || null,
			'filter[finished_at]': filters.finishedAt || null,
			'filter[title]': filters.title || null,
			'filter[zone_name]': filters.zoneName || null,
			'filter[dealer_name]': filters.dealerName || null,
			'filter[store_name]': filters.storeName || null,
			'filter[creator_name]': filters.creatorName || null,
			'fields[reports]': 'zone_name,store_name,dealer_name,created_at,limit_date,task_start,title,assigned_user_names,creator_name,pdf_uploaded,pdf'
		}, function(success) {

			if (success.data) {
				pendingTasks = [];
				$scope.page.pendingTasks.total = success.meta.pending_reports_count;
				$scope.pagination.pendingTasks.pages.total = success.meta.page_count;


				for (i = 0; i < success.data.length; i++) {
					pendingTasks.push({
						id: success.data[i].id,
						createdAt: success.data[i].attributes.created_at,
						taskStart: success.data[i].attributes.task_start,
						limitDate: success.data[i].attributes.limit_date,
						finshed: success.data[i].attributes.finished,
						pdf: success.data[i].attributes.pdf,
						pdfUploaded: success.data[i].attributes.pdf_uploaded,
						title: success.data[i].attributes.title,
						description: success.data[i].attributes.description,
						assignedUserName: success.data[i].attributes.assigned_user_names,
						creatorName: success.data[i].attributes.creator_name,
						storeName: success.data[i].attributes.store_name,
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
						finishedAt: success.data[i].attributes.finished_at
					});
				}

				$scope.tableParamsPendingTasks.count(pendingTasks.length);
				$scope.tableParamsPendingTasks.settings({
					dataset: pendingTasks,
					counts: [],
					total: pendingTasks.length, // length of pendingTasks
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
				Utils.refreshToken($scope.getPendingTasks);
			}
		});
	};

	$scope.downloadPdf =
		function(event) {
			var pdf = angular.element(event.target).data('pdf');
			if (pdf) {
				$window.open(pdf, '_blank');
			}
		};

	$scope.getFinishedTasks({
		success: true,
		detail: 'OK'
	}, $scope.pagination.finishedTasks.pages._current, 15, {
		id: null,
		title: null,
		createdAt: null,
		limitDate: null,
		finishedAt: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null
	});

	$scope.getPendingTasks({
		success: true,
		detail: 'OK'
	}, $scope.pagination.pendingTasks.pages._current, 15, {
		id: null,
		title: null,
		createdAt: null,
		limitDate: null,
		finishedAt: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null
	});

});