'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardSaleCtrl
 * @description
 * # DashboardSaleCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DashboardSaleCtrl', function($scope, $log, $uibModal, $moment, $filter, $timeout, Utils, Dashboard, ExcelDashboard, Zones, Dealers, Stores, Users) {

  var currentDate = new Date();
  var firstMonthDay = new Date();
  firstMonthDay.setDate(1);

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
        disabled: false,
        loaded: false
      },
      month: {
        value: new Date(),
        isOpen: false
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
    sales: {
      bestPractices: {
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

  var storesIncluded = [],
    i = 0,
    j = 0,
    k = 0;

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

  $scope.chartConfigSales = Utils.setChartConfig('column', 400, {}, {}, {}, []);

  $scope.chartConfigSalesBetweenConsoles = Utils.setChartConfig('column', 422, {}, {}, {}, []);

  $scope.openModalViewAllSalesValues = function(data) {

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

  $scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {}, {}, []);

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

    var categories = [];
    $scope.categories = [];
    var hardwareSales = [];
    var accesoriesSales = [];
    var gamesSales = [];
    var totals = [];

    $scope.page.sales.bestPractices.loaded = false;

    Dashboard.query({
      category: 'sales',
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
      // $log.log(success);
      if (success.data) {

        var hardwareTotal = 0,
          accessoriesTotal = 0,
          gamesTotal = 0,
          totalTotals = 0,
          namesZones = [],
          seriesSalesBetweenConsoles = [];
        $scope.categories = [];

        // Rescato los nombres de las plataformas
        angular.forEach(success.data.attributes.sales_by_company, function(value, key) {
          categories.push(value.name);
          hardwareSales.push(value.sales_by_type.hardware);
          accesoriesSales.push(value.sales_by_type.accessories);
          gamesSales.push(value.sales_by_type.games);
          totals.push(value.sales_by_type.total);

          $scope.categories.push({
            name: value.name,
            hardware: value.sales_by_type.hardware,
            accessories: value.sales_by_type.accessories,
            games: value.sales_by_type.games,
            total: value.sales_by_type.total
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
        // Suma todas las sumass
        angular.forEach(totals, function(value, key) {
          totalTotals = value + totalTotals;
        });
        $scope.totalsSale = [{
          title: 'Total',
          hardwareTotal: hardwareTotal,
          accessoriesTotal: accessoriesTotal,
          gamesTotal: gamesTotal,
          totals: totalTotals
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
            text: 'Zonas'
          }
        }, seriesSalesBetweenConsoles);

        $scope.tableShareOfSalesAll = success.data.attributes.sales_by_zone;

        var donutData = [],
          donutColors = ['#015496', '#0c7ebd', '#a8a9ac', '#6d6e71'];
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

        /////////////////////////

        $scope.topPorductsCategories = [];
        var topProductsQuantities = [];
        var topTroductByType = success.data.attributes.top_products_by_type;

        for (i = 0; i < topTroductByType.length; i++) {
          $scope.topPorductsCategories.push({
            name: $filter('capitalize')(topTroductByType[i].name, true),
            categories: []
          });
          for (j = 0; j < topTroductByType[i].products.length; j++) {
            $scope.topPorductsCategories[i].categories.push($filter('capitalize')(topTroductByType[i].products[j].name, true));
            topProductsQuantities.push(topTroductByType[i].products[j].quantity);
          }
        }

        $scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {}, {}, []);

        $log.log($scope.topPorductsCategories);

        $scope.chartConfigPriceAndAmount = Utils.setChartConfig('column', 400, {}, {
          min: 0,
          title: {
            text: null
          }
        }, {
          categories: $scope.topPorductsCategories,
          // labels: {
          //   formatter: function() {
          //     var text = this.value,
          //       formatted = text.length > 10 ? text.substring(0, 10) + '...' : text;

          //     return '<div class="js-ellipse" style="width:150px; " title="' + text + '">' + formatted + '</div>';
          //   },
          //   style: {
          //     width: '150px'
          //   },
          //   useHTML: true
          // }
        }, [{
          name: 'Productos',
          data: topProductsQuantities
        }]);

        $scope.selectedCategory = $scope.topPorductsCategories[0];
        $scope.topProducts = {
          headers: [],
          data: []
        };

        // $log.log('$scope.topPorductsCategories');
        // $log.log($scope.topPorductsCategories);

        $scope.getProductsByCategory = function(category) {
          $scope.topProducts.headers = [];
          $scope.topProducts.data = [];

          for (i = 0; i < topTroductByType.length; i++) {
            if (category === topTroductByType[i].name) {
              for (var j = 0; j < topTroductByType[i].products.length; j++) {
                $scope.topProducts.headers.push($filter('capitalize')(topTroductByType[i].products[j].name, true));
                $scope.topProducts.data.push(topTroductByType[i].products[j].quantity);
              }
            }
          }
        };
        if ($scope.topPorductsCategories[0]) {
          $scope.getProductsByCategory($scope.topPorductsCategories[0].name);
        }
        // FIN para gráfica - Productos más vendidos Precio y Cantidad

        // INI Best Practices
        var bestPractices = [];

        angular.forEach(success.data.attributes.best_practices, function(value, key) {
          bestPractices.push({
            src: value
          });
        });

        $scope.page.sales.bestPractices.list = bestPractices;
        $scope.page.sales.bestPractices.loaded = true;

        // FIN Best Practices
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.getDashboardInfo);
      }
      $scope.totalsSale = [{
        title: 'Total',
        hardwareTotal: 0,
        accessoriesTotal: 0,
        gamesTotal: 0
      }];
    });
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

    var zoneIdSelected = $scope.page.filters.zone.selected ? $scope.page.filters.zone.selected.id : '';
    var dealerIdSelected = $scope.page.filters.dealer.selected ? $scope.page.filters.dealer.selected.id : '';
    var storeIdSelected = $scope.page.filters.store.selected ? $scope.page.filters.store.selected.id : '';
    var instructorIdSelected = $scope.page.filters.instructor.selected ? $scope.page.filters.instructor.selected.id : '';
    var supervisorIdSelected = $scope.page.filters.supervisor.selected ? $scope.page.filters.supervisor.selected.id : '';
    var monthSelected = $scope.page.filters.month.value.getMonth() + 1;
    var yearSelected = $scope.page.filters.month.value.getFullYear();

    ExcelDashboard.getFile('#excelBtn', 'sales', 'ventas', monthSelected, yearSelected, instructorIdSelected, supervisorIdSelected, zoneIdSelected, dealerIdSelected, storeIdSelected);

    $timeout(function() {
      $scope.page.buttons.getExcel.disabled = false;
      $scope.page.loader.show = false;
    }, 5000);
  };

  getZones();

})

.controller('ViewAllShareOfSalesModalInstance', function($scope, $log, $uibModalInstance, tableShareOfSalesAll) {

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