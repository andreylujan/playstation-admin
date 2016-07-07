'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('PromotionsListCtrl', function($scope, $filter, $log, $window, $state, $uibModal, ngTableParams, Promotions, Zones, Dealers, Users, Utils) {

	$scope.page = {
		title: 'Promociones'
	};

	var i = 0;
	var j = 0;
	var k = 0;
	var zones = [];
	var dealers = [];
	var users = [];
	var dealersNames = '';

	$scope.promotions = [];

	var getPromotions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.promotions = [];

		Promotions.query({
			include: 'checklist,users,zones,dealers'
		}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {

					$scope.promotions.push({
						id: success.data[i].id,
						title: success.data[i].attributes.title,
						startDate: success.data[i].attributes.start_date,
						endDate: success.data[i].attributes.end_date,
						zones: success.data[i].relationships.zones.data,
						dealers: success.data[i].relationships.dealers.data
							// users: success.data[i].relationships.users.data
					});

				}

				for (i = 0; i < $scope.promotions.length; i++) {

					dealersNames = '';

					for (j = 0; j < $scope.promotions[i].zones.length; j++) {
						for (k = 0; k < zones.length; k++) {
							if (parseInt($scope.promotions[i].zones[j].id) === parseInt(zones[k].id)) {
								if (j === 0) {
									$scope.promotions[i].zoneNames = $filter('capitalize')(zones[k].name, true);
								} else {
									$scope.promotions[i].zoneNames = $scope.promotions[i].zoneNames + '<br>' + $filter('capitalize')(zones[k].name, true);
								}
								break;
							}
						}
					}
					for (j = 0; j < $scope.promotions[i].dealers.length; j++) {
						for (k = 0; k < dealers.length; k++) {
							if (parseInt($scope.promotions[i].dealers[j].id) === parseInt(dealers[k].id)) {
								if (j === 0) {
									$scope.promotions[i].dealerNames = $filter('capitalize')(dealers[k].name, true);
								} else {
									$scope.promotions[i].dealerNames = $scope.promotions[i].dealerNames + '<br>' + $filter('capitalize')(dealers[k].name, true);
								}
								break;
							}
						}
					}
					// for (j = 0; j < $scope.promotions[i].users.length; j++) {
					// 	for (k = 0; k < users.length; k++) {
					// 		if (parseInt($scope.promotions[i].users[j].id) === parseInt(users[k].id)) {
					// 			if (j === 0) {
					// 				$scope.promotions[i].userNames = users[k].fullName;
					// 			} else {
					// 				$scope.promotions[i].userNames = $scope.promotions[i].userNames + '<br>' + users[k].fullName;
					// 			}
					// 			// $scope.promotions[i].users[j].fullName = users[k].fullName;
					// 			break;
					// 		}
					// 	}
					// }
				}

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 50,
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						title: 'asc' // initial sorting
					}
				}, {
					total: $scope.promotions.length, // length of $scope.promotions
					getData: function($defer, params) {
						var filteredData = params.filter() ?
							$filter('filter')($scope.promotions, params.filter()) :
							$scope.promotions;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.promotions;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getPromotions);
			}
		});
	};

	var getZones = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		zones = [];

		Zones.query({}, function(success) {
			if (success.data) {
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
			} else {
				$log.error(success);
			}

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getZones);
			}
		});
	};

	var getDealers = function(e) {
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

			getUsers({
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

	var getUsers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		users = [];

		Users.query({
			idUser: ''
		}, function(success) {

			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					users.push({
						id: success.data[i].id,
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name,
						email: success.data[i].attributes.email,
						roleName: success.data[i].attributes.role_name,
						roleId: success.data[i].attributes.role_id,
						active: success.data[i].attributes.active
					});
				}
				getPromotions({
					success: true,
					detail: 'OK'
				});

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
		});

	};

	$scope.gotoNewPromotion = function(idPromotion) {

		if (idPromotion) {
			$state.go('app.promotions.new', {
				idPromotion: idPromotion
			});
		} else {
			$state.go('app.promotions.new');
		}

	};

	$scope.openModalRemovePromotion = function(idPromotion) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'removeModal.html',
			controller: 'RemoveModalInstance',
			resolve: {
				idPromotion: function() {
					return idPromotion;
				}
			}
		});

		modalInstance.result.then(function() {
			getPromotions({
				success: true,
				detail: 'OK'
			});
		}, function() {
			// getPromotions();
		});
	};

	getZones({
		success: true,
		detail: 'OK'
	});
})

.controller('RemoveModalInstance', function($scope, $filter, $log, $uibModalInstance, idPromotion, Promotions, Utils) {

	$scope.modal = {
		promotion: {
			title: ''
		}
	};

	var getInfoPromotion = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Promotions.query({
			idPromotion: idPromotion
		}, function(success) {
			if (success.data) {
				$scope.modal.promotion.title = success.data.attributes.title;
			} else {
				$log.log('no se pudo obtener el titulo');
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getInfoPromotion);
			}
		});
	};

	$scope.removePromotion = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Promotions.delete({
			idPromotion: idPromotion
		}, function(success) {
			if (!success.errors) {
				$uibModalInstance.close();
			} else {
				$log.log('no se puso borrar');
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.removePromotion);
			}
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	getInfoPromotion({
		success: true,
		detail: 'OK'
	});

});