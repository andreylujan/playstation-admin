'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardGoalsCtrl
 * @description
 * # DashboardGoalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardGoalsCtrl', function($scope, $log, $uibModal, $filter, Utils, NgTableParams, Dashboard, DataPlayStation) {

	$scope.page = {
		title: 'Metas y Comparativos',
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
				isOpen: false,
				options: {
					minMode: 'month',
					maxDate: new Date()
				}
			}
		},
		goals: {
			monthlySalesVsGoals: {
				loaded: false,
				list: [],
				chartConfig: {}
			},
			lastWeekComparison: {
				loaded: false,
				list: [],
				chartConfig: {},
				lastWeekOfYear: null,
				currentWeekOfYear: null
			},
			weeklySalesComparison: {
				loaded: false,
				list: [],
				chartConfig: {},
				lastYear: null,
				currentYear: null

			},
			monthlySalesComparison: {
				loaded: false,
				list: [],
				chartConfig: {},
				lastYear: null,
				currentYear: null

			}
		}
	};

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

		// Cada vez que se cargan los dealers, se limpia la lista de tiendas y se deselecciona la tienda anteriormente seleccionada
		$scope.page.filters.store.list = [];
		$scope.page.filters.store.selected = null;
	};

	$scope.getStores = function(e, zoneSelected, dealerSelected) {

		$scope.page.filters.store.disabled = true;
		DataPlayStation.getStores({
			success: true,
			detail: 'OK'
		}, zoneSelected, dealerSelected).then(function(data) {
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

		Dashboard.query({
			category: 'goals',
			zone_id: zoneIdSelected,
			dealer_id: dealerIdSelected,
			store_id: storeIdSelected,
			instructor_id: instructorIdSelected,
			supervisor_id: supervisorIdSelected,
			month: monthSelected,
			year: yearSelected
		}, function(success) {

			// INI Metas Metas v/s Ventas
			angular.forEach(success.data.attributes.monthly_sales_vs_goals, function(value, key) {

			});

			// FIN Metas Metas v/s Ventas

			// INI Comparación semanal W-pasada y W-actual
			angular.forEach(success.data.attributes.last_week_comparison, function(value, key) {

			});
			// FIN Comparación semanal W-pasada y W-actual

			// INI Comparativos de venta Semanal
			angular.forEach(success.data.attributes.weekly_sales_comparison, function(value, key) {

			});
			// FIN Comparativos de venta Semanal

			// INI Comparativos de venta Mensual
			angular.forEach(success.data.attributes.monthly_sales_comparison, function(value, key) {

			});
			// FIN Comparativos de venta Mensual

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


});