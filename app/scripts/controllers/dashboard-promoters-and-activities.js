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
				isOpen: false,
				options: {
					minMode: 'month',
					maxDate: new Date()
				}
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
			},
			registry: {
				entranceAndExit: {
					countTotalExits: 0,
					countExitsToday: 0,
					countExitsYesterday: 0
				},
				mothlyExitsPerDay: {
					latest15: [],
					all: [],
					seeAll: {
						disabled: true
					}
				},
				hours: {
					countTotalHours: 0,
					countHoursToday: 0,
					countHoursYesterday: 0
				},
				mothlyHoursPerDay: {
					latest15: [],
					all: [],
					seeAll: {
						disabled: true
					}
				},
			},
			headCounts: {
				byDealer: [],
				byStore: []
			},
			pricesCommunicated: {
				percenToday: {
					value: 0,
					show: true,
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
				},
				percentYesterday: {
					value: 0,
					show: true,
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
				},
				byStore: {
					show: true,
					list: []
				},
				byDay: {
					show: true,
					all: [],
					latest15: []
				}
			},
			promotionsCommunicated: {
				percenToday: {
					value: 0,
					show: true,
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
				},
				percentYesterday: {
					value: 0,
					show: true,
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
				},
				byStore: {
					show: true,
					list: []
				},
				byDay: {
					show: true,
					all: [],
					latest15: []
				}
			}
			// bestPractices: {
			// 	loaded: false,
			// 	list: []
			// }
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

	$scope.chartConfigStoreVisits = Utils.setChartConfig('', 409, {}, {}, {}, []);

	$scope.openModalMonthlyReportsPerDay = function(data) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'viewAllDataTable.html',
			controller: 'ViewAllDataTableModalInstance',
			size: 'md',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});

	};

	$scope.openModalAllDataTableCommunicatedPricesByDay = function(data) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'allDataTableCommunicatedPricesByDay.html',
			controller: 'allDataTableCommunicatedPricesByDayModalInstance',
			size: 'md',
			resolve: {
				data: function() {
					return data;
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

		// $scope.page.promotors.bestPractices.loaded = false;

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

				if (success.data.attributes.accumulated_reports[(success.data.attributes.accumulated_reports.length) - 1][1] !== -1) {
					$scope.page.promotors.storeVisits.countTotalReports = success.data.attributes.accumulated_reports[(success.data.attributes.accumulated_reports.length) - 1][1];
				}
				$scope.page.promotors.storeVisits.countReportsToday = success.data.attributes.num_reports_today;
				$scope.page.promotors.storeVisits.countReportsYesterday = success.data.attributes.num_reports_yesterday;

				var categories = [],
					values = [],
					c = 0;

				angular.forEach(success.data.attributes.accumulated_reports, function(value, key) {
					categories.push(value[0]);
					values.push(value[1]);
				});

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

				$scope.page.promotors.mothlyReportsPerDay.all = [];
				$scope.page.promotors.mothlyReportsPerDay.latest15 = [];

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

				// INI Registro promotores - entrada y salida

				var categoriesAccumulatedCheckins = [],
					valuesAccumulatedCheckins = [],
					totalExits = 0;
				c = 0;

				angular.forEach(success.data.attributes.accumulated_checkins, function(value, key) {
					// solo se suman al contador si los valores son distintos q -1 (-1 representa q no hay data)
					if (value[1] !== -1) {
						totalExits += value[1];
					}
					categoriesAccumulatedCheckins.push(value[0]);
					valuesAccumulatedCheckins.push(value[1]);
				});

				$scope.page.promotors.registry.entranceAndExit.countTotalExits = totalExits;
				$scope.page.promotors.registry.entranceAndExit.countExitsToday = success.data.attributes.num_checkins_today;
				$scope.page.promotors.registry.entranceAndExit.countExitsYesterday = success.data.attributes.num_checkins_yesterday;

				$scope.chartConfigAccumulatedCheckins = Utils.setChartConfig('', 409, {}, {
					min: 0,
					title: {
						text: null
					},
					stackLabels: {}
				}, {
					categories: categoriesAccumulatedCheckins,
					title: {
						text: ''
					}
				}, [{
					name: 'Salidas',
					data: valuesAccumulatedCheckins
				}]);

				$scope.page.promotors.registry.mothlyExitsPerDay.latest15 = [];
				$scope.page.promotors.registry.mothlyExitsPerDay.all = [];

				c = 0;
				for (i = success.data.attributes.checkins_by_day.length - 1; i >= 0; i--) {
					if (success.data.attributes.checkins_by_day[i].amount !== -1) {
						$scope.page.promotors.registry.mothlyExitsPerDay.all.push({
							weekDay: success.data.attributes.checkins_by_day[i].week_day,
							monthDay: success.data.attributes.checkins_by_day[i].month_day,
							amount: success.data.attributes.checkins_by_day[i].amount
						});
						if (c < 15) {
							$scope.page.promotors.registry.mothlyExitsPerDay.latest15.push({
								weekDay: success.data.attributes.checkins_by_day[i].week_day,
								monthDay: success.data.attributes.checkins_by_day[i].month_day,
								amount: success.data.attributes.checkins_by_day[i].amount
							});
							c++;
						}
					}
				}
				$scope.page.promotors.registry.mothlyExitsPerDay.seeAll.disabled = false;
				$scope.page.promotors.registry.mothlyExitsPerDay.latest15 = $scope.page.promotors.registry.mothlyExitsPerDay.latest15.reverse();
				$scope.page.promotors.registry.mothlyExitsPerDay.all = $scope.page.promotors.registry.mothlyExitsPerDay.all.reverse();

				// FIN Registro promotores - entrada y salida

				//  INI Registro de promotores - Horas trabajadas

				var categoriesHours = [],
					valuesHours = [],
					totalHours = 0;
				c = 0;

				angular.forEach(success.data.attributes.accumulated_hours, function(value, key) {
					totalHours += value[1];
					categoriesHours.push(value[0]);
					valuesHours.push(value[1]);
				});


				$scope.page.promotors.registry.hours.countTotalHours = totalHours;
				$scope.page.promotors.registry.hours.countHoursToday = success.data.attributes.num_hours_today;
				$scope.page.promotors.registry.hours.countHoursYesterday = success.data.attributes.num_hours_yesterday;

				$scope.chartConfigHours = Utils.setChartConfig('', 409, {}, {
					min: 0,
					title: {
						text: null
					},
					stackLabels: {}
				}, {
					categories: categoriesHours,
					title: {
						text: ''
					}
				}, [{
					name: 'Horas',
					data: valuesHours
				}]);

				$scope.page.promotors.registry.mothlyHoursPerDay.latest15 = [];
				$scope.page.promotors.registry.mothlyHoursPerDay.all = [];

				c = 0;
				for (i = success.data.attributes.hours_by_day.length - 1; i >= 0; i--) {
					if (success.data.attributes.hours_by_day[i].amount !== -1) {
						$scope.page.promotors.registry.mothlyHoursPerDay.all.push({
							weekDay: success.data.attributes.hours_by_day[i].week_day,
							monthDay: success.data.attributes.hours_by_day[i].month_day,
							amount: success.data.attributes.hours_by_day[i].amount
						});
						if (c < 15) {
							$scope.page.promotors.registry.mothlyHoursPerDay.latest15.push({
								weekDay: success.data.attributes.hours_by_day[i].week_day,
								monthDay: success.data.attributes.hours_by_day[i].month_day,
								amount: success.data.attributes.hours_by_day[i].amount
							});
							c++;
						}
					}
				}
				$scope.page.promotors.registry.mothlyHoursPerDay.seeAll.disabled = false;
				$scope.page.promotors.registry.mothlyHoursPerDay.latest15 = $scope.page.promotors.registry.mothlyHoursPerDay.latest15.reverse();
				$scope.page.promotors.registry.mothlyHoursPerDay.all = $scope.page.promotors.registry.mothlyHoursPerDay.all.reverse();

				//  FIN Registro de promotores - Horas trabajadas

				// INI HC a la fecha Dealer
				$scope.page.promotors.headCounts.byDealer = [];
				angular.forEach(success.data.attributes.head_counts, function(dealer, keyDealer) {

					$scope.page.promotors.headCounts.byDealer.push({
						name: dealer.name,
						playstation: {
							full: 0,
							part: 0
						},
						nintendo: {
							full: 0,
							part: 0
						},
						xbox: {
							full: 0,
							part: 0
						}
					});

					angular.forEach(dealer.brands, function(brand, keyBrand) {
						if (brand.name === 'PlayStation') {
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].playstation.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].playstation.part = brand.num_part_time;
						}
						if (brand.name === 'Nintendo') {
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].nintendo.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].nintendo.part = brand.num_part_time;
						}
						if (brand.name === 'Xbox') {
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].xbox.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byDealer[$scope.page.promotors.headCounts.byDealer.length - 1].xbox.part = brand.num_part_time;
						}
					});
				});
				// FIN HC a la fecha Dealer

				// INI HC a la fecha - Tienda
				$scope.page.promotors.headCounts.byStore = [];
				angular.forEach(success.data.attributes.head_counts_by_store, function(dealer, keyDealer) {

					$scope.page.promotors.headCounts.byStore.push({
						name: dealer.name,
						playstation: {
							full: 0,
							part: 0
						},
						nintendo: {
							full: 0,
							part: 0
						},
						xbox: {
							full: 0,
							part: 0
						}
					});

					$log.log('$scope.page.promotors.headCounts.byStore');
					$log.log($scope.page.promotors.headCounts.byStore);

					angular.forEach(dealer.brands, function(brand, keyBrand) {
						if (brand.name === 'PlayStation') {
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].playstation.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].playstation.part = brand.num_part_time;
						}
						if (brand.name === 'Nintendo') {
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].nintendo.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].nintendo.part = brand.num_part_time;
						}
						if (brand.name === 'Xbox') {
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].xbox.full = brand.num_full_time;
							$scope.page.promotors.headCounts.byStore[$scope.page.promotors.headCounts.byStore.length - 1].xbox.part = brand.num_part_time;
						}
					});
				});

				// INI Precios comunicados porcentajes

				// el servicio trae -1 si no hay reportes hoy, si pasa eso, no se muestra el grafico
				if (success.data.attributes.percent_prices_communicated_today === -1) {
					$scope.page.promotors.pricesCommunicated.percenToday.show = false;
				} else {
					$scope.page.promotors.pricesCommunicated.percenToday.show = true;
				}
				// el servicio trae -1 si no hay reportes ayer, si pasa eso, no se muestra el grafico
				if (success.data.attributes.percent_prices_communicated_yesterday === -1) {
					$scope.page.promotors.pricesCommunicated.percentYesterday.show = false;
				} else {
					$scope.page.promotors.pricesCommunicated.percentYesterday.show = true;
				}
				$scope.page.promotors.pricesCommunicated.percenToday.value = success.data.attributes.percent_prices_communicated_today * 100;
				$scope.page.promotors.pricesCommunicated.percentYesterday.value = success.data.attributes.percent_prices_communicated_yesterday * 100;
				// FIN Precios comunicados porcentajes

				// INI Precios comunicados Tiendas que no cumplen
				angular.forEach(success.data.attributes.communicated_prices_by_store, function(value, key) {
					$scope.page.promotors.pricesCommunicated.byStore.list.push({
						zoneName: value.zone_name,
						dealerName: value.dealer_name,
						storeName: value.store_name
					});
				});

				// FIN Precios comunicados Tiendas que no cumplen

				// INI Precios comunicados Al día
				var accuulatedPricesCategories = [],
					accumulatedPricesCreatedReports = [],
					accumulatedPricesReportsThatMeet = [];

				angular.forEach(success.data.attributes.accumulated_prices, function(value, key) {
					accuulatedPricesCategories.push(value[0]);
					accumulatedPricesReportsThatMeet.push(value[1]);
					accumulatedPricesCreatedReports.push(value[2]);
				});

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
					categories: accuulatedPricesCategories,
					title: {
						text: ''
					}
				}, [{
					name: 'Reportes creados',
					data: accumulatedPricesCreatedReports
				}, {
					name: 'Reportes que cumplen',
					type: 'spline',
					data: accumulatedPricesReportsThatMeet
				}]);


				$scope.page.promotors.pricesCommunicated.byDay.all = [];
				$scope.page.promotors.pricesCommunicated.byDay.latest15 = [];
				c = 0;

				for (i = success.data.attributes.prices_by_day.length - 1; i >= 0; i--) {
					if (success.data.attributes.prices_by_day[i].num_total !== -1) {
						$scope.page.promotors.pricesCommunicated.byDay.all.push({
							weekDay: success.data.attributes.prices_by_day[i].week_day,
							monthDay: success.data.attributes.prices_by_day[i].month_day,
							numFulfilled: success.data.attributes.prices_by_day[i].num_fulfilled,
							numTotal: success.data.attributes.prices_by_day[i].num_total
						});
						if (c < 15) {
							$scope.page.promotors.pricesCommunicated.byDay.latest15.push({
								weekDay: success.data.attributes.prices_by_day[i].week_day,
								monthDay: success.data.attributes.prices_by_day[i].month_day,
								numFulfilled: success.data.attributes.prices_by_day[i].num_fulfilled,
								numTotal: success.data.attributes.prices_by_day[i].num_total
							});
							c++;
						}
					}
				}

				$scope.page.promotors.pricesCommunicated.byDay.latest15 = $scope.page.promotors.pricesCommunicated.byDay.latest15.reverse();
				$scope.page.promotors.pricesCommunicated.byDay.all = $scope.page.promotors.pricesCommunicated.byDay.all.reverse();

				// FIN Precios comunicados Al día

				// INI Promociones comunicadas

				// el servicio trae -1 si no hay reportes hoy, si pasa eso, no se muestra el grafico
				if (success.data.attributes.percent_promotions_communicated_today === -1) {
					$scope.page.promotors.promotionsCommunicated.percenToday.show = false;
				} else {
					$scope.page.promotors.promotionsCommunicated.percenToday.show = true;
				}
				// el servicio trae -1 si no hay reportes ayer, si pasa eso, no se muestra el grafico
				if (success.data.attributes.percent_promotions_communicated_yesterday === -1) {
					$scope.page.promotors.promotionsCommunicated.percentYesterday.show = false;
				} else {
					$scope.page.promotors.promotionsCommunicated.percentYesterday.show = true;
				}
				$scope.page.promotors.promotionsCommunicated.percenToday.value = success.data.attributes.percent_prices_communicated_today * 100;
				$scope.page.promotors.promotionsCommunicated.percentYesterday.value = success.data.attributes.percent_prices_communicated_yesterday * 100;
				// FIN Promociones comunicadas

				// INI Promociones comunicadas Tiendas que no cumplen
				angular.forEach(success.data.attributes.communicated_promotions_by_store, function(value, key) {
					$scope.page.promotors.promotionsCommunicated.byStore.list.push({
						zoneName: value.zone_name,
						dealerName: value.dealer_name,
						storeName: value.store_name
					});
				});

				// INI Promociones destacadas  - Al día
				var accumulatedPromotionsCategories = [],
					accumulatedPromotionsCreatedReports = [],
					accumulatedPromotionsReportsThatMeet = [];

				angular.forEach(success.data.attributes.accumulated_promotions, function(value, key) {
					accumulatedPromotionsCategories.push(value[0]);
					accumulatedPromotionsReportsThatMeet.push(value[1]);
					accumulatedPromotionsCreatedReports.push(value[2]);
				});

				$scope.promotions = Utils.setChartConfig('column', 455, {}, [{
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
					categories: accumulatedPromotionsCategories,
					title: {
						text: ''
					}
				}, [{
					name: 'Reportes creados',
					data: accumulatedPromotionsCreatedReports
				}, {
					name: 'Reportes que cumplen',
					type: 'spline',
					data: accumulatedPromotionsReportsThatMeet
				}]);


				$scope.page.promotors.promotionsCommunicated.byDay.all = [];
				$scope.page.promotors.promotionsCommunicated.byDay.latest15 = [];
				c = 0;

				for (i = success.data.attributes.promotions_by_day.length - 1; i >= 0; i--) {
					if (success.data.attributes.promotions_by_day[i].num_total !== -1) {
						$scope.page.promotors.promotionsCommunicated.byDay.all.push({
							weekDay: success.data.attributes.promotions_by_day[i].week_day,
							monthDay: success.data.attributes.promotions_by_day[i].month_day,
							numFulfilled: success.data.attributes.promotions_by_day[i].num_fulfilled,
							numTotal: success.data.attributes.promotions_by_day[i].num_total
						});
						if (c < 15) {
							$scope.page.promotors.promotionsCommunicated.byDay.latest15.push({
								weekDay: success.data.attributes.promotions_by_day[i].week_day,
								monthDay: success.data.attributes.promotions_by_day[i].month_day,
								numFulfilled: success.data.attributes.promotions_by_day[i].num_fulfilled,
								numTotal: success.data.attributes.promotions_by_day[i].num_total
							});
							c++;
						}
					}
				}

				$scope.page.promotors.promotionsCommunicated.byDay.latest15 = $scope.page.promotors.promotionsCommunicated.byDay.latest15.reverse();
				$scope.page.promotors.promotionsCommunicated.byDay.all = $scope.page.promotors.promotionsCommunicated.byDay.all.reverse();

				// FIN Promociones destacadas  - Al día

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

.controller('ViewAllDataTableModalInstance', function($scope, $log, $uibModalInstance, data, Utils) {

	$scope.modal = {
		alert: {
			color: '',
			show: '',
			title: '',
			text: ''
		},
		dataTable: data
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

})

.controller('allDataTableCommunicatedPricesByDayModalInstance', function($scope, $log, $uibModalInstance, data, Utils) {

	$scope.modal = {
		alert: {
			color: '',
			show: '',
			title: '',
			text: ''
		},
		dataTable: data
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});