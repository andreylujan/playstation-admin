'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardSaleCtrl
 * @description
 * # DashboardSaleCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardSaleCtrl', function($scope, $log, $uibModal, Zones, Dealers, Stores, Users, Utils, DashboardSales) {

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

	var getZones = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.filters.zone.list = [];

		Zones.query({}, function(success) {
			if (success.data) {

				angular.forEach(success.data, function(value, key) {
					$scope.page.filters.zone.list.push({
						id: parseInt(value.id),
						name: value.attributes.name,
						dealersIds: value.attributes.dealer_ids
					});
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

	$scope.getDealers = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.filters.dealer.disabled = true;
		$scope.page.filters.dealer.list = [];
		storesIncluded = [];

		Dealers.query({
			include: 'stores'
		}, function(success) {
			if (success.data && success.included) {

				storesIncluded = success.included;

				angular.forEach($scope.page.filters.zone.selected.dealersIds, function(dealer, key) {
					angular.forEach(success.data, function(data, key) {
						if (dealer === parseInt(data.id)) {
							$scope.page.filters.dealer.list.push({
								id: parseInt(data.id),
								name: data.attributes.name,
								storesIds: data.relationships.stores.data
							});
						}
					});
				});
				$scope.page.filters.dealer.disabled = false;
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getDealers);
			}
		});
	};

	$scope.getStores = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.filters.store.disabled = true;
		$scope.page.filters.store.list = [];

		Stores.query({}, function(success) {
			if (success.data) {
				for (i = 0; i < storesIncluded.length; i++) {
					for (j = 0; j < $scope.page.filters.dealer.selected.storesIds.length; j++) {
						if (parseInt($scope.page.filters.dealer.selected.storesIds[j].id) === parseInt(success.data[i].id)) {
							$scope.page.filters.store.list.push({
								id: parseInt(success.data[i].id),
								name: success.data[i].attributes.name
							});
							break;
						}
					}
				}
				$scope.page.filters.store.disabled = false;
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getStores);
			}
		});
	};

	var getUsers = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.filters.supervisor.disabled = true;
		$scope.page.filters.instructor.disabled = true;
		$scope.page.filters.instructor.list = [];
		$scope.page.filters.supervisor.list = [];

		Users.query({}, function(success) {
			// $log.log(success);
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					if (success.data[i].attributes.active) {
						$scope.page.filters.instructor.list.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
						$scope.page.filters.supervisor.list.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}

				$scope.page.filters.instructor.disabled = false;
				$scope.page.filters.supervisor.disabled = false;

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

	$scope.chartConfigSales = Utils.setChartConfig('column', 400, {}, {
		enabled: true,
		style: {
			fontWeight: 'normal',
			color: 'gray'
		}
	}, {
		categories: [],
		title: {
			text: ''
		}
	}, []);

	$scope.chartConfigSalesBetweenConsoles = Utils.setChartConfig('column', 400, {
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
		enabled: true,
		style: {
			fontWeight: 'normal',
			color: 'gray'
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

		DashboardSales.query({
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
					enabled: true,
					style: {
						fontWeight: 'normal',
						color: 'gray'
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

	getZones({
		success: true,
		detail: 'OK'
	});

	getUsers({
		success: true,
		detail: 'OK'
	});

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