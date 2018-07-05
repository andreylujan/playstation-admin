'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardStockCtrl
 * @description
 * # DashboardStockCtrl
 * Controller of the minovateApp
 */
 angular.module('minovateApp')

 .controller('DashboardStockCtrl', function($scope, $log, $uibModal, $moment, $filter, $timeout, Utils, 
  NgTableParams, Dashboard, DashboardStock, Zones, Dealers, Stores, Users, ExcelDashboard) {

 	var currentDate = new Date();
 	var firstMonthDay = new Date();
 	firstMonthDay.setDate(1);
 	var stockBreaks = [],
 	topProducts = [],
 	i = 0,
 	j = 0;

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
      zone_second: {
        list: [],
        selected: null
      },
      dealer_second: {
        list: [],
        selected: null,
        disabled: false
      },
      store_second: {
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
 					endDate: currentDate,
          selected_second: currentDate
 				}
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
 		},
    stock_graph: {}
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
        $scope.getDashboardStock({
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

 	var getZones = function() {

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

  var getZonesSecond = function() {

    $scope.page.filters.zone_second.list = [];

    Zones.query({}, function(success) {
      if (success.data) {

        $scope.page.filters.zone_second.list.push({
          id: '',
          name: 'Todas las Zonas',
          dealersIds: []
        });

        angular.forEach(success.data, function(value, key) {
          $scope.page.filters.zone_second.list.push({
            id: parseInt(value.id),
            name: value.attributes.name,
            dealersIds: value.attributes.dealer_ids
          });
        });

        $scope.page.filters.zone_second.selected = $scope.page.filters.zone_second.list[0];
        $scope.getDealersSecond({
          success: true,
          detail: 'OK'
        }, $scope.page.filters.zone_second.selected);

      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken(getZonesSecond);
      }
    });
  };

  $scope.getDealersSecond = function(e, zoneSelected) {

    $scope.page.filters.dealer_second.selected = [];
    $scope.page.filters.dealer_second.list = [];

    Dealers.query({
      'filter[zone_ids]': zoneSelected.id
    }, function(success) {
      if (success.data) {

        $scope.page.filters.dealer_second.list.push({
          id: '',
          name: 'Todos los dealers'
        });

        for (i = 0; i < success.data.length; i++) {
          $scope.page.filters.dealer_second.list.push({
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.name, true),
            type: 'dealers'
          });
        }

        $scope.page.filters.dealer_second.selected = $scope.page.filters.dealer_second.list[0];
        $scope.page.filters.dealer_second.disabled = false;

        $scope.getStoresSecond({
          success: true,
          detail: 'OK'
        }, $scope.page.filters.zone.selected, $scope.page.filters.dealer_second.selected);

      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.getDealersSecond);
      }
    });
  };

  $scope.getStoresSecond = function(e, zoneSelected, dealerSelected) {

    $scope.page.filters.store_second.selected = [];
    $scope.page.filters.store_second.list = [];

    Stores.query({
      'filter[dealer_ids]': dealerSelected.id,
      'filter[zone_ids]': zoneSelected.id
    }, function(success) {
      if (success.data) {

        $scope.page.filters.store_second.list.push({
          id: '',
          name: 'Todas las tiendas'
        });

        for (i = 0; i < success.data.length; i++) {
          $scope.page.filters.store_second.list.push({
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.name, true),
            type: 'dealers'
          });
        }

        $scope.page.filters.store_second.selected = $scope.page.filters.store_second.list[0];
        $scope.page.filters.store_second.disabled = false;

      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.getStoresSecond);
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

 		stockBreaks = [];
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
			getStockProducts(success);
			// FIN STOCK BREAKS

			// INI STOCK BREAKS
			getTopStockBreaks(success);
			// FIN STOCK BREAKS

			// INI STOCK COMPANY
			getStockByCompany(success);
			// FIN STOCK COMPANY

			// INI STOCK COMPANY
			getShareStock(success);
			// FIN STOCK COMPANY


			// INI TOP PRODUCTS
			getProductsHighRotation(success);
			// FIN TOP PRODUCTS

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getDashboardInfo);
			}
		});
 	};

  $scope.getDashboardStock = function(e) {
  if (!e.success) {
    $log.error(e.detail);
    return;
  }

  var dealerIdSelected = $scope.page.filters.dealer_second.selected.name != 'Todos los dealers' ? $scope.page.filters.dealer_second.selected.name : '';
  var storeIdSelected = $scope.page.filters.store_second.selected ? $scope.page.filters.store_second.selected.id : '';
  var startDate = new Date($scope.page.filters.dateRange.date.selected_second);
  var weeknumber = moment(startDate).week();

  DashboardStock.query({
    dealer_id: dealerIdSelected,
    store_id: storeIdSelected,
    week: weeknumber
  }, function(success) {
      $scope.page.stock_graph.chartConfig = Utils.setChartConfig('column', 400, {}, {
        min: 0,
        title: {
          text: null
        }
      }, {
        categories: _.map(success.data, function(s){ return s.category; }),
        title: {
          text: 'Categorias'
        }
      }, 
      [{        
        data: _.map(success.data, function(s){ return s.total_stock; }),
        name: 'Total'
      }]);

  }, function(error) {
    $log.error(error);
    if (error.status === 401) {
      Utils.refreshToken($scope.getDashboardInfo);
    }
  });
};

 	var getShareStock = function(data) {

 		var donutData = [],
    donutColors = ['#015496', '#0c7ebd', '#a8a9ac', '#6d6e71'];
    angular.forEach(data.data.attributes.share_percentages, function(value, key) {
      donutData.push({
        label: value.name,
        value: Math.round(value.share_percentage * 10000) / 100,
        color: donutColors[key]
      });
    });

    $scope.donutData = donutData;
  };

  var getStockByCompany = function(data) {

   $scope.charValueStock = Utils.setChartConfig('column', 400, {}, {}, {}, []);

   var categories = [];
   $scope.categories = [];
   var hardwareSales = [];
   var accesoriesSales = [];
   var gamesSales = [];
   var totals = [];

   angular.forEach(data.data.attributes.stocks_by_company, function(value, key) {
    categories.push(value.name);
    hardwareSales.push(value.stocks_by_type.hardware);
    accesoriesSales.push(value.stocks_by_type.accessories);
    gamesSales.push(value.stocks_by_type.games);
    totals.push(value.stocks_by_type.total);

    $scope.categories.push({
      name: value.name,
      hardware: value.stocks_by_type.hardware,
      accessories: value.stocks_by_type.accessories,
      games: value.stocks_by_type.games,
      total: value.stocks_by_type.total
    });
  });


   $scope.charValueStock = Utils.setChartConfig('column', 300, {
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
      text: 'Marcas'
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
 };

 var getTopStockBreaks = function(data) {

   var categories;
   var contenedorCategories = [];
   var names = [];


   angular.forEach(data.data.attributes.top_stock_breaks, function(value, key) {
    categories = [];
    var tiendas = [];
    var stockTienda = [];
    names.push(value.product_name);
    angular.forEach(value.stock_breaks_by_dealer, function(item, key) {
 				//$log.error(item.dealer_name);
 				tiendas.push(item.dealer_name);
 				stockTienda.push(item.num_stock_breaks);
 			});
    categories.push(tiendas);
    categories.push(stockTienda);
    categories.push(value.product_name);

    contenedorCategories.push(categories);
  });

   var graficos = [];
   angular.forEach(contenedorCategories, function(value, key) {
      var chartStockBreak = Utils.setChartConfig('column', 300, {
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
        categories: value[0],
        title: {
          text: 'Tiendas'
        }
      }, [{
        name: 'Stock',
        data: value[1]
      }]);

      var aux = [{
        'name': value[2],
        'grafico': chartStockBreak
      }];

      //$log.error(aux);

      graficos.push(aux);
    });

   $scope.page.stock.graficos = graficos;

 };



 var getStockProducts = function(data) {
   angular.forEach(data.data.attributes.stock_breaks, function(value, key) {

    stockBreaks.push({
     storeName: value.store_name,
     dealerName: value.dealer_name,
     description: value.description,
     category: value.category,
     platform: value.platform,
     publisher: value.publisher,
     units: value.units,
     ean: value.ean
   });
  });

   $scope.page.stock.stockBreaks.tableParams = new NgTableParams({
    sorting: {
     units: "desc"
   }
 }, {
  dataset: stockBreaks
});
 };

 var getProductsHighRotation = function(data) {
   angular.forEach(data.data.attributes.top_products, function(value, key) {

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
getZonesSecond();

$scope.openModalStock = function(idMonthlyGoal) {
  var modalInstance = $uibModal.open({
    animation: true,
    backdrop: false,
    templateUrl: 'newStock.html',
    controller: 'newStockModalInstance',
    resolve: {
    }
  });

  modalInstance.result.then(function() {
    // $scope.getDashboardStock();
  }, function() {
    // $scope.getStockBreaks();
  });
};

})
.controller('newStockModalInstance', function($scope, $log, $uibModalInstance, $uibModal, 
  CsvStock, Utils) {

  $scope.modal = {
    title: {
      text: 'Carga de metas mensuales'
    },
    subtitle: {
      text: ''
    },
    alert: {
      show: false,
      title: '',
      text: '',
      color: ''
    },
    monthlyGoal: {
      date: {
        value: new Date()
      },
      goal: {
        value: null
      },
      file: {
        value: null
      }
    },
    datepicker: {
      opened: false
    },
    buttons: {
      create: {
        text: 'Cargar',
        show: true,
        border: false
      },
      edit: {
        text: 'Editar',
        show: false,
        border: false
      },
      delete: {
        text: 'Eliminar',
        show: false,
        border: false
      }
    },
    overlay: {
      show: false
    }
  };

  var i = 0,
    j = 0;

  $scope.openDatePicker = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.modal.datepicker.opened = !$scope.modal.datepicker.opened;
  };

  $scope.cancel = function() {
    $uibModalInstance.close();
  };

  var removeAlert = function() {
    $scope.modal.alert.color = '';
    $scope.modal.alert.title = '';
    $scope.modal.alert.show = true;
  };

  $scope.createMonthlyGoal = function() {

    if ($scope.modal.monthlyGoal.file.value) {
      uploadCsvMonthlyGoals({
        success: true,
        detail: 'OK'
      });
    } else {

    }
  };

  var uploadCsvMonthlyGoals = function(e) {
    if (!e.success) {
      $log.error(e.detail);
      return;
    }

    // openModalSummaryLoadMonthlyGoal();

    removeAlert();

    if (!$scope.modal.monthlyGoal.file.value) {
      return;
    }

    if ($scope.modal.monthlyGoal.file.value.type !== 'text/csv' &&
      $scope.modal.monthlyGoal.file.value.type !== 'text/comma-separated-values' &&
      $scope.modal.monthlyGoal.file.value.type !== 'application/csv' &&
      $scope.modal.monthlyGoal.file.value.type !== 'application/excel' &&
      $scope.modal.monthlyGoal.file.value.type !== 'application/vnd.ms-excel' &&
      $scope.modal.monthlyGoal.file.value.type !== 'application/vnd.msexcel' &&
      $scope.modal.monthlyGoal.file.value.type !== 'text/anytext') {

      $scope.modal.alert.color = 'blue-ps-1';
      $scope.modal.alert.show = true;
      $scope.modal.alert.title = 'El archivo seleccionado no es válido.';
      return;
    }

    $scope.modal.overlay.show = true;

    var form = [{
      field: 'csv',
      value: $scope.modal.monthlyGoal.file.value
    }, {
      field: 'month',
      value: $scope.modal.monthlyGoal.date.value.getMonth() + 1
    }, {
      field: 'year',
      value: $scope.modal.monthlyGoal.date.value.getFullYear()
    }];

    CsvStock.upload(form).success(function(success) {
      $uibModalInstance.close();
      openModalSummaryLoadMonthlyGoal(success);
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken(uploadCsvMonthlyGoals);
      }
    });
  };

  var openModalSummaryLoadMonthlyGoal = function(data) {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'summaryLoadMonthlyGoal.html',
      controller: 'SummaryLoadMonthlyGoalModalInstance',
      resolve: {
        data: function() {
          return data;
        }
      }
    });

    modalInstance.result.then(function() {
      // $scope.getStockBreaks();
    }, function() {
      // $scope.getStockBreaks();
    });
  };

})

.controller('SummaryLoadMonthlyGoalModalInstance', function($scope, $log, $uibModalInstance, data) {

  $scope.modal = {
    title: {
      text: 'Resumen carga de metas mensuales'
    },
    subtitle: {
      text: ''
    },
    alert: {
      show: false,
      title: '',
      text: '',
      color: ''
    },
    summaryData: data,
    successes: {
      data: [],
      count: 0
    },
    errors: {
      data: [],
      count: 0
    }
  };

  var i = 0,
    j = 0;

  for (i = 0; i < data.data.length; i++) {
    // éxito
    if (data.data[i].meta.success) {
      $scope.modal.successes.count++;
      $scope.modal.successes.data.push({
        storeCode: data.data[i].meta.row_data.store_code
      });

      // error
    } else {
      $scope.modal.errors.count++;

      var storeCode = data.data[i].meta.errors.store_code ? storeCode = 'Código producto' : storeCode = null;
      var descriptionStoreCode = data.data[i].meta.errors.store_code ? descriptionStoreCode = data.data[i].meta.errors.store_code[0] : descriptionStoreCode = null;

      var monthlyGoal = data.data[i].meta.errors.monthly_goal ? monthlyGoal = 'Monto' : monthlyGoal = null;
      var descriptionMonthlyGoal = data.data[i].meta.errors.monthly_goal ? descriptionMonthlyGoal = data.data[i].meta.errors.monthly_goal[0] : descriptionMonthlyGoal = null;

      $scope.modal.errors.data.push({
        rowNumber: data.data[i].meta.row_number + 1,
        fields: [{
          name: storeCode,
          detail: descriptionStoreCode
        }, {
          name: monthlyGoal,
          detail: descriptionMonthlyGoal
        }]
      });
    }
  }

  $scope.cancel = function() {
    $uibModalInstance.close();
  };

});