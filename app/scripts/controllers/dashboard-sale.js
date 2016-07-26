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

.controller('DashboardSaleCtrl', function($scope, $log, $uibModal, $filter, Utils, Dashboard, DataPlayStation) {

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
		j = 0,
		k = 0;

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

	$scope.chartConfigSales = Utils.setChartConfig('column', 400, {}, {}, {}, []);

	$scope.chartConfigSalesBetweenConsoles = Utils.setChartConfig('column', 422, {}, {}, {}, []);

	$scope.openModalViewAllSalesValues = function(data) {
		$log.log(data);

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'viewAllShareOfSalesModal.html',
			controller: 'ViewAllShareOfSalesModalInstance',
			size: 'md',
			resolve: {
				tableShareOfSalesAll: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	// $scope.donutData = [];

	$scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {}, {}, []);

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
					gamesTotal = 0,
					namesZones = [],
					seriesSalesBetweenConsoles = [];

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

				angular.forEach(success.data.attributes.sales_by_zone, function(value, key) {
					namesZones.push($filter('capitalize')(value.name, true));
					if (key === 0) {
						angular.forEach(value.sales_by_company, function(valueSaleByCompany, key) {
							seriesSalesBetweenConsoles.push({
								name: valueSaleByCompany.name,
								data: []
							});
						});
					}
				});

				// recorro sales_by_zone
				for (i = 0; i < success.data.attributes.sales_by_zone.length; i++) {
					// dentro de ese arreglo, recorro sales_by_company
					for (j = 0; j < success.data.attributes.sales_by_zone[i].sales_by_company.length; j++) {
						// recorro el arreglo donde anteriormente guardo las companies y agrego loa valores
						for (k = 0; k < seriesSalesBetweenConsoles.length; k++) {
							if (seriesSalesBetweenConsoles[k].name === success.data.attributes.sales_by_zone[i].sales_by_company[j].name) {
								seriesSalesBetweenConsoles[k].data.push(success.data.attributes.sales_by_zone[i].sales_by_company[j].sales_amount);
							}
						}
					}
				}

				$scope.chartConfigSalesBetweenConsoles = Utils.setChartConfig('column', 513, {
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
					categories: namesZones,
					title: {
						text: 'Plataformas'
					}
				}, seriesSalesBetweenConsoles);

				$scope.tableShareOfSalesAll = success.data.attributes.sales_by_zone;

				var donutData = [],
					donutColors = ['#3f5b71', '#f15f4c', '#f19122', '#fcc111'];
				angular.forEach(success.data.attributes.share_percentages, function(value, key) {
					donutData.push({
						label: value.name,
						value: Math.round(value.share_percentage * 10000) / 100,
						color: donutColors[key]
					});
				});

				$scope.donutData = donutData;

				// INICIO para gráfica - Productos más vendidos Precio y Cantidad
				var topProducts = {
					names: [],
					quantities: [],
					salesAmounts: []
				};
				angular.forEach(success.data.attributes.top_products, function(value, key) {
					topProducts.names.push(
						$filter('capitalize')(value.name, true)
					);
					topProducts.quantities.push(
						value.quantity
					);
					topProducts.salesAmounts.push(
						value.sales_amount
					);
				});

				$scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {
					min: 0,
					title: {
						text: null
					}
				}, {
					categories: topProducts.names,
					title: {
						text: 'Juegos'
					}
				}, [{
					name: 'Cantidad',
					data: topProducts.quantities
				}, {
					name: 'Monto',
					data: topProducts.salesMount
				}]);
				// FIN para gráfica - Productos más vendidos Precio y Cantidad
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

.controller('ViewAllShareOfSalesModalInstance', function($scope, $log, $uibModalInstance, tableShareOfSalesAll) {
	$log.log(tableShareOfSalesAll);

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
		},
		tableShareOfSalesAll: tableShareOfSalesAll
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

});