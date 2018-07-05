'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CreateTaskCtrl
 * @description
 * # CreateTaskCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('CreateTaskCtrl', function($scope, $log, $filter, $interval, Utils, Zones, Dealers, Stores, Users, Promoters, ReportTypes, Tasks, Validators) {

  $scope.zone_ids = [];
  $scope.store_ids = [];
  $scope.dealer_ids = [];
  $scope.promoter_ids = [];
  var filteredZoneIds = [];
  var filteredDealerIds = [];
  var filteredPromoterIds = [];
  var filteredStoreIds = [];

  $scope.page = {
    title: 'Crear Tarea',
    prevBtn: {
      disabled: true
    },
    newTask: {
      title: {
        value: '',
      },
      description: {
        value: '',
      },
      reportTypes: {
        list: [],
        selectedReportType: null
      },
      zones: {
        list: [],
        selectedZone: [],
        events: {
          onSelectAll: undefined,
          // onChange: undefined
        },
        disabled: true
      },
      dealers: {
        list: [],
        selectedDealer: [],
        events: {
          onItemSelect: undefined,
          onChange: undefined
        },
        disabled: true
      },
      stores: {
        list: [],
        selectedStore: [],
        events: {
          onItemSelect: undefined,
          onChange: undefined
        },
        disabled: true
      },
      promoters: {
        list: [],
        selectedPromoter: [],
        events: {
          onItemSelect: undefined,
          onChange: undefined
        },
        disabled: true
      },
      date: {
        startDate: {
          value: new Date(),
          isOpen: false,
          options: {
            minDate: new Date()
          }
        },
        limitDate: {
          value: new Date(),
          isOpen: false,
          options: {
            minDate: new Date()
          }
        }
      }
    },
    alert: {
      color: null,
      show: false,
      title: null,
      text: null
    },
    dropdownMultiselect: {
      settings: {
        enableSearch: true,
        displayProp: 'name',
        scrollable: true,
        scrollableHeight: 400,
        externalIdProp: '',
        showCheckAll: false,
        showUncheckAll: true
      },
      texts: {
        checkAll: 'Seleccionar todos',
        uncheckAll: 'Desmarcar todos',
        searchPlaceholder: 'Buscar',
        buttonDefaultText: 'Todos',
        dynamicButtonTextSuffix: 'seleccionados'
      }
    },
    count_users: 0
  };

  var i = 0,
    j = 0,
    k = 0,
    currentPage = 0,
    pageSize = 30,
    storesIncluded = [];


  $scope.getZones = function(e) {
    // Valida si el parametro e.success se seteó true para el refresh token
    if (!e.success) {
      $log.error(e.detail);
      return;
    }


    var selectedZones = [];

    var selectedZoneIds = $scope.zone_ids;
    $scope.page.newTask.zones.disabled = true;

    Zones.query({
      'filter[dealer_ids]': $scope.dealer_ids.toString(),
      'filter[store_ids]': $scope.store_ids.toString(),
      'filter[promoter_ids]': $scope.promoter_ids.toString()

    }, function(success) {
      if (success.data) {

        $scope.page.newTask.zones.list = [];
        $scope.page.newTask.zones.selectedZone = [];

        var newZoneIds = [];
        for (i = 0; i < success.data.length; i++) {
          var zone = {
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.name, true),
            type: 'zones'
          };
          $scope.page.newTask.zones.list.push(zone);
          // If this zone was selected before, keep it selected
          if (_.indexOf(selectedZoneIds, parseInt(success.data[i].id)) !== -1) {
            newZoneIds.push(zone.id);
            $scope.page.newTask.zones.selectedZone.push(zone);
          }
        }
        $scope.zone_ids = _.union(selectedZoneIds, newZoneIds);
        filteredZoneIds = newZoneIds;

        $scope.page.newTask.zones.disabled = false;
        //$scope.page.newTask.zones.selectedZone = $scope.page.newTask.zones.list.slice();

        /* $scope.getDealers({
					success: true,
					detail: 'OK'
				}, selectedZones);
				*/
      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.getZones);
      }
    });
  };
  $scope.getDealers = function(e, zones) {
    // Valida si el parametro e.success se seteó true para el refresh token
    if (!e.success) {
      $log.error(e.detail);
      return;
    }
    var selectedDealerIds = $scope.dealer_ids;

    $scope.page.newTask.dealers.disabled = true;

    Dealers.query({
      'filter[zone_ids]': $scope.zone_ids.toString(),
      'filter[store_ids]': $scope.store_ids.toString(),
      'filter[promoter_ids]': $scope.promoter_ids.toString()
    }, function(success) {
      if (success.data) {
        var newDealerIds = [];
        $scope.page.newTask.dealers.selectedDealer = [];
        $scope.page.newTask.dealers.list = [];
        for (var i = 0; i < success.data.length; i++) {
          var dealer = {
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.name, true),
            type: 'dealers'
          };
          $scope.page.newTask.dealers.list.push(dealer);
          if (_.indexOf(selectedDealerIds, parseInt(success.data[i].id)) !== -1) {
            newDealerIds.push(dealer.id);
            $scope.page.newTask.dealers.selectedDealer.push(dealer);
          }

        }
      
        $scope.dealer_ids = _.union(newDealerIds, selectedDealerIds);
        filteredDealerIds = newDealerIds;

        $scope.page.newTask.dealers.disabled = false;
        //$scope.page.newTask.dealers.selectedDealer = $scope.page.newTask.dealers.list.slice();


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
  $scope.getStores = function(e, zones, dealers) {
    if (!e.success) {
      $log.error(e.detail);
      return;
    }

    $scope.page.newTask.stores.list = [];
    var selectedStoreIds = $scope.store_ids;
    // guardo las tiendas seleccionadas antariormente
    // limpio la lista

    $scope.page.newTask.stores.disabled = true;
    // $scope.page.newTask.stores.selectedStore = [];



    Stores.query({
      'filter[dealer_ids]': $scope.dealer_ids.toString(),
      'filter[zone_ids]': $scope.zone_ids.toString(),
      'filter[promoter_ids]': $scope.promoter_ids.toString()
    }, function(success) {
      if (success.data) {
        var newStoreIds = [];
        $scope.page.newTask.stores.list = [];
        $scope.page.newTask.stores.selectedStore = [];
        // $scope.page.newTask.stores.selectedStore = [];

        for (i = 0; i < success.data.length; i++) {
          var store = {
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.name, true),
            type: 'stores'
          };
          $scope.page.newTask.stores.list.push(store);
          if (_.indexOf(selectedStoreIds, parseInt(success.data[i].id)) !== -1) {
            newStoreIds.push(store.id);
            $scope.page.newTask.stores.selectedStore.push(store);
          }
        }

        $scope.store_ids = _.union(newStoreIds, selectedStoreIds);
        filteredStoreIds = newStoreIds;
        //$scope.page.newTask.stores.selectedStore = $scope.page.newTask.stores.list.slice();

        $scope.page.newTask.stores.disabled = false;


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
  $scope.getPromoters = function(e, stores) {
    if (!e.success) {
      $log.error(e.detail);
      return;
    }

    // if ($scope.page.newTask.promoters.selectedPromoter) {}

    var selectedPromoterIds = $scope.promoter_ids;

    $scope.page.newTask.promoters.list = [];
    // guardo la lista de promotores seleccionados anteriormente
    var oldSelectedPromoters = $scope.page.newTask.promoters.selectedPromoter;
    //limpio  la lista de promotores seleccionados anterioemente
    $scope.page.newTask.promoters.selectedPromoter = [];
    $scope.page.newTask.promoters.disabled = true;


    Promoters.query({
      'filter[dealer_ids]': $scope.dealer_ids.toString(),
      'filter[zone_ids]': $scope.zone_ids.toString(),
      'filter[store_ids]': $scope.store_ids.toString()
    }, function(success) {
      if (success.data) {
        var newPromoterIds = [];
        $scope.page.newTask.promoters.list = [];
        $scope.page.count_users = success.data.length;
        // $scope.page.newTask.promoters.selectedPromoter = [];

        for (var i = 0; i < success.data.length; i++) {
          var promoter = {
            id: parseInt(success.data[i].id),
            name: $filter('capitalize')(success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name, true),
            type: 'users'
          };
          $scope.page.newTask.promoters.list.push(promoter);
          if (_.indexOf(selectedPromoterIds, parseInt(success.data[i].id)) !== -1) {
            newPromoterIds.push(promoter.id);
            $scope.page.newTask.promoters.selectedPromoter.push(promoter);
          }
        }

        $scope.promoter_ids = _.union(newPromoterIds, selectedPromoterIds);
        filteredPromoterIds = newPromoterIds;
        $scope.page.newTask.promoters.selectedPromoter = $scope.page.newTask.promoters.list.slice();
        
        $scope.page.newTask.promoters.disabled = false;

      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.log(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.getPromoters);
      }
    });
  };


  $scope.page.newTask.zones.events.onSelectAll = function() {
  };

  $scope.page.newTask.zones.events.onDeselectAll = function() {
    $scope.zone_ids = [];
    $scope.page.newTask.zones.selectedZone = [];
  };

  $scope.page.newTask.dealers.events.onDeselectAll = function() {
    $scope.dealer_ids = [];
    $scope.page.newTask.dealers.selectedDealer = [];
  };

  $scope.page.newTask.stores.events.onDeselectAll = function() {
    $scope.store_ids = [];
    $scope.page.newTask.stores.selectedStore = [];
  };

  $scope.page.newTask.promoters.events.onDeselectAll = function() {
    $scope.promoter_ids = [];
    $scope.page.newTask.promoters.selectedPromoter = [];
  };

  $scope.page.newTask.zones.events.onChange = function() {
    $scope.zone_ids = _.map($scope.page.newTask.zones.selectedZone, function(o) {
      return o.id;
    });

    $scope.getDealers({
      success: true,
      detail: 'OK'
    });
    $scope.getStores({
      success: true,
      detail: 'OK'
    });
    $scope.getPromoters({
      success: true,
      detail: 'OK'
    });

  };

  $scope.page.newTask.dealers.events.onItemSelect = function() {};

  $scope.page.newTask.dealers.events.onChange = function() {
    // $log.log($scope.page.newTask.dealers.selectedDealer);
    $scope.dealer_ids = _.map($scope.page.newTask.dealers.selectedDealer, function(o) {
      return o.id;
    });

    $scope.getZones({
      success: true,
      detail: 'OK'
    });
    $scope.getStores({
      success: true,
      detail: 'OK'
    });
    $scope.getPromoters({
      success: true,
      detail: 'OK'
    });
  };

  $scope.page.newTask.stores.events.onItemSelect = function() {};

  $scope.page.newTask.stores.events.onChange = function() {

    $scope.store_ids = _.map($scope.page.newTask.stores.selectedStore, function(o) {
      return o.id;
    });

    $scope.getZones({
      success: true,
      detail: 'OK'
    });
    $scope.getDealers({
      success: true,
      detail: 'OK'
    });
    $scope.getPromoters({
      success: true,
      detail: 'OK'
    });
  };

  $scope.$watch('$scope.page.newTask.promoters.selectedPromoter', function() {
    //$log.error('watch');
    //$log.error(document.getElementsByName("dealers")[0].multiselect('rebuild'));
    $scope.page.newTask.stores.selectedStore = [];

    console.error($scope.page.dropdownMultiselect.texts.buttonDefaultText);
    $scope.page.dropdownMultiselect.texts.buttonDefaultText = "Ejemplo"
    console.error($scope.page.dropdownMultiselect.texts.buttonDefaultText);
  });

  $scope.page.newTask.promoters.events.onItemSelect = function() {
    $log.error('onItemSelect');
    $scope.page.newTask.zones.events.onDeselectAll();
    /*console.error($scope.page.dropdownMultiselect.texts.buttonDefaultText);
    $scope.page.dropdownMultiselect.texts.buttonDefaultText = "Ejemplo"
    console.error($scope.page.dropdownMultiselect.texts.buttonDefaultText);*/
  };

  $scope.page.newTask.promoters.events.onChange = function() {

    $scope.promoter_ids = _.map($scope.page.newTask.promoters.selectedPromoter, function(o) {
      return o.id;
    });
    $scope.getZones({
      success: true,
      detail: 'OK'
    });
    $scope.getDealers({
      success: true,
      detail: 'OK'
    });
    $scope.getStores({
      success: true,
      detail: 'OK'
    });
  };

  $scope.setAlertProperties = function(show, color, title, text) {
    $scope.page.alert.color = color;
    $scope.page.alert.show = show;
    $scope.page.alert.title = title;
    $scope.page.alert.text = text;
  };

  var validateForm = function() {
    $scope.setAlertProperties(false, '', '', '');

    if (!Validators.validaRequiredField($scope.page.newTask.title.value)) {
      $scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar un título para la tarea');
      return false;
    }
    if (!Validators.validaRequiredField($scope.page.newTask.date.startDate.value)) {
      $scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar una fecha de incio para realizar la tarea');
      return false;
    }
    if (!Validators.validaRequiredField($scope.page.newTask.date.limitDate.value)) {
      $scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar una fecha límite para realizar la tarea');
      return false;
    }
    if ($scope.page.newTask.dealers.selectedDealer.length === 0 &&
      $scope.page.newTask.zones.selectedZone.length === 0 &&
      $scope.page.newTask.stores.selectedStore.length === 0 &&
      $scope.page.newTask.promoters.selectedPromoter.length === 0) {
      $scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe seleccionar al menos una zona/dealer/tienda o promotor');
      return false;
    }
    /* if ($scope.page.newTask.stores.selectedStore <= 0) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar al menos una tienda');
			return false;
		}
		if ($scope.page.newTask.promoters.selectedPromoter.length <= 0) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar al menos un promotor');
			return false;
		}
		*/
    if (!Validators.validaRequiredField($scope.page.newTask.description.value)) {
      $scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar un comentario para la tarea');
      return false;
    }
    return true;
  };

  $scope.createTask = function(e) {
    // Valida si el parametro e.success se seteó true para el refresh token
    if (!e.success) {
      $log.error(e.detail);
      return;
    }

    // $log.log($scope.page.newTask.title.value);
    // $log.log($scope.page.newTask.description.value);
    // $log.log($scope.page.newTask.date.startDate.value.toISOString());
    // $log.log($scope.page.newTask.date.limitDate.value.toISOString());
    // $log.log($scope.page.newTask.zones.selectedZone);
    // $log.log($scope.page.newTask.dealers.selectedDealer);
    // $log.log($scope.page.newTask.stores.selectedStore);
    $log.error($scope.page.newTask.promoters.selectedPromoter);

    if (!validateForm()) {
      Utils.gotoAnyPartOfPage('topPageCreateTask');
      return;
    }

    // Borro el attr name de todos los modelos
    $scope.page.newTask.zones.selectedZone = _.map($scope.page.newTask.zones.selectedZone, function(o) {
      return _.omit(o, 'name');
    });
    $scope.page.newTask.dealers.selectedDealer = _.map($scope.page.newTask.dealers.selectedDealer, function(o) {
      return _.omit(o, 'name');
    });
    $scope.page.newTask.stores.selectedStore = _.map($scope.page.newTask.stores.selectedStore, function(o) {
      return _.omit(o, 'name');
    });
    $scope.page.newTask.promoters.selectedPromoter = _.map($scope.page.newTask.promoters.selectedPromoter, function(o) {
      return _.omit(o, 'name');
    });

    /*Tasks.save({
      'data': {
        type: 'tasks',
        attributes: {
          title: $scope.page.newTask.title.value,
          description: $scope.page.newTask.description.value,
          task_start: $scope.page.newTask.date.startDate.value.toISOString(),
          task_end: $scope.page.newTask.date.limitDate.value.toISOString()
        },
        relationships: {
          zones: {
            data: $scope.page.newTask.zones.selectedZone
          },
          dealers: {
            data: $scope.page.newTask.dealers.selectedDealer
          },
          stores: {
            data: $scope.page.newTask.stores.selectedStore
          },
          promoters: {
            data: $scope.page.newTask.promoters.selectedPromoter
          }
        }
      }
    }, function(success) {
      $log.log(success);
      if (success.data) {
        var message = 'Tarea creada con éxito';
        if (success.data.attributes && success.data.attributes.result) {
          message += '\nSe ha generado un total de ' + success.data.attributes.result.num_reports_assigned + ' tarea(s) pendiente(s)';
        }
        $scope.setAlertProperties(true, 'success', 'Tarea creada', message);
        Utils.gotoAnyPartOfPage('topPageCreateTask');

        $scope.zone_ids = [];
        $scope.page.newTask.zones.selectedZone = [];
        $scope.dealer_ids = [];
        $scope.page.newTask.dealers.selectedDealer = [];
        $scope.store_ids = [];
        $scope.page.newTask.stores.selectedStore = [];
        $scope.promoter_ids = [];
        $scope.page.newTask.promoters.selectedPromoter = [];

        $scope.getZones({
          success: true,
          detail: 'OK'
        });

        $scope.getDealers({
          success: true,
          detail: 'OK'
        });

        $scope.getStores({
          success: true,
          detail: 'OK'
        });

        $scope.getPromoters({
          success: true,
          detail: 'OK'
        });

        $scope.page.newTask.title.value = '';
        $scope.page.newTask.description.value = '';
        $scope.changeExecImmediately();
      } else {
        $log.error(success);
      }
    }, function(error) {
      $log.error(error);
      if (error.status === 401) {
        Utils.refreshToken($scope.createTask);
      } else if (error.status === 400) {
        $scope.setAlertProperties(true, 'danger', 'Error al crear la tarea', error.data.errors[0].detail);
        Utils.gotoAnyPartOfPage('topPageCreateTask');
      }
    });*/
  };

  $scope.changeExecImmediately = function() {
    if ($scope.check) {
      changeHour(new Date(), new Date());
    }
  };

  var changeHour = function(startDate, endDate) {
    $scope.page.newTask.date.startDate.value = startDate;
    $scope.page.newTask.date.limitDate.value = endDate;
  };

  $scope.getZones({
    success: true,
    detail: 'OK'
  });

  $scope.getDealers({
    success: true,
    detail: 'OK'
  });

  $scope.getStores({
    success: true,
    detail: 'OK'
  });

  $scope.getPromoters({
    success: true,
    detail: 'OK'
  });


});