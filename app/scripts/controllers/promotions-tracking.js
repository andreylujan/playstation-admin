'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('PromotionsTrackingCtrl', function($scope, $filter, $uibModal, $log, $window, 
	$timeout, NgTableParams, Reports, Zones, Dealers, Stores, Users, PromotionsStates, 
	Utils, $element) {

	$scope.page = {
		title: 'Seguimiento de Promociones',
		finishedPromotions: {
			total: 0
		},
		pendingPromotions: {
			total: 0
		}
	};

	$scope.pagination = {
		finishedPromotions: {
			pages: {
				actual: 1,
				size: 30,
				_current: 1,
				total: 0,
			},
			total: 0
		},
		pendingPromotions: {
			pages: {
				actual: 1,
				size: 30,
				_current: 1,
				total: 0,
			}
		},
		total: 0
	};

	$scope.pageSize = 15;

	var reports = [];
	var zones = [];
	var dealers = [];
	var stores = [];
	var users = [];
	var i, j;

	$scope.filters = {
		id: null,
		title: null,
		activatedAt: null,
		endDate: null,
		startDate: null,
		zoneName: null,
		dealerName: null,
		storeName: null,
		creatorName: null,
		activatorName: null
	};

	$scope.checkboxes = {
      checked: false,
      items: {}
    };

	var finishedPromotions = [],
		pendingPromotions = [];

	/*$scope.tableParamsFinishedPromotions = new NgTableParams({
		page: 1,
		count: 15,
		filter: {
		},
		sorting: {
			activatedAt: 'desc'
		}
	}, {
		dataset: finishedPromotions,
		total: finishedPromotions.length,
	});*/

	/*$scope.tableParamsPendingPromotions = new NgTableParams({
		page: 1,
		count: 15,
		filter: {
		}
	}, {
		dataset: pendingPromotions,
		counts: [],
		total: pendingPromotions.length,
	});*/

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
			$log.error(error);
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
			$log.error(error);
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
			$log.error(error);
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
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
		});
	};

	$scope.getFinishedPromotions = function(e, page, pageSize, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var finishedPromotions = [];

		PromotionsStates.query({
			'page[number]': 1,
			'filter[activated]': true,
			'filter[id]': filters.id || null,
			'filter[title]': filters.title || null,
			'filter[activated_at]': filters.activatedAt || null,
			'filter[end_date]': filters.endDate || null,
			'filter[start_date]': filters.startDate || null,
			'filter[zone_name]': filters.zoneName || null,
			'filter[dealer_name]': filters.dealerName || null,
			'filter[store_name]': filters.storeName || null,
			'filter[creator_name]': filters.creatorName || null,
			'filter[activator_name]': filters.activatorName || null,
		}, function(success) {
			if (success.data) {
				$scope.page.finishedPromotions.total = success.meta.activated_promotions_count;
				$scope.pagination.finishedPromotions.pages.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {
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
						activatorName: success.data[i].attributes.activator_name,
						pdf: success.data[i].attributes.pdf,
						pdfUploaded: success.data[i].attributes.pdf_uploaded
					});
				}

				$scope.tableParamsFinishedPromotions = new NgTableParams({
					page: 1,
					count: 15,
					filter: {
					},
					sorting: {
						activatedAt: 'desc'
					}
				}, {
					total: finishedPromotions.length,
					dataset: finishedPromotions
				});

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getFinishedPromotions);
			}
		});
	};

	$scope.getPendingPromotions = function(e, page, pageSize, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		pendingPromotions = []
		PromotionsStates.query({
			'page[number]': 1,
			'filter[activated]': false,
			'filter[id]': filters.id || null,
			'filter[title]': filters.title || null,
			'filter[end_date]': filters.endDate || null,
			'filter[start_date]': filters.startDate || null,
			'filter[zone_name]': filters.zoneName || null,
			'filter[dealer_name]': filters.dealerName || null,
			'filter[store_name]': filters.storeName || null,
			'filter[creator_name]': filters.creatorName || null,
			'filter[activator_name]': filters.activatorName || null,
		}, function(success) {

			if (success.data) {
				$scope.page.pendingPromotions.total = success.meta.pending_promotions_count;
				$scope.pagination.pendingPromotions.pages.total = success.meta.page_count;

				for (i = 0; i < success.data.length; i++) {
					if (!success.data[i].attributes.activated) {
						pendingPromotions.push({
							id: success.data[i].id,
							title: success.data[i].attributes.title,
							activatedAt: success.data[i].attributes.activated_at,
							startDate: success.data[i].attributes.start_date,
							endDate: success.data[i].attributes.end_date,
							zoneName: success.data[i].attributes.zone_name,
							dealerName: success.data[i].attributes.dealer_name,
							storeName: success.data[i].attributes.store_name,
							creatorName: success.data[i].attributes.creator_name,
							activatorName: success.data[i].attributes.activator_name,
							pdf: success.data[i].attributes.pdf,
							pdfUploaded: success.data[i].attributes.pdf_uploaded
						});
					}
				}

				/*$scope.tableParamsPendingPromotions.count(pendingPromotions.length);
				$scope.tableParamsPendingPromotions.settings({
					dataset: pendingPromotions,
					counts: [],
					total: pendingPromotions.length
				});*/

				$scope.tableParamsPendingPromotions = new NgTableParams({
					page: 1,
					count: 15,
					filter: {
					}
				}, {
					total: pendingPromotions.length,
					dataset: pendingPromotions
				});
				// watch for check all checkbox
			    $scope.$watch(function() {
			      	return $scope.checkboxes.checked;
			    }, function(value) {
			      	angular.forEach(pendingPromotions, function(promotion) {
			        	$scope.checkboxes.items[promotion.id] = value;
			      	});
			    });

			    $scope.$watch(function() {
			      	return $scope.checkboxes.items;
			    }, function(values) {
			      	var checked = 0, unchecked = 0,
			          total = pendingPromotions.length;
			      	angular.forEach(pendingPromotions, function(promotion) {
			        	checked   +=  ($scope.checkboxes.items[promotion.id]) || 0;
			        	unchecked += (!$scope.checkboxes.items[promotion.id]) || 0;
			      	});
			      	if ((unchecked == 0) || (checked == 0)) {
			        	$scope.checkboxes.checked = (checked == total);
			      	}
			      	// grayed checkbox
			      	angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
			    }, true);

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
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
	}, $scope.pagination.pendingPromotions.pages._current, $scope.pageSize, $scope.filters);

	$scope.getFinishedPromotions({
		success: true,
		detail: 'OK'
	}, $scope.pagination.finishedPromotions.pages._current, $scope.pageSize, $scope.filters);

	$scope.openModalDeletePromotion = function(idPromotion) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageListPromotion.html',
			controller: 'MessageListPromotionModalInstance',
			resolve: {
				idPromotion: function() {
					return idPromotion;
				}
			}
		});

		modalInstance.result.then(function() {
			$window.location.reload();
		}, function() {});
	};

	$scope.openModalDeletePromotionGroup = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageListPromotionGroup.html',
			controller: 'MessageListPromotionModalInstanceGroup',
			resolve: {
				promotions: function() {
					return $scope.checkboxes;
				}
			}
		});
		modalInstance.result.then(function(datos) {
			$window.location.reload();
		}, function() {});
	};

})

.controller('MessageListPromotionModalInstanceGroup', function($scope, $log, $uibModalInstance, 
	promotions, PromotionsStatesDelete, Validators, Utils, $q) {
	$scope.modal = {
		cant: 0,
		title: {
			text: null
		},
		subtitle: {
			text: null
		},
		alert: {
			color: '',
			show: false,
			title: '',
			text: null
		},
		buttons: {
			delete: {
				border: false,
				show: true,
				text: 'Eliminar'
			}
		}
	};

	var promotionsToDelete = []

	angular.forEach(promotions.items, function(value, key) {
		if (value) {
			promotionsToDelete.push(key)
		}
	});

	$scope.modal.cat = promotionsToDelete.length



	$scope.deletePromotions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var deleted = 0;
		var error = 0;
		var promises = [];

		angular.forEach(promotionsToDelete, function(value, key) {
			var promise = PromotionsStatesDelete.delete({
				idPromotion: value
			}, function(success) {
				deleted++;
			}, function(error) {
				error++;
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.deleteReport);
				}
			});
			promises.push(promise);
		});
		$q.all(promises).then(()=> {
			console.error(promises)
			$uibModalInstance.close({
				action: 'close',
				success: promises
			});
		}).catch(function (err) {
            console.error(err)
        });

	};

	$scope.ok = function() {
		// $uibModalInstance.close($scope.selected.item);
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.text = '';
		$scope.modal.alert.show = false;
	};
})

.controller('MessageListPromotionModalInstance', function($scope, $log, $uibModalInstance, idPromotion, PromotionsStatesDelete, Validators, Utils) {
	//$log.error(idReport);
	$scope.modal = {
		title: {
			text: null
		},
		subtitle: {
			text: null
		},
		alert: {
			color: '',
			show: false,
			title: '',
			text: null
		},
		buttons: {
			delete: {
				border: false,
				show: true,
				text: 'Eliminar'
			}
		}
	};

	$scope.deletePromotion = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		PromotionsStatesDelete.delete({
			idPromotion: idPromotion
		}, function(success) {
			$log.log(success);
			$uibModalInstance.close();
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.deleteReport);
			}
		});

	};

	$scope.ok = function() {
		// $uibModalInstance.close($scope.selected.item);
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.text = '';
		$scope.modal.alert.show = false;
	};

});

/*


	var filterTimeout, filterTimeoutDuration = 1000;

	$scope.$watch('tableParamsFinishedPromotions.filter().id', function(newId) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.id = newId;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().title', function(newTitle) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.title = newTitle;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().activatedAt', function(newActivatedAt) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.activatedAt = newActivatedAt;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().startDate', function(newStartDate) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.startDate = newStartDate;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().endDate', function(newEndDate) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.endDate = newEndDate;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().zoneName', function(newZoneName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.zoneName = newZoneName;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().dealerName', function(newDealerName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}
		filterTimeout = $timeout(function() {
			$scope.filters.dealerName = newDealerName;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorNam85e: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().storeName', function(newStoreName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.storeName = newStoreName;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().creatorName', function(newCreatorName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.creatorName = newCreatorName;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsFinishedPromotions.filter().activatorName', function(newActivatorName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.activatorName = newActivatorName;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});



	$scope.$watch('tableParamsPendingPromotions.filter().id', function(newId) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.id = newId;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().title', function(newTitle) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.title = newTitle;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().endDate', function(newEndDate) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.endDate = newEndDate;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().startDate', function(newStartDate) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.startDate = newStartDate;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().zoneName', function(newZoneName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.zoneName = newZoneName;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().dealerName', function(newDealerName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.dealerName = newDealerName;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().storeName', function(newStoreName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.storeName = newStoreName;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().creatorName', function(newCreatorName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.creatorName = newCreatorName;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.$watch('tableParamsPendingPromotions.filter().activatorName', function(newActivatorName) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.filters.activatorName = newActivatorName;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, 15, {
				id: $scope.filters.id,
				title: $scope.filters.title,
				// activatedAt: $scope.filters.activatedAt,
				endDate: $scope.filters.endDate,
				startDate: $scope.filters.startDate,
				zoneName: $scope.filters.zoneName,
				dealerName: $scope.filters.dealerName,
				storeName: $scope.filters.storeName,
				creatorName: $scope.filters.creatorName,
				activatorName: $scope.filters.activatorName
			});
		}, filterTimeoutDuration);
	});

	$scope.incrementPageFinishedPromotions = function() {
		if ($scope.pagination.finishedPromotions.pages._current <= $scope.pagination.finishedPromotions.pages.total - 1) {
			$scope.pagination.finishedPromotions.pages._current++;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, $scope.pageSize, $scope.filters);
		}
	};

	$scope.decrementPagePromotionsPromotions = function() {
		if ($scope.pagination.finishedPromotions.pages._current > 1) {
			$scope.pagination.finishedPromotions.pages._current--;
			$scope.getFinishedPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.finishedPromotions.pages._current, $scope.pageSize, $scope.filters);
		}
	};

	$scope.incrementPagePendingPromotions = function() {
		if ($scope.pagination.pendingPromotions.pages._current <= $scope.pagination.pendingPromotions.pages.total - 1) {
			$scope.pagination.pendingPromotions.pages._current++;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, $scope.pageSize, $scope.filters);
		}
	};

	$scope.decrementPagePendingPromotions = function() {
		if ($scope.pagination.pendingPromotions.pages._current > 1) {
			$scope.pagination.pendingPromotions.pages._current--;
			$scope.getPendingPromotions({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pendingPromotions.pages._current, $scope.pageSize, $scope.filters);
		}
	};

*/