'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardSaleCtrl
 * @description
 * # DashboardSaleCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

// .controller('Filters', function($scope, $log, Zones, Dealers, Stores, Users, Utils, Asd) {

// 	var getZones = function(e) {
// 		if (!e.success) {
// 			$log.error(e.detail);
// 			return;
// 		}

// 		$scope.page.filters.zone.list = [];

// 		Zones.query({}, function(success) {
// 			if (success.data) {
// 				angular.forEach(success.data, function(value, key) {
// 					Asd.zones.push({
// 						id: parseInt(value.id),
// 						name: value.attributes.name,
// 						dealersIds: value.attributes.dealer_ids
// 					});
// 					Asd.success = true;
// 				});
// 			} else {
// 				$log.error(success);
// 			}
// 		}, function(error) {
// 			$log.error(error);
// 			if (error.status === 401) {
// 				Utils.refreshToken(getZones);
// 			}
// 		});
// 	};

// 	getZones({
// 		success: true,
// 		detail: 'OK'
// 	});

// 	$scope.getDealers = function(e) {
// 		// Valida si el parametro e.success se seteó true para el refresh token
// 		if (!e.success) {
// 			$log.error(e.detail);
// 			return;
// 		}

// 		$scope.page.filters.dealer.disabled = true;
// 		$scope.page.filters.dealer.list = [];
// 		storesIncluded = [];

// 		Dealers.query({
// 			include: 'stores'
// 		}, function(success) {
// 			if (success.data && success.included) {

// 				storesIncluded = success.included;

// 				angular.forEach($scope.page.filters.zone.selected.dealersIds, function(dealer, key) {
// 					angular.forEach(success.data, function(data, key) {
// 						if (dealer === parseInt(data.id)) {
// 							$scope.page.filters.dealer.list.push({
// 								id: parseInt(data.id),
// 								name: data.attributes.name,
// 								storesIds: data.relationships.stores.data
// 							});
// 						}
// 					});
// 				});
// 				$scope.page.filters.dealer.disabled = false;
// 			} else {
// 				$log.error(success);
// 			}
// 		}, function(error) {
// 			$log.error(error);
// 			if (error.status === 401) {
// 				Utils.refreshToken($scope.getDealers);
// 			}
// 		});
// 	};

// 	$scope.getStores = function(e) {
// 		// Valida si el parametro e.success se seteó true para el refresh token
// 		if (!e.success) {
// 			$log.error(e.detail);
// 			return;
// 		}

// 		$scope.page.filters.store.disabled = true;
// 		$scope.page.filters.store.list = [];

// 		Stores.query({}, function(success) {
// 			if (success.data) {
// 				for (i = 0; i < storesIncluded.length; i++) {
// 					for (j = 0; j < $scope.page.filters.dealer.selected.storesIds.length; j++) {
// 						if (parseInt($scope.page.filters.dealer.selected.storesIds[j].id) === parseInt(success.data[i].id)) {
// 							$scope.page.filters.store.list.push({
// 								id: parseInt(success.data[i].id),
// 								name: success.data[i].attributes.name
// 							});
// 							break;
// 						}
// 					}
// 				}
// 				$scope.page.filters.store.disabled = false;
// 			} else {
// 				$log.error(success);
// 			}
// 		}, function(error) {
// 			$log.error(error);
// 			if (error.status === 401) {
// 				Utils.refreshToken($scope.getStores);
// 			}
// 		});
// 	};

// 	var getUsers = function(e) {
// 		// Valida si el parametro e.success se seteó true para el refresh token
// 		if (!e.success) {
// 			$log.error(e.detail);
// 			return;
// 		}

// 		$scope.page.filters.supervisor.disabled = true;
// 		$scope.page.filters.instructor.disabled = true;
// 		$scope.page.filters.instructor.list = [];
// 		$scope.page.filters.supervisor.list = [];

// 		Users.query({}, function(success) {
// 			// $log.log(success);
// 			if (success.data) {

// 				for (var i = 0; i < success.data.length; i++) {
// 					if (success.data[i].attributes.active) {
// 						$scope.page.filters.instructor.list.push({
// 							id: parseInt(success.data[i].id),
// 							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
// 						});
// 						$scope.page.filters.supervisor.list.push({
// 							id: parseInt(success.data[i].id),
// 							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
// 						});
// 					}
// 				}

// 				$scope.page.filters.instructor.disabled = false;
// 				$scope.page.filters.supervisor.disabled = false;

// 			} else {
// 				$log.error(success);
// 			}
// 		}, function(error) {
// 			$log.log(error);
// 			if (error.status === 401) {
// 				Utils.refreshToken(getUsers);
// 			}
// 		});
// 	};

// })

.controller('DashboardSaleCtrl', function($scope, $log, $uibModal, Utils, Dashboard, DataPlayStation) {

	$scope.page = {
		title: 'Venta',
		filters: {
			zone: {
				list: [],
				selected: null
			},
			dealer: {
				list: [],
				selected: null,
				disabled: false
			},
			store: {
				list: [],
				selected: null,
				disabled: false
			},
			instructor: {
				list: [],
				selected: null,
				disabled: false
			},
			supervisor: {
				list: [],
				selected: null,
				disabled: false
			},
			month: {
				value: new Date(),
				isOpen: false
			}
		}
	};

	var storesIncluded = [],
		i = 0,
		j = 0;

	var getZones = function() {
		DataPlayStation.getZones({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.zone.list = data.data;
			$scope.page.filters.zone.selected = data.data[0];
		}).catch(function(error) {
			$log.error(error);
		});
	};

	$scope.getDealers = function(e, zoneSelected) {
		$scope.page.filters.dealer.disabled = true;
		DataPlayStation.getDealers({
			success: true,
			detail: 'OK'
		}, zoneSelected).then(function(data) {
			$scope.page.filters.dealer.list = data.data;
			$scope.page.filters.dealer.selected = data.data[0];
			$scope.page.filters.dealer.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	$scope.getStores = function(e, dealerSelected) {
		$scope.page.filters.store.disabled = true;
		DataPlayStation.getStores({
			success: true,
			detail: 'OK'
		}, dealerSelected).then(function(data) {
			$log.log(data);
			$scope.page.filters.store.list = data.data;
			$scope.page.filters.store.selected = data.data[0];
			$scope.page.filters.store.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	var getUsers = function(e) {
		$scope.page.filters.supervisor.disabled = true;
		$scope.page.filters.instructor.disabled = true;
		DataPlayStation.getUsers({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.instructor.list = data.data;
			$scope.page.filters.supervisor.list = data.data;
			$scope.page.filters.instructor.selected = $scope.page.filters.instructor.list[0];
			$scope.page.filters.supervisor.selected = $scope.page.filters.supervisor.list[0];
			$scope.page.filters.instructor.disabled = false;
			$scope.page.filters.supervisor.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	$scope.chartConfigSales = Utils.setChartConfig('column', 400, {}, {
		min: 0,
		title: {
			text: null
		},
		stackLabels: {
			enabled: true,
			style: {
				fontWeight: 'normal',
				color: 'gray'
			}
		}
	}, {
		categories: [],
		title: {
			text: ''
		}
	}, []);

	$scope.chartConfigSalesBetweenConsoles = Utils.setChartConfig('column', 422, {
		column: {
			stacking: 'normal',
			dataLabels: {
				enabled: true,
				color: 'white',
				style: {
					textShadow: '0 0 3px black',
					fontWeight: 'normal'
				}
			}
		}
	}, {
		min: 0,
		title: {
			text: null
		},
		stackLabels: {
			enabled: true,
			style: {
				fontWeight: 'normal',
				color: 'gray'
			}
		}
	}, {
		categories: ['Norte', 'Oriente', 'Sur', 'Poniente', 'X'],
		title: {
			text: 'Plataformas'
		}
	}, [{
		name: 'Playstation',
		data: [5, 3, 4, 2, 1]
	}, {
		name: 'Xbox',
		data: [2, 2, 3, 2, 1]
	}, {
		name: 'Nintendo',
		data: [3, 4, 4, 2, 1]
	}]);

	$scope.openModalViewAllSalesValues = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'viewAllSalesValuesModal.html',
			controller: 'ViewAllSalesValuesModalInstance',
			size: 'md',
			resolve: {

			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	$scope.donutData = [{
		label: 'PlayStation',
		value: 25,
		color: '#3f5b71'
	}, {
		label: 'XBox',
		value: 20,
		color: '#f19122'
	}, {
		label: 'Nintendo',
		value: 15,
		color: '#fcc111'
	}];

	$scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {}, {
		categories: ['Juego', 'Juego', 'Juego', 'Juego', 'Juego'],
		title: {
			text: 'Juegos'
		}
	}, [{
		name: 'Cantidad',
		data: [5, 3, 4, 3, 7]
	}, {
		name: 'Monto',
		data: [2, 2, 3, 3, 7]
	}]);

	$scope.getDashboardInfo = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$log.log('se ejecuta getDashboardInfo()');
		var zoneIdSelected = $scope.page.filters.zone.selected ? $scope.page.filters.zone.selected.id : '';
		var dealerIdSelected = $scope.page.filters.dealer.selected ? $scope.page.filters.dealer.selected.id : '';
		var storeIdSelected = $scope.page.filters.store.selected ? $scope.page.filters.store.selected.id : '';
		var instructorIdSelected = $scope.page.filters.instructor.selected ? $scope.page.filters.instructor.selected.id : '';
		var supervisorIdSelected = $scope.page.filters.supervisor.selected ? $scope.page.filters.supervisor.selected.id : '';
		var monthSelected = $scope.page.filters.month.value.getMonth() + 1;
		var yearSelected = $scope.page.filters.month.value.getFullYear();

		var categories = [];
		$scope.categories = [];
		var hardwareSales = [];
		var accesoriesSales = [];
		var gamesSales = [];

		// $log.log(zoneIdSelected);
		// $log.log(dealerIdSelected);
		// $log.log(storeIdSelected);
		// $log.log(instructorIdSelected);
		// $log.log(supervisorIdSelected);
		// $log.log(monthSelected);
		// $log.log(yearSelected);

		Dashboard.query({
			category: 'sales',
			zone_id: zoneIdSelected,
			dealer_id: dealerIdSelected,
			store_id: storeIdSelected,
			instructor_id: instructorIdSelected,
			supervisor_id: supervisorIdSelected,
			month: monthSelected,
			year: yearSelected
		}, function(success) {
			// $log.log(success);
			if (success.data) {
				var hardwareTotal = 0,
					accessoriesTotal = 0,
					gamesTotal = 0;

				// Rescato los nombres de las plataformas
				angular.forEach(success.data.attributes.sales_by_company, function(value, key) {
					categories.push(value.name);
					hardwareSales.push(value.sales_by_type.hardware);
					accesoriesSales.push(value.sales_by_type.accessories);
					gamesSales.push(value.sales_by_type.games);
					$scope.categories.push({
						name: value.name,
						hardware: value.sales_by_type.hardware,
						accessories: value.sales_by_type.accessories,
						games: value.sales_by_type.games
					});
				});
				// Suma acumulada de hardware
				angular.forEach(hardwareSales, function(value, key) {
					hardwareTotal = value + hardwareTotal;
				});
				// Suma acumulada de accesorios
				angular.forEach(accesoriesSales, function(value, key) {
					accessoriesTotal = value + accessoriesTotal;
				});
				// Suma acumulada de juegos
				angular.forEach(gamesSales, function(value, key) {
					gamesTotal = value + gamesTotal;
				});
				$scope.totalsSale = [{
					title: 'Total',
					hardwareTotal: hardwareTotal,
					accessoriesTotal: accessoriesTotal,
					gamesTotal: gamesTotal
				}];

				// $log.log($scope.categories);
				// $log.log(hardwareSales);
				// $log.log(accesoriesSales);
				// $log.log(gamesSales);

				$scope.chartConfigSales = Utils.setChartConfig('column', 300, {
					column: {
						stacking: 'normal',
						dataLabels: {
							enabled: true,
							color: 'white',
							style: {
								textShadow: '0 0 3px black',
								fontWeight: 'normal'
							}
						}
					}
				}, {
					min: 0,
					title: {
						text: null
					},
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'normal',
							color: 'gray'
						}
					}
				}, {
					categories: categories,
					title: {
						text: 'Plataformas'
					}
				}, [{
					name: 'Hardware',
					data: hardwareSales
				}, {
					name: 'Accesorios',
					data: accesoriesSales
				}, {
					name: 'Juegos',
					data: gamesSales
				}]);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	getZones();

	getUsers();

	$scope.getDashboardInfo({
		success: true,
		detail: 'OK'
	});

})

.controller('ViewAllSalesValuesModalInstance', function($scope, $uibModalInstance) {

	$scope.modal = {
		title: {
			text: null,
			show: false
		},
		subtitle: {
			text: null,
			show: false
		},
		alert: {
			show: false,
			color: null,
			text: null,
			title: null
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

});