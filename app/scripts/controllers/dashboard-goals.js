'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardGoalsCtrl
 * @description
 * # DashboardGoalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardGoalsCtrl', function($scope, $log, $filter, $uibModal, $moment, $state, $location, $window, $timeout, Utils, Dashboard, ExcelDashboard, Zones, Dealers, Stores, Users) {

	var currentDate = new Date();
	var firstMonthDay = new Date();
	firstMonthDay.setDate(1);
	var i = 0,
		j = 0;

	$scope.page = {
		title: 'Metas - Semáforos',
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
				disabled: false,
				loaded: false
			},
			dateRange: {
				options: {
					locale: {
						format: 'DD/MM/YYYY',
						applyLabel: 'Buscar',
						cancelLabel: 'Cerrar',
						fromLabel: 'Desde',
						toLabel: 'Hasta',
						customRangeLabel: 'Personalizado',
						daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
						monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
						firstDay: 1
					},
					autoApply: true,
					maxDate: $moment().add(1, 'months').date(1).subtract(1, 'days'),
				},
				date: {
					startDate: firstMonthDay,
					endDate: currentDate
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

	$scope.$watch('page.filters.supervisor.loaded', function() {
		if ($scope.page.filters.supervisor.loaded) {
			$scope.$watch('page.filters.dateRange.date', function(newValue, oldValue) {
				var startDate = new Date($scope.page.filters.dateRange.date.startDate);
				var endDate = new Date($scope.page.filters.dateRange.date.endDate);

				if (startDate.getMonth() !== endDate.getMonth()) {
					openModalMessage({
						title: 'Error en el rango de fechas ',
						message: 'El rango de fechas debe estar dentro del mismo mes.'
					});

					$scope.page.filters.dateRange.date.startDate = new Date(oldValue.startDate);
					$scope.page.filters.dateRange.date.endDate = new Date(oldValue.endDate);
					return;
				}

				$scope.getDashboardInfo({
					success: true,
					detail: 'OK'
				});
			});
		}
	});

	var openModalMessage = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: true,
			templateUrl: 'messageModal.html',
			controller: 'MessageModalInstance',
			size: 'md',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	var getZones = function() { //hola

		$scope.page.filters.zone.list = [];

		Zones.query({}, function(success) {
			if (success.data) {

				$scope.page.filters.zone.list.push({
					id: '',
					name: 'Todas las Zonas',
					dealersIds: []
				});

				angular.forEach(success.data, function(value, key) {
					$scope.page.filters.zone.list.push({
						id: parseInt(value.id),
						name: value.attributes.name,
						dealersIds: value.attributes.dealer_ids
					});
				});

				$scope.page.filters.zone.selected = $scope.page.filters.zone.list[0];
				$scope.getDealers({
					success: true,
					detail: 'OK'
				}, $scope.page.filters.zone.selected);

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

	$scope.getDealers = function(e, zoneSelected) {

		$scope.page.filters.dealer.selected = [];
		$scope.page.filters.dealer.list = [];

		Dealers.query({
			'filter[zone_ids]': zoneSelected.id
		}, function(success) {
			if (success.data) {

				$scope.page.filters.dealer.list.push({
					id: '',
					name: 'Todos los dealers'
				});

				for (i = 0; i < success.data.length; i++) {
					$scope.page.filters.dealer.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'dealers'
					});
				}

				$scope.page.filters.dealer.selected = $scope.page.filters.dealer.list[0];
				$scope.page.filters.dealer.disabled = false;

				$scope.getStores({
					success: true,
					detail: 'OK'
				}, $scope.page.filters.zone.selected, $scope.page.filters.dealer.selected);

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

	$scope.getStores = function(e, zoneSelected, dealerSelected) {

		$scope.page.filters.store.selected = [];
		$scope.page.filters.store.list = [];

		Stores.query({
			'filter[dealer_ids]': dealerSelected.id,
			'filter[zone_ids]': zoneSelected.id
		}, function(success) {
			if (success.data) {

				$scope.page.filters.store.list.push({
					id: '',
					name: 'Todas las tiendas'
				});

				for (i = 0; i < success.data.length; i++) {
					$scope.page.filters.store.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'dealers'
					});
				}

				$scope.page.filters.store.selected = $scope.page.filters.store.list[0];
				$scope.page.filters.store.disabled = false;

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
				Utils.refreshToken($scope.getStores);
			}
		});
	};

	var getUsers = function(e) {

		$scope.page.filters.instructor.selected = [];
		$scope.page.filters.instructor.list = [];
		$scope.page.filters.supervisor.selected = [];
		$scope.page.filters.supervisor.list = [];

		Users.query({}, function(success) {
			if (success.data) {

				$scope.page.filters.instructor.list.push({
					id: '',
					name: 'Todos los instructores'
				});

				$scope.page.filters.supervisor.list.push({
					id: '',
					name: 'Todos los supervisores'
				});

				angular.forEach(success.data, function(value, key) {
					if (value.attributes.role_id === 1) { // supervisor
						$scope.page.filters.supervisor.list.push({
							id: parseInt(value.id),
							name: value.attributes.first_name + ' ' + value.attributes.last_name
						});
					}
					if (value.attributes.role_id === 3) { // instructor
						$scope.page.filters.instructor.list.push({
							id: parseInt(value.id),
							name: value.attributes.first_name + ' ' + value.attributes.last_name
						});
					}

				});

				$scope.page.filters.supervisor.selected = $scope.page.filters.supervisor.list[0];
				$scope.page.filters.instructor.selected = $scope.page.filters.instructor.list[0];

				$scope.page.filters.supervisor.loaded = true;

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
		var startDate = new Date($scope.page.filters.dateRange.date.startDate);
		var endDate = new Date($scope.page.filters.dateRange.date.endDate);
		var startDay = startDate.getDate();
		var endDay = endDate.getDate();
		var month = startDate.getMonth() + 1;
		var year = startDate.getFullYear();

		Dashboard.query({
			category: 'goals',
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
				name: 'Meta',
				data: monthlySalesVsGoals.data.goals
			}, {
				name: 'Venta',
				data: monthlySalesVsGoals.data.sales
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
			if (error.status === 401) {
				Utils.refreshToken($scope.getDashboardInfo);
			}
		});
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

		var monthSelected = new Date($scope.page.filters.dateRange.date.startDate).getMonth();
		var yearSelected = new Date($scope.page.filters.dateRange.date.startDate).getFullYear();

		ExcelDashboard.getFile('#excelBtn', 'goals', 'metas', monthSelected + 1, yearSelected);

		$timeout(function() {
			$scope.page.buttons.getExcel.disabled = false;
			$scope.page.loader.show = false;
		}, 3000);
	};

	getZones();

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
<<<<<<< HEAD
		
=======

>>>>>>> master
		if ($scope.modal.goals.file.value.type !== 'text/csv' &&
			$scope.modal.goals.file.value.type !== 'text/comma-separated-values' &&
			$scope.modal.goals.file.value.type !== 'application/csv' &&
			$scope.modal.goals.file.value.type !== 'application/excel' &&
			$scope.modal.goals.file.value.type !== 'application/vnd.ms-excel' &&
			$scope.modal.goals.file.value.type !== 'application/vnd.msexcel' &&
			$scope.modal.goals.file.value.type !== 'text/anytext') {

			$scope.modal.alert.color = 'blue-ps-1';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'El archivo seleccionado no es válido.';
			return;
		}

		$scope.modal.overlay.show = true;

		var fd = new FormData();
		fd.append('csv', $scope.modal.goals.file.value);

		WeeklyBusinessSales.upload({}, fd).$promise.then(function(success) {
			$uibModalInstance.close();
			openModalSummaryLoadGoals(success);
		}).catch(function(error) {
			$uibModalInstance.close();
			openModalMessage({
				title: error.data.errors[0].title,
				message: error.data.errors[0].detail
			});
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

	var openModalMessage = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: true,
			templateUrl: 'messageModal.html',
			controller: 'MessageModalInstance',
			size: 'md',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
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

})

.controller('MessageModalInstance', function($scope, $log, $uibModalInstance, data) {

	$scope.modal = {
		title: data.title,
		text: data.message
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});