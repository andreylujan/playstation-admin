'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardStockCtrl
 * @description
 * # DashboardStockCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardStockCtrl', function($scope, $log, $uibModal, $moment, $filter, $timeout, Utils, NgTableParams, Dashboard, DataPlayStation, ExcelDashboard) {

	var currentDate = new Date();
	var firstMonthDay = new Date();
	firstMonthDay.setDate(1);

	$scope.page = {
		title: 'Stock',
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
			},
			dateRange: {
				options: {
					locale: {
						applyLabel: 'Buscar',
						cancelLabel: 'Cerrar',
						fromLabel: 'Desde',
						toLabel: 'Hasta',
						customRangeLabel: 'Personalizado',
						daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
						monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
						firstDay: 1
					},
					// minDate: firstMonthDay,
					maxDate: $moment().add(1, 'months').date(1).subtract(1, 'days'),
				},
				startDate: firstMonthDay,
				endDate: currentDate
			}
		},
		stock: {
			stockBreaks: {
				loaded: false,
				list: []
			},
			topProducts: {
				loaded: false,
				list: []
			}
		},
		buttons: {
			getExcel: {
				disabled: false
			}
		},
		loader: {
			show: false
		}
	};

	var getZones = function() {
		DataPlayStation.getZones({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.zone.list = data.data;
			$scope.page.filters.zone.selected = data.data[0];
			$scope.getDealers({
				success: true,
				detail: 'OK'
			}, $scope.page.filters.zone.selected);
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
			$scope.getStores({
				success: true,
				detail: 'OK'
			}, $scope.page.filters.zone.selected, $scope.page.filters.dealer.selected);
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
		var startDate = new Date($scope.page.filters.dateRange.startDate);
		var endDate = new Date($scope.page.filters.dateRange.endDate);
		var startDay = startDate.getDate();
		var endDay = endDate.getDate();
		var month = startDate.getMonth() + 1;
		var year = startDate.getFullYear();

		var stockBreaks = [],
			topProducts = [];

		Dashboard.query({
			category: 'stock',
			zone_id: zoneIdSelected,
			dealer_id: dealerIdSelected,
			store_id: storeIdSelected,
			instructor_id: instructorIdSelected,
			supervisor_id: supervisorIdSelected,
			month: month,
			year: year,
			start_day: startDay,
			end_day: endDay
		}, function(success) {

			// INI STOCK BREAKS
			angular.forEach(success.data.attributes.stock_breaks, function(value, key) {

				stockBreaks.push({
					storeName: value.store_name,
					dealerName: value.dealer_name,
					productName: value.product_name,
					units: value.units,
					identifier: value.identifier
				});
			});
			$scope.page.stock.stockBreaks.tableParams = new NgTableParams({
				sorting: {
					units: "desc"
				}
			}, {
				dataset: stockBreaks
			});
			// FIN STOCK BREAKS

			// INI TOP PRODUCTS
			angular.forEach(success.data.attributes.top_products, function(value, key) {

				topProducts.push({
					dealerName: value.dealer_name,
					storeName: value.store_name,
					ean: value.ean,
					description: value.description,
					category: value.category,
					platform: value.platform,
					publisher: value.publisher,
					units: value.units,
					salesAmount: value.sales_amount
				});
			});

			$scope.page.stock.topProducts.tableParams = new NgTableParams({
				sorting: {
					units: "desc"
				}
			}, {
				dataset: topProducts
			});
			// FIN TOP PRODUCTS

		}, function(error) {
			$log.error(error);
		});
	};

	angular.element('#daterangeDashStock').on('apply.daterangepicker', function(ev, picker) {
		$scope.getDashboardInfo({
			success: true,
			detail: 'OK'
		});
	});

	$scope.getExcel = function(e) {

		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if ($scope.page.buttons.getExcel.disabled) {
			return;
		}
		$scope.page.buttons.getExcel.disabled = true;
		$scope.page.loader.show = true;

		var zoneIdSelected = $scope.page.filters.zone.selected ? $scope.page.filters.zone.selected.id : '';
		var dealerIdSelected = $scope.page.filters.dealer.selected ? $scope.page.filters.dealer.selected.id : '';
		var storeIdSelected = $scope.page.filters.store.selected ? $scope.page.filters.store.selected.id : '';
		var instructorIdSelected = $scope.page.filters.instructor.selected ? $scope.page.filters.instructor.selected.id : '';
		var supervisorIdSelected = $scope.page.filters.supervisor.selected ? $scope.page.filters.supervisor.selected.id : '';
		var monthSelected = $scope.page.filters.month.value.getMonth() + 1;
		var yearSelected = $scope.page.filters.month.value.getFullYear();

		ExcelDashboard.getFile('#excelBtn', 'stock', 'stock', monthSelected, yearSelected, instructorIdSelected, supervisorIdSelected, zoneIdSelected, dealerIdSelected, storeIdSelected);

		$timeout(function() {
			$scope.page.buttons.getExcel.disabled = false;
			$scope.page.loader.show = false;
		}, 2500);
	};

	getZones();

	getUsers();

	$scope.getDashboardInfo({
		success: true,
		detail: 'OK'
	});


});