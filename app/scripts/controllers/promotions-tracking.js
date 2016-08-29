'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('PromotionsTrackingCtrl', function($scope, $filter, $log, $window, NgTableParams, Reports, Zones, Dealers, Stores, Users, PromotionsStates, Utils) {

	$scope.page = {
		title: 'Seguimiento de promociones',
	};

	$scope.pagination = {
		finishedPromotions: {
			pages: {
				actual: 1,
				size: 30,
				_current: 1,
				total: 0,
			}
		},
		pendingPromotions: {
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
		if ($scope.pagination.finishedPromotions.pages._current <= $scope.pagination.finishedPromotions.pages.total - 1) {
			$scope.pagination.finishedPromotions.pages._current++;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current);
		}
	};

	$scope.decrementPagePendingTasks = function() {
		if ($scope.pagination.finishedPromotions.pages._current > 1) {
			$scope.pagination.finishedPromotions.pages._current--;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current);
		}
	};

	$scope.incrementPagePendingTasks = function() {
		if ($scope.pagination.pendingPromotions.pages._current <= $scope.pagination.pendingPromotions.pages.total - 1) {
			$scope.pagination.pendingPromotions.pages._current++;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current);
		}
	};

	$scope.decrementPagePendingTasks = function() {
		if ($scope.pagination.pendingPromotions.pages._current > 1) {
			$scope.pagination.pendingPromotions.pages._current--;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current);
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

	$scope.getFinishedPromotions = function(e, page) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var finishedPromotions = [];

		PromotionsStates.query({
			'page[number]': page,
			'page[size]': $scope.pagination.finishedPromotions.pages.size
		}, function(success) {

			if (success.data) {
				$scope.pagination.finishedPromotions.pages.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {
					if (success.data[i].activated) {
						finishedPromotions.push({
							id: success.data[i].id,
							title: success.data[i].attributes.title,
							activatedAt: success.data[i].attributes.activated_at,
							startDate: success.data[i].attributes.start_date,
							endDate: success.data[i].attributes.end_date,
							zoneName: success.data[i].attributes.zone_name,
							dealerName: success.data[i].attributes.dealer_name,
							storeName: success.data[i].attributes.store_name,
							creatorName: success.data[i].attributes.creator_name,
							pdf: success.data[i].attributes.pdf,
							pdfUploaded: success.data[i].attributes.pdf_uploaded,
						});
					}
				}
				$log.log('finishedPromotions');

				$log.log(finishedPromotions);

				$scope.tableParamsFinishedPromotions = new NgTableParams({
					page: 1, // show first page
					count: finishedPromotions.length, // count per page
					sorting: {
						id: 'asc' // initial sorting
					}
				}, {
					counts: [],
					total: finishedPromotions.length, // length of stores
					dataset: finishedPromotions
				});
			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getFinishedPromotions);
			}
		});
	};

	$scope.getPendingPromotions = function(e, page) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var pendingPromotions = [];

		PromotionsStates.query({
			'page[number]': page,
			'page[size]': $scope.pagination.pendingPromotions.pages.size
		}, function(success) {

			if (success.data) {
				$scope.pagination.pendingPromotions.pages.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {
					if (!success.data[i].activated) {
						pendingPromotions.push({
							id: success.data[i].id,
							title: success.data[i].attributes.title,
							activatedAt: success.data[i].attributes.activated_at,
							startDate: success.data[i].attributes.start_date,
							limitDate: success.data[i].attributes.limit_date,
							zoneName: success.data[i].attributes.zone_name,
							dealerName: success.data[i].attributes.dealer_name,
							storeName: success.data[i].attributes.store_name,
							activatorName: success.data[i].attributes.activator_name,
							pdf: success.data[i].attributes.pdf,
							pdfUploaded: success.data[i].attributes.pdf_uploaded,
						});
					}
				}
				$log.log('pending');
				$log.log(pendingPromotions);

				$scope.tableParamsPendingPromotions = new NgTableParams({
					page: 1, // show first page
					count: pendingPromotions.length, // count per page
					sorting: {
						id: 'asc' // initial sorting
					}
				}, {
					counts: [],
					total: pendingPromotions.length, // length of stores
					dataset: pendingPromotions
				});
			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getFinishedPromotions);
			}
		});
	};

	$scope.downloadPdf = function(event) {
		var pdf = angular.element(event.target).data('pdf');
		if (pdf) {
			$window.open(pdf, '_blank');
		}
	};

	$scope.getPendingPromotions({
		success: true,
		detail: 'OK'
	}, $scope.pagination.pendingPromotions.pages._current);

	$scope.getFinishedPromotions({
		success: true,
		detail: 'OK'
	}, $scope.pagination.finishedPromotions.pages._current);

	// getZones({
	// 	success: true,
	// 	detail: 'OK'
	// });

});