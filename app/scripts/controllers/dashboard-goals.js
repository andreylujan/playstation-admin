'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardGoalsCtrl
 * @description
 * # DashboardGoalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardGoalsCtrl', function($scope, $log, $filter, $uibModal, $state, $location, $window, $http, Utils, Dashboard, DataPlayStation) {

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
				table: {
					headers: [],
					row1: [],
					row2: [],
					row3: []
				},
				chartConfig: Utils.setChartConfig('column', 400, {}, {}, {}, [])
			},
			lastWeekComparison: {
				loaded: false,
				table: {
					lastWeekOfYearName: 0,
					currentWeekOfYearName: 0,
					headers: [],
					row1: [],
					row2: [],
					row3: []
				},
				chartConfig: Utils.setChartConfig('column', 400, {}, {}, {}, []),
				lastWeekOfYear: null,
				currentWeekOfYear: null
			},
			weeklySalesComparison: {
				loaded: false,
				table: {
					lastYearName: 0,
					currentYearName: 0,
					headers: [],
					row1: [],
					row2: [],
					row3: []
				},
				chartConfig: Utils.setChartConfig('column', 400, {}, {}, {}, []),
				lastYear: null,
				currentYear: null

			},
			monthlySalesComparison: {
				loaded: false,
				table: {
					lastYearName: 0,
					currentYearName: 0,
					headers: [],
					row1: [],
					row2: [],
					row3: []
				},
				chartConfig: Utils.setChartConfig('column', 400, {}, {}, {}, []),
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

			var monthlySalesVsGoals = {
				categories: [],
				data: {
					sales: [],
					goals: []
				}
			};
			var lastWeekComparison = {
				categories: [],
				data: {
					lastWeek: [],
					currentWeek: [],
					lastWeekOfYearName: '',
					currentWeekOfYearName: ''
				}
			};
			var weeklySalesComparison = {
				categories: [],
				data: {
					lastYear: [],
					currentYear: [],
					lastYearName: '',
					currentYearName: ''
				}
			};
			var monthlySalesComparison = {
				categories: [],
				data: {
					lastYear: [],
					currentYear: [],
					lastYearName: '',
					currentYearName: ''
				}
			};

			// INI Metas Metas v/s Ventas
			$scope.page.goals.monthlySalesVsGoals.table.headers = [];
			$scope.page.goals.monthlySalesVsGoals.table.row1 = [];
			$scope.page.goals.monthlySalesVsGoals.table.row2 = [];
			$scope.page.goals.monthlySalesVsGoals.table.row3 = [];

			angular.forEach(success.data.attributes.monthly_sales_vs_goals, function(value, key) {

				monthlySalesVsGoals.categories.push($filter('capitalize')(value.name, true));
				monthlySalesVsGoals.data.sales.push(value.sales);
				monthlySalesVsGoals.data.goals.push(value.goal);

				$scope.page.goals.monthlySalesVsGoals.table.headers.push($filter('capitalize')(value.name, true));
				$scope.page.goals.monthlySalesVsGoals.table.row1.push(value.goal);
				$scope.page.goals.monthlySalesVsGoals.table.row2.push(value.sales);
				$scope.page.goals.monthlySalesVsGoals.table.row3.push(value.goal_percentage);

			});

			$scope.page.goals.monthlySalesVsGoals.chartConfig = Utils.setChartConfig('column', 400, {}, {
				min: 0,
				title: {
					text: null
				}
			}, {
				categories: monthlySalesVsGoals.categories,
				title: {
					text: 'Dealers'
				}
			}, [{
				name: 'Venta',
				data: monthlySalesVsGoals.data.sales
			}, {
				name: 'Meta',
				data: monthlySalesVsGoals.data.goals
			}]);
			// FIN Metas Metas v/s Ventas

			// INI Comparación semanal W-pasada y W-actual
			$scope.page.goals.lastWeekComparison.table.headers = [];
			$scope.page.goals.lastWeekComparison.table.row1 = [];
			$scope.page.goals.lastWeekComparison.table.row2 = [];
			$scope.page.goals.lastWeekComparison.table.row3 = [];

			angular.forEach(success.data.attributes.last_week_comparison, function(value, key) {

				lastWeekComparison.categories.push($filter('capitalize')(value.name, true));
				lastWeekComparison.data.lastWeek.push(value.last_week_sales);
				lastWeekComparison.data.currentWeek.push(value.current_week_sales);

				$scope.page.goals.lastWeekComparison.table.headers.push($filter('capitalize')(value.name, true));
				$scope.page.goals.lastWeekComparison.table.row1.push(value.last_week_sales);
				$scope.page.goals.lastWeekComparison.table.row2.push(value.current_week_sales);
				$scope.page.goals.lastWeekComparison.table.row3.push(value.growth_percentage);

			});

			lastWeekComparison.data.lastWeekOfYearName = 'W' + success.data.attributes.last_week_of_year;
			lastWeekComparison.data.currentWeekOfYearName = 'W' + success.data.attributes.current_week_of_year;

			$scope.page.goals.lastWeekComparison.table.lastWeekOfYearName = '$ W' + success.data.attributes.last_week_of_year;
			$scope.page.goals.lastWeekComparison.table.currentWeekOfYearName = '$ W' + success.data.attributes.current_week_of_year;

			$scope.page.goals.lastWeekComparison.chartConfig = Utils.setChartConfig('column', 400, {}, {
				min: 0,
				title: {
					text: null
				}
			}, {
				categories: lastWeekComparison.categories,
				title: {
					text: 'Dealers'
				}
			}, [{
				name: lastWeekComparison.data.lastWeekOfYearName,
				data: lastWeekComparison.data.lastWeek
			}, {
				name: lastWeekComparison.data.currentWeekOfYearName,
				data: lastWeekComparison.data.currentWeek
			}]);
			// FIN Comparación semanal W-pasada y W-actual

			// INI Comparativos de venta Semanal
			$scope.page.goals.weeklySalesComparison.table.headers = [];
			$scope.page.goals.weeklySalesComparison.table.row1 = [];
			$scope.page.goals.weeklySalesComparison.table.row2 = [];
			$scope.page.goals.weeklySalesComparison.table.row3 = [];

			angular.forEach(success.data.attributes.weekly_sales_comparison, function(value, key) {

				weeklySalesComparison.categories.push($filter('capitalize')(value.week, true));
				weeklySalesComparison.data.lastYear.push(value.last_year_sales);
				weeklySalesComparison.data.currentYear.push(value.current_year_sales);

				$scope.page.goals.weeklySalesComparison.table.headers.push($filter('capitalize')(value.week, true));
				$scope.page.goals.weeklySalesComparison.table.row1.push(value.last_year_sales);
				$scope.page.goals.weeklySalesComparison.table.row2.push(value.current_year_sales);
				$scope.page.goals.weeklySalesComparison.table.row3.push(value.growth_percentage);

			});

			weeklySalesComparison.data.lastYearName = success.data.attributes.last_year;
			weeklySalesComparison.data.currentYearName = success.data.attributes.current_year;

			$scope.page.goals.weeklySalesComparison.table.lastYearName = '$ ' + success.data.attributes.last_year;
			$scope.page.goals.weeklySalesComparison.table.currentYearName = '$ ' + success.data.attributes.current_year;

			$scope.page.goals.weeklySalesComparison.chartConfig = Utils.setChartConfig('column', 400, {}, {
				min: 0,
				title: {
					text: null
				}
			}, {
				categories: weeklySalesComparison.categories,
				title: {
					text: 'Semanas'
				}
			}, [{
				name: weeklySalesComparison.data.lastYearName,
				data: weeklySalesComparison.data.lastYear
			}, {
				name: weeklySalesComparison.data.currentYearName,
				data: weeklySalesComparison.data.currentYear
			}]);
			// FIN Comparativos de venta Semanal

			// INI Comparativos de venta Mensual
			$scope.page.goals.monthlySalesComparison.table.headers = [];
			$scope.page.goals.monthlySalesComparison.table.row1 = [];
			$scope.page.goals.monthlySalesComparison.table.row2 = [];
			$scope.page.goals.monthlySalesComparison.table.row3 = [];

			angular.forEach(success.data.attributes.monthly_sales_comparison, function(value, key) {

				monthlySalesComparison.categories.push($filter('capitalize')(value.month, true));
				monthlySalesComparison.data.lastYear.push(value.last_year_sales);
				monthlySalesComparison.data.currentYear.push(value.current_year_sales);

				$scope.page.goals.monthlySalesComparison.table.headers.push($filter('capitalize')(value.month, true));
				$scope.page.goals.monthlySalesComparison.table.row1.push(value.last_year_sales);
				$scope.page.goals.monthlySalesComparison.table.row2.push(value.current_year_sales);
				$scope.page.goals.monthlySalesComparison.table.row3.push(value.growth_percentage);

			});

			monthlySalesComparison.data.lastYearName = success.data.attributes.last_year;
			monthlySalesComparison.data.currentYearName = success.data.attributes.current_year;

			$scope.page.goals.monthlySalesComparison.table.lastYearName = '$ ' + success.data.attributes.last_year;
			$scope.page.goals.monthlySalesComparison.table.currentYearName = '$ ' + success.data.attributes.current_year;

			$scope.page.goals.monthlySalesComparison.chartConfig = Utils.setChartConfig('column', 400, {}, {
				min: 0,
				title: {
					text: null
				}
			}, {
				categories: monthlySalesComparison.categories,
				title: {
					text: 'Meses'
				}
			}, [{
				name: monthlySalesComparison.data.lastYearName,
				data: monthlySalesComparison.data.lastYear
			}, {
				name: monthlySalesComparison.data.currentYearName,
				data: monthlySalesComparison.data.currentYear
			}]);
			// FIN Comparativos de venta Mensual

		}, function(error) {
			$log.error(error);
		});
	};

	$scope.getExcel = function(e) {
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

		// $location.path('http://50.16.161.152/eretail/api/v1/dashboard/goals.xlsx?month=8&year=2016&instructor_id=&supervisor_id=&zone_id=&dealer_id=&store_id=');

		// $http.get('http://50.16.161.152/eretail/api/v1/dashboard/goals.xlsx?month=8&year=2016&instructor_id=&supervisor_id=&zone_id=&dealer_id=&store_id=', {
		// 	headers: {
		// 		'Authorization': 'Bearer 004611920b862902999895a539c4bd79b898e52df6f59497bed26cbe6b6f6ab9'
		// 	}
		// }).then(function(data) {
		// 	//data is link to pdf
		// 	$log.log(data.data);
		// 	$window.open(data.data);
		// });

		$http({
			method: 'GET',
			url: 'http://50.16.161.152/eretail/api/v1/dashboard/goals.xlsx?month=8&year=2016&instructor_id=&supervisor_id=&zone_id=&dealer_id=&store_id=',
			headers: {
				'Authorization': 'Bearer 004611920b862902999895a539c4bd79b898e52df6f59497bed26cbe6b6f6ab9'
			}
		});


		// $window.open('http://50.16.161.152/eretail/api/v1/dashboard/goals.xlsx?month=8&year=2016&instructor_id=&supervisor_id=&zone_id=&dealer_id=&store_id=');

		// Dashboard.query({
		// 	category: 'goals.xlsx',
		// 	zone_id: zoneIdSelected,
		// 	dealer_id: dealerIdSelected,
		// 	store_id: storeIdSelected,
		// 	instructor_id: instructorIdSelected,
		// 	supervisor_id: supervisorIdSelected,
		// 	month: monthSelected,
		// 	year: yearSelected
		// }, function(success) {
		// 	$log.log(success);
		// 	// $location.path('http://50.16.161.152/eretail/api/v1/dashboard/goals.xlsx?month=8&year=2016&instructor_id=&supervisor_id=&zone_id=&dealer_id=&store_id=');

		// 	$window.open(url);
		// }, function(error) {
		// 	$log.error(error);
		// });
	};

	$scope.openModalUploadGoals = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'uploadGoalsModal.html',
			controller: 'UploadGoalsModalInstance',
			size: 'md',
			// resolve: {
			// 	data: function() {
			// 		return data;
			// 	}
			// }
		});

		modalInstance.result.then(function() {}, function() {});

	};

	getZones();

	getUsers();

	$scope.getDashboardInfo({
		success: true,
		detail: 'OK'
	});


})

.controller('UploadGoalsModalInstance', function($scope, $log, $uibModalInstance, $uibModal, WeeklyBusinessSales, Utils) {

	$scope.modal = {
		alert: {
			color: '',
			show: '',
			title: ''
		},
		goals: {
			file: {
				value: null
			}
		},
		overlay: {
			show: false
		}
	};

	var removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.show = true;
	};

	$scope.uploadGoals = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		removeAlert();

		if (!$scope.modal.goals.file.value) {
			return;
		}

		if ($scope.modal.goals.file.value.type !== 'text/csv') {
			$scope.modal.alert.color = 'blue-ps-1';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'El archivo seleccionado no es válido.';
			return;
		}

		$scope.modal.overlay.show = true;

		var form = [{
			field: 'csv',
			value: $scope.modal.goals.file.value
		}];

		WeeklyBusinessSales.upload(form)
			.success(function(success) {
				$scope.modal.overlay.show = false;
				// $log.log(success);
				$uibModalInstance.close();
				openModalSummaryLoadGoals(success);
			}, function(error) {
				$log.error(error);
				$scope.modal.overlay.show = false;
				if (error.status === 401) {
					Utils.refreshToken($scope.uploadGoals);
				}
			});
	};

	var openModalSummaryLoadGoals = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summary.html',
			controller: 'SummaryLoadGoalsModalInstance',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {
			// $scope.getUsers();
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

})

.controller('SummaryLoadGoalsModalInstance', function($scope, $log, $uibModalInstance, data) {

	$scope.modal = {
		countErrors: 0,
		countSuccesses: 0,
		countCreated: 0,
		countChanged: 0,
		errors: [],
		successes: []
	};
	var i = 0;

	for (i = 0; i < data.data.length; i++) {

		if (!data.data[i].meta.success) {
			$scope.modal.countErrors++;
		} else if (data.data[i].meta.created) {
			$scope.modal.countCreated++;
		} else if (data.data[i].meta.changed) {
			$scope.modal.countChanged++;
		}

		if (data.data[i].meta.errors) {
			$scope.modal.errors.push({
				rowNumber: data.data[i].meta.row_number,
				field: Object.keys(data.data[i].meta.errors)[0],
				details: data.data[i].meta.errors[Object.keys(data.data[i].meta.errors)[0]]
			});
		}

	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});