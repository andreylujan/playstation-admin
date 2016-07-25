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
	$scope.asd = true;
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
		},
		promotors: {
			storeVisits: {
				countTotalReports: 0,
				countReportsToday: 0,
				countReportsYesterday: 0
			},
			mothlyReportsPerDay: {
				latest15: [],
				all: [],
				seeAll: {
					disabled: true
				}
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

	$scope.chartConfigStoreVisits = Utils.setChartConfig('', 409, {}, {}, {}, []);

	$scope.accomplishmentToday = {
		percent: 67,
		options: {
			animate: {
				duration: 3000,
				enabled: true
			},
			barColor: '#fcc111',
			scaleColor: false,
			lineCap: 'round',
			size: 140,
			lineWidth: 4
		}
	};

	$scope.accomplishmentYesterday = {
		percent: 67,
		options: {
			animate: {
				duration: 3000,
				enabled: true
			},
			barColor: '#3f5b71',
			scaleColor: false,
			lineCap: 'round',
			size: 140,
			lineWidth: 4
		}
	};

	$scope.pricesAnnouncementsDay = Utils.setChartConfig('column', 455, {}, [{
		min: 0,
		title: {
			text: null
		},
		stackLabels: {}
	}, { // Secondary yAxis
		title: {
			text: '',
			style: {}
		},
		labels: {
			style: {}
		}
	}], {
		categories: [],
		title: {
			text: ''
		}
	}, [{
		name: 'Reportes creados',
		data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	}, {
		name: 'Reportes que cumplen',
		type: 'spline',
		data: [6.0, 6.9, 1.5, 5.5, 7.2, 21.5, 25.2, 26.5, 22.3, 18.3, 11.9, 1.6]
	}]);

	$scope.openModalMonthlyReportsPerDay = function(arrMonthlyReportsPerDay) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'viewAllMonthlyReportsPerDay.html',
			controller: 'ViewAllReportsPerDayModalInstance',
			size: 'md',
			resolve: {
				monthlyReports: function() {
					return arrMonthlyReportsPerDay;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});

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

		// $log.log(zoneIdSelected);
		// $log.log(dealerIdSelected);
		// $log.log(storeIdSelected);
		// $log.log(instructorIdSelected);
		// $log.log(supervisorIdSelected);
		// $log.log(monthSelected);
		// $log.log(yearSelected);

		Dashboard.query({
			category: 'promoter_activity',
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

				$scope.page.promotors.storeVisits.countTotalReports = success.data.attributes.accumulated[(success.data.attributes.accumulated.length) - 1][1];
				// $scope.page.promotors.storeVisits.countReportsToday = success.data.attributes.accumulated[(success.data.attributes.accumulated.length) - 2][1];
				// $scope.page.promotors.storeVisits.countReportsYesterday = success.data.attributes.accumulated[(success.data.attributes.accumulated.length) - 2][1];

				if (success.data.attributes.reports_by_day[0] === -1) {
					$scope.page.promotors.storeVisits.countReportsToday = 0;
					$scope.page.promotors.storeVisits.countReportsYesterday = 0;
				} else if (success.data.attributes.reports_by_day[1] === -1) {
					$scope.page.promotors.storeVisits.countReportsYesterday = 0;
				} else {
					var keepGoing = true;
					angular.forEach(success.data.attributes.reports_by_day, function(value, key) {
						if (keepGoing) {
							if (value.amount === -1) {
								$scope.page.promotors.storeVisits.countReportsToday = success.data.attributes.reports_by_day[key - 1].amount;
								$scope.page.promotors.storeVisits.countReportsYesterday = success.data.attributes.reports_by_day[key - 2].amount;
								keepGoing = false;
							}
						}
					});
				}

				var categories = [],
					values = [],
					c = 0;

				angular.forEach(success.data.attributes.accumulated, function(value, key) {
					categories.push(value[0]);
					values.push(value[1]);
				});

				for (i = success.data.attributes.reports_by_day.length - 1; i >= 0; i--) {
					if (success.data.attributes.reports_by_day[i].amount !== -1) {
						$scope.page.promotors.mothlyReportsPerDay.all.push({
							weekDay: success.data.attributes.reports_by_day[i].week_day,
							monthDay: success.data.attributes.reports_by_day[i].month_day,
							amount: success.data.attributes.reports_by_day[i].amount
						});
						if (c < 15) {
							$scope.page.promotors.mothlyReportsPerDay.latest15.push({
								weekDay: success.data.attributes.reports_by_day[i].week_day,
								monthDay: success.data.attributes.reports_by_day[i].month_day,
								amount: success.data.attributes.reports_by_day[i].amount
							});
							c++;
						}
					}
				}
				$scope.page.promotors.mothlyReportsPerDay.seeAll.disabled = false;
				$scope.page.promotors.mothlyReportsPerDay.latest15 = $scope.page.promotors.mothlyReportsPerDay.latest15.reverse();
				$scope.page.promotors.mothlyReportsPerDay.all = $scope.page.promotors.mothlyReportsPerDay.all.reverse();
				
				$scope.chartConfigStoreVisits = Utils.setChartConfig('', 409, {}, {
					min: 0,
					title: {
						text: null
					},
					stackLabels: {}
				}, {
					categories: categories,
					title: {
						text: ''
					}
				}, [{
					name: 'Reportes',
					data: values
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

.controller('ViewAllSalesValuesModalInstance', function($scope, $log, $uibModalInstance) {

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

})

.controller('ViewAllReportsPerDayModalInstance', function($scope, $log, $uibModalInstance, monthlyReports) {

	$scope.modal = {
		alert: {
			color: '',
			show: '',
			title: '',
			text: ''
		},
		mothlyReportsPerDay: monthlyReports
	};
	$log.log(monthlyReports);

});