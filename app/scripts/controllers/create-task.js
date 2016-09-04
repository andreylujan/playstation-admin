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

	$scope.page = {
		title: 'Crear tarea',
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
				showUncheckAll: false
			},
			texts: {
				checkAll: 'Seleccionar todos',
				uncheckAll: 'Deseleccionar todas',
				searchPlaceholder: 'Buscar',
				buttonDefaultText: 'Seleccionar',
				dynamicButtonTextSuffix: 'seleccionados'
			}
		}
	};

	var i = 0,
		j = 0,
		k = 0,
		currentPage = 0,
		pageSize = 30,
		storesIncluded = [];

	var getReportTypes = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.newTask.reportTypes.list = [];

		ReportTypes.query({
			idOrganization: 1
		}, function(success) {
			// $log.log(success);
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					if (success.data[i].id !== '2') {
						$scope.page.newTask.reportTypes.list.push({
							id: parseInt(success.data[i].id),
							name: success.data[i].attributes.name
						});
					}
				}
				$scope.page.newTask.reportTypes.selectedReportType = $scope.page.newTask.reportTypes.list[0];

				getZones({
					success: true,
					detail: 'OK'
				});

			} else {
				$log.success(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getReportTypes);
			}
		});
	};
	var getZones = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.newTask.zones.list = [];
		var selectedZones = [];
		$scope.page.newTask.zones.selectedZone = [];
		$scope.page.newTask.zones.disabled = true;

		Zones.query({}, function(success) {
			if (success.data) {

				$scope.page.newTask.zones.list = [];
				$scope.page.newTask.zones.selectedZone = [];

				for (i = 0; i < success.data.length; i++) {
					$scope.page.newTask.zones.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'zones'
					});
				}

				$scope.page.newTask.zones.disabled = false;

				$scope.getDealers({
					success: true,
					detail: 'OK'
				}, selectedZones);

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
	$scope.getDealers = function(e, zones) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var selectedZonesIds = [];
		var selectedDealers = [];
		// Guardo los antiguos dealers seleccionados
		var oldSelectedDealers = $scope.page.newTask.dealers.selectedDealer;
		$scope.page.newTask.dealers.selectedDealer = [];
		$scope.page.newTask.dealers.list = [];
		$scope.page.newTask.dealers.disabled = true;
		// $scope.page.newTask.dealers.selectedDealer = [];

		for (i = 0; i < zones.length; i++) {
			selectedZonesIds.push(zones[i].id);
		}

		Dealers.query({
			'filter[zone_ids]': selectedZonesIds.toString()
		}, function(success) {
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.dealers.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'dealers'
					});
				}

				var is = false;
				for (i = 0; i < oldSelectedDealers.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.dealers.list.length; j++) {
						if (parseInt(oldSelectedDealers[i].id) === parseInt($scope.page.newTask.dealers.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.dealers.selectedDealer.push(oldSelectedDealers[i]);
					}
				}

				$scope.page.newTask.dealers.disabled = false;

				$scope.getStores({
					success: true,
					detail: 'OK'
				}, zones, selectedDealers);

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
		var selectedZonesIds = [];
		var selectedDealersIds = [];
		var selectedStores = [];
		// guardo las tiendas seleccionadas antariormente
		var oldSelectedStores = $scope.page.newTask.stores.selectedStore;
		// limpio la lista
		$scope.page.newTask.stores.selectedStore = [];
		$scope.page.newTask.stores.disabled = true;
		// $scope.page.newTask.stores.selectedStore = [];

		for (i = 0; i < zones.length; i++) {
			selectedZonesIds.push(zones[i].id);
		}
		for (i = 0; i < dealers.length; i++) {
			selectedDealersIds.push(dealers[i].id);
		}

		Stores.query({
			'filter[zone_ids]': selectedZonesIds.toString(),
			'filter[dealer_ids]': selectedDealersIds.toString()
		}, function(success) {
			if (success.data) {

				$scope.page.newTask.stores.list = [];
				// $scope.page.newTask.stores.selectedStore = [];

				for (i = 0; i < success.data.length; i++) {
					$scope.page.newTask.stores.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'stores'
					});
				}


				var is = false;
				for (i = 0; i < oldSelectedStores.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.stores.list.length; j++) {
						if (parseInt(oldSelectedStores[i].id) === parseInt($scope.page.newTask.stores.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.stores.selectedStore.push(oldSelectedStores[i]);
					}
				}

				$scope.page.newTask.stores.disabled = false;

				getPromoters({
					success: true,
					detail: 'OK'
				}, $scope.page.newTask.stores.list);

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
	var getPromoters = function(e, stores) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		// if ($scope.page.newTask.promoters.selectedPromoter) {}

		var selectedZonesIds = [];
		var selectedDealersIds = [];
		var selectedStoresIds = [];
		$scope.page.newTask.promoters.list = [];
		// guardo la lista de promotores seleccionados anteriormente
		var oldSelectedPromoters = $scope.page.newTask.promoters.selectedPromoter;
		//limpio  la lista de promotores seleccionados anterioemente
		$scope.page.newTask.promoters.selectedPromoter = [];
		$scope.page.newTask.promoters.disabled = true;

		for (i = 0; i < stores.length; i++) {
			selectedStoresIds.push(stores[i].id);
		}

		Promoters.query({
			'filter[store_ids]': selectedStoresIds.toString()
		}, function(success) {
			if (success.data) {
				$scope.page.newTask.promoters.list = [];
				// $scope.page.newTask.promoters.selectedPromoter = [];

				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.promoters.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name, true),
						type: 'users'
					});
				}

				var is = false;
				for (i = 0; i < oldSelectedPromoters.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.promoters.list.length; j++) {
						if (parseInt(oldSelectedPromoters[i].id) === parseInt($scope.page.newTask.promoters.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.promoters.selectedPromoter.push(oldSelectedPromoters[i]);
					}
				}

				$scope.page.newTask.promoters.disabled = false;

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getPromoters);
			}
		});
	};

	var getZonesFromDealers = function(e, ids) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var dealersIds = [];
		$scope.page.newTask.zones.list = [];
		var oldSelectedZones = $scope.page.newTask.zones.selectedZone;
		$scope.page.newTask.zones.selectedZone = [];
		$scope.page.newTask.zones.disabled = true;

		for (i = 0; i < ids.length; i++) {
			dealersIds.push(ids[i].id);
		}

		Zones.query({
			'filter[dealer_ids]': dealersIds.toString(),
			'fields[zones]': 'name'
		}, function(success) {
			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.page.newTask.zones.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'zones'
					});
				}

				var is = false;
				for (i = 0; i < oldSelectedZones.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.zones.list.length; j++) {
						if (parseInt(oldSelectedZones[i].id) === parseInt($scope.page.newTask.zones.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.zones.selectedZone.push(oldSelectedZones[i]);
					}
				}
				$scope.page.newTask.zones.disabled = false;

			}
		}, function(error) {
			$log.log(error);
		});
	};
	var getDealersFromStores = function(e, ids) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		// Si ya hay alguna dealer seleccionado, se sale de la funcion
		if ($scope.page.newTask.dealers.selectedDealer.length > 0) {
			return;
		}

		var dealersIds = [];
		for (i = 0; i < ids.length; i++) {
			dealersIds.push(ids[i].id);
		}

		$scope.page.newTask.dealers.selectedDealer = [];
		$scope.page.newTask.dealers.list = [];
		var oldSelectedDealers = $scope.page.newTask.dealers.selectedDealer;
		$scope.page.newTask.dealers.selectedDealer = [];
		$scope.page.newTask.dealers.disabled = true;

		Dealers.query({
			'filter[store_ids]': dealersIds.toString(),
			'fields[dealers]': 'name'
		}, function(success) {
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.page.newTask.dealers.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'dealers'
					});
				}

				var is = false;
				for (i = 0; i < oldSelectedDealers.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.dealers.list.length; j++) {
						if (parseInt(oldSelectedDealers[i].id) === parseInt($scope.page.newTask.dealers.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.dealers.selectedDealer.push(oldSelectedDealers[i]);
					}
				}

				$scope.page.newTask.dealers.disabled = false;

			}

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getDealersFromStores);
			}
		});
	};
	var getStoresFromPromoters = function(e, ids) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		// Si ya hay alguna tienda seleccionada, se sale de la funcion
		if ($scope.page.newTask.stores.selectedStore.length > 0) {
			return;
		}

		var promotersIds = [];
		for (i = 0; i < ids.length; i++) {
			promotersIds.push(ids[i].id);
		}

		$scope.page.newTask.stores.selectedStore = [];
		$scope.page.newTask.stores.list = [];
		var oldSelectedPromoters = $scope.page.newTask.promoters.selectedPromoter;
		$scope.page.newTask.promoters.selectedPromoter = [];
		$scope.page.newTask.stores.disabled = true;

		Stores.query({
			'filter[promoter_ids]': promotersIds.toString()
		}, function(success) {
			if (success.data) {

				for (i = 0; i < success.data.length; i++) {

					$scope.page.newTask.stores.list.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'stores'
					});
				}

				var is = false;
				for (i = 0; i < oldSelectedPromoters.length; i++) {
					is = false;
					for (j = 0; j < $scope.page.newTask.promoters.list.length; j++) {
						if (parseInt(oldSelectedPromoters[i].id) === parseInt($scope.page.newTask.promoters.list[j].id)) {
							is = is || true;
							break;
						}
					}
					if (is) {
						$scope.page.newTask.promoters.selectedPromoter.push(oldSelectedPromoters[i]);
					}
				}

				$scope.page.newTask.stores.disabled = false;

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getStoresFromPromoters);
			}
		});
	};

	$scope.page.newTask.zones.events.onSelectAll = function() {

	};

	$scope.page.newTask.zones.events.onChange = function() {

		$scope.getDealers({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.zones.selectedZone);
	};

	$scope.page.newTask.dealers.events.onItemSelect = function() {};

	$scope.page.newTask.dealers.events.onChange = function() {
		// $log.log($scope.page.newTask.dealers.selectedDealer);
		$scope.getStores({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.zones.selectedZone, $scope.page.newTask.dealers.selectedDealer);

		getZonesFromDealers({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.dealers.selectedDealer);
	};

	$scope.page.newTask.stores.events.onItemSelect = function() {};

	$scope.page.newTask.stores.events.onChange = function() {
		getPromoters({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.stores.selectedStore);

		getDealersFromStores({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.stores.selectedStore);
	};

	$scope.page.newTask.promoters.events.onItemSelect = function() {};

	$scope.page.newTask.promoters.events.onChange = function() {
		getStoresFromPromoters({
			success: true,
			detail: 'OK'
		}, $scope.page.newTask.promoters.selectedPromoter);
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
		if ($scope.page.newTask.stores.selectedStore <= 0) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar al menos una tienda');
			return false;
		}
		if ($scope.page.newTask.promoters.selectedPromoter.length <= 0) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar al menos un promotor');
			return false;
		}
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
		// $log.log($scope.page.newTask.promoters.selectedPromoter);

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

		Tasks.save({
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
				$scope.setAlertProperties(true, 'success', 'Tarea creada', 'Tarea creada con éxito');
				Utils.gotoAnyPartOfPage('topPageCreateTask');
				getZones({
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
		});
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

	getZones({
		success: true,
		detail: 'OK'
	});

});