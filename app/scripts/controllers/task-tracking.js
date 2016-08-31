'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('TaskTrackingCtrl', function($scope, $filter, $log, $window, NgTableParams, Reports, Zones, Dealers, Stores, Users, Utils) {

	$scope.page = {
		title: 'Seguimiento de tareas',
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
				size: 30,
				_current: 1,
				total: 0,
			}
		}
	};

	var reports = [];
	var zones = [];
	var dealers = [];
	var stores = [];
	var users = [];
	var i, j;

	$scope.incrementPageFinishedTasks = function() {
		if ($scope.pagination.finishedTasks.pages._current <= $scope.pagination.finishedTasks.pages.total - 1) {
			$scope.pagination.finishedTasks.pages._current++;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current);
		}
	};

	$scope.decrementPageFinishedTasks = function() {
		if ($scope.pagination.finishedTasks.pages._current > 1) {
			$scope.pagination.finishedTasks.pages._current--;
			$scope.getFinishedTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedTasks.pages._current);
		}
	};

	$scope.incrementPagePendingTasks = function() {
		if ($scope.pagination.pendingTasks.pages._current <= $scope.pagination.pendingTasks.pages.total - 1) {
			$scope.pagination.pendingTasks.pages._current++;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current);
		}
	};

	$scope.decrementPagePendingTasks = function() {
		if ($scope.pagination.pendingTasks.pages._current > 1) {
			$scope.pagination.pendingTasks.pages._current--;
			$scope.getPendingTasks({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingTasks.pages._current);
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

	$scope.getFinishedTasks = function(e, page) {

		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var finishedTasks = [];

		Reports.query({
			'all': true,
			'page[number]': page,
			'page[size]': $scope.pagination.finishedTasks.pages.size,
			'filter[finished]': true,
			'filter[store_ids]': '',
			'filter[zone_ids]': '',
			'fields[reports]': 'finished_at,assigned_user_name,creator_name,store_name,zone_name,dealer_name,created_at,limit_date,finished,pdf,pdf_uploaded,task_start,title,description',
			'include': 'assigned_user',
			'fields[users]': 'email,first_name,last_name'
		}, function(success) {

			if (success.data) {
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
						assignedUserName: success.data[i].attributes.assigned_user_name,
						creatorName: success.data[i].attributes.creator_name,
						storeName: success.data[i].attributes.store_name,
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
					});
				}

				$scope.tableParamsFinishedTasks = new NgTableParams({
					page: 1, // show first page
					count: finishedTasks.length, // count per page
					sorting: {
						limitDate: 'asc' // initial sorting
					},
					filter: {
						storeName: ''
					}
				}, {
					counts: [],
					total: finishedTasks.length, // length of stores
					dataset: finishedTasks
				});
				$log.log($scope.tableParamsFinishedTasks);
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getFinishedTasks);
			}
		});
	};

	$scope.getPendingTasks = function(e, page) {

		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		var pendingTasks = [];

		Reports.query({
			'all': true,
			'page[number]': page,
			'page[size]': $scope.pagination.pendingTasks.pages.size,
			'filter[finished]': false,
			'filter[store_ids]': '',
			'filter[zone_ids]': '',
			'fields[reports]': 'finished_at,assigned_user_name,creator_name,store_name,zone_name,dealer_name,created_at,limit_date,finished,pdf,pdf_uploaded,task_start,title,description',
			'include': 'assigned_user',
			'fields[users]': 'email,first_name,last_name'
		}, function(success) {

			if (success.data) {
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
						assignedUserName: success.data[i].attributes.assigned_user_name,
						creatorName: success.data[i].attributes.creator_name,
						storeName: success.data[i].attributes.store_name,
						zoneName: success.data[i].attributes.zone_name,
						dealerName: success.data[i].attributes.dealer_name,
						finishedAt: success.data[i].attributes.finished_at
					});
				}

				$scope.tableParamsPendingTasks = new NgTableParams({
					page: 1, // show first page
					count: pendingTasks.length, // count per page
					sorting: {
						limitDate: 'asc' // initial sorting
					}
				}, {
					counts: [],
					total: pendingTasks.length, // length of stores
					dataset: pendingTasks
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

	$scope.downloadPdf = function(event) {
		var pdf = angular.element(event.target).data('pdf');
		if (pdf) {
			$window.open(pdf, '_blank');
		}
	};

	$scope.getPendingTasks({
		success: true,
		detail: 'OK'
	}, $scope.pagination.pendingTasks.pages._current);

	$scope.getFinishedTasks({
		success: true,
		detail: 'OK'
	}, $scope.pagination.finishedTasks.pages._current);

});