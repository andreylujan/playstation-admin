'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardPromotersAndActivitiesCtrl
 * @description
 * # DashboardPromotersAndActivitiesCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardPromotersAndActivitiesCtrl', function($scope, $log, $uibModal, Utils, Dashboard, DataPlayStation) {

	$scope.page = {
		title: 'Promotores y Actividades',
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

	$scope.chartConfigStoreVisits = Utils.setChartConfig('', 600, {}, {
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
	}, [{
		name: 'Reportes',
		data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	}]);

	$scope.getDashboardInfo = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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