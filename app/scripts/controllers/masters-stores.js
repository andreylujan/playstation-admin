'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('StoresCtrl', function($scope, $log, $uibModal, $filter, ngTableParams, Stores) {

	$scope.page = {
		title: 'Tiendas'
	};

	$scope.stores = [];

	$scope.getStores = function() {

		$scope.stores = [];

		Stores.query({}, function(success) {

			// $log.log(success);

			for (var i = 0; i < success.data.length; i++) {
				$scope.stores.push({
					id: success.data[i].id,
					name: success.data[i].attributes.name
				});
			}

			// $log.log($scope.stores);

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: 10, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: $scope.stores.length, // length of stores
				getData: function($defer, params) {
					// use build-in angular filter
					var orderedData = params.sorting() ?
						$filter('orderBy')($scope.stores, params.orderBy()) :
						$scope.stores;

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}, function(error) {
			$log.log(error);
		});

	};

	$scope.openModalCreateStore = function(idStore) {

		// var idStore = idStore;

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'createStore.html',
			controller: 'CreateStoreModalInstance',
			resolve: {
				idStore: function() {
					return idStore;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getStores();
		}, function() {});
	};

	$scope.getStores();

})

.controller('CreateStoreModalInstance', function($scope, $log, $uibModalInstance, idStore, Stores, Dealers, Zones, Validators) {

	$scope.modal = {
		title: {
			text: null
		},
		subtitle: {
			text: null
		},
		alert: {
			color: '',
			show: false,
			title: '',
			text: null
		},
		store: {
			name: {
				text: null,
				disabled: true
			},
			contact: {
				text: null,
				disabled: true
			},
			phone: {
				text: null,
				disabled: true
			},
			address: {
				text: null,
				disabled: true
			},
			montlyGoalClp: {
				text: null,
				disabled: true
			},
			montlyGoalUsd: {
				text: null,
				disabled: true
			},
			disabled: true,
			zoneId: null,
			dealerId: null
		},
		zones: {
			selectedZones: [],
			zones: [],
			disabled: true
		},
		dealers: {
			selectedDealers: [],
			dealers: [],
			disabled: true
		},
		buttons: {
			edit: {
				border: false,
				show: false,
				text: 'Editar'
			},
			create: {
				border: false,
				show: false,
				text: 'Guardar'
			},
			delete: {
				border: true,
				show: false,
				text: 'Eliminar'
			}
		}
	};

	var i = 0,
		j = 0;

	var getZones = function() {

		Zones.query({}, function(success) {
			// $log.log(success);

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.modal.zones.zones.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						type: 'zones'
					});
				}

				getDealers();

			}
			// $log.log(success);
		}, function(error) {
			$log.log(error);
		});

	};

	var getDealers = function() {

		Dealers.query({}, function(success) {
			// $log.log(success);

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.modal.dealers.dealers.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						type: 'dealers'
					});
				}

				if (idStore) {
					getStoreDetails(idStore);
				}

			}
			// $log.log(success);
		}, function(error) {
			$log.log(error);
		});

	};

	var getStoreDetails = function(idStore) {
		Stores.query({
			storeId: idStore
		}, function(success) {
			// $log.log(success);
			if (success.data) {
				$scope.modal.store.name.text = success.data.attributes.name;
				$scope.modal.store.contact.text = success.data.attributes.contact;
				$scope.modal.store.phone.text = success.data.attributes.phone_number;
				$scope.modal.store.address.text = success.data.attributes.address;
				$scope.modal.store.zoneId = success.data.attributes.zone_id;
				$scope.modal.store.dealerId = success.data.attributes.dealer_id;
				$scope.modal.store.montlyGoalClp.text = success.data.attributes.monthly_goal_clp;
				$scope.modal.store.montlyGoalUsd.text = success.data.attributes.monthly_goal_usd;


				selectZones();
				selectDealers();
			} else {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la tienda';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;
				$log.log(success);
			}
		}, function(error) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la tienda';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
			$log.log(error);
		});
	};

	var selectZones = function() {
		for (i = 0; i < $scope.modal.zones.zones.length; i++) {
			if (parseInt($scope.modal.zones.zones[i].id) === parseInt($scope.modal.store.zoneId)) {
				$scope.modal.zones.selectedZones.id = $scope.modal.zones.zones[i].id;
				$scope.modal.zones.selectedZones.name = $scope.modal.zones.zones[i].name;
				$scope.modal.zones.selectedZones.type = $scope.modal.zones.zones[i].type;
				break;
			}
		}
	};

	var selectDealers = function() {
		for (i = 0; i < $scope.modal.dealers.dealers.length; i++) {
			if (parseInt($scope.modal.dealers.dealers[i].id) === parseInt($scope.modal.store.dealerId)) {
				$scope.modal.dealers.selectedDealers.id = $scope.modal.dealers.dealers[i].id;
				$scope.modal.dealers.selectedDealers.name = $scope.modal.dealers.dealers[i].name;
				$scope.modal.dealers.selectedDealers.type = $scope.modal.dealers.dealers[i].type;
				break;
			}
		}
	};

	$scope.createStore = function() {

		if (!Validators.validaRequiredField($scope.modal.store.name.text)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un nombre para la tienda';
			$scope.modal.alert.show = true;
			return;
		}

		if ($scope.modal.zones.selectedZones.length === 0) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar una zona para la tienda';
			$scope.modal.alert.show = true;
			return;
		}

		if ($scope.modal.dealers.selectedDealers.length === 0) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un dealer para la tienda';
			$scope.modal.alert.show = true;
			return;
		}

		var zone = {
			type: $scope.modal.zones.selectedZones.type,
			id: $scope.modal.zones.selectedZones.id
		};
		var dealer = {
			type: $scope.modal.dealers.selectedDealers.type,
			id: $scope.modal.dealers.selectedDealers.id
		};

		Stores.save({
			data: {
				type: "stores",
				attributes: {
					name: $scope.modal.store.name.text,
					contact: $scope.modal.store.contact.text,
					phone_number: $scope.modal.store.phone.text,
					address: $scope.modal.store.address.text,
					monthly_goal_clp: $scope.modal.store.montlyGoalClp.text,
					monthly_goal_usd: $scope.modal.store.montlyGoalUsd.text
				},
				relationships: {
					zone: {
						data: zone
					},
					dealer: {
						data: dealer
					}
				}
			}
		}, function(success) {
			$uibModalInstance.close();
		}, function(error) {

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'No se ha podido crear la tienda';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;

			$log.log(error);
		});

	};

	$scope.editStore = function() {

		if ($scope.modal.buttons.edit.text === 'Editar') {
			$scope.modal.buttons.edit.text = 'Si, Editar';
			$scope.modal.buttons.edit.border = false;
			$scope.modal.store.name.disabled = false;
			$scope.modal.store.contact.disabled = false;
			$scope.modal.store.phone.disabled = false;
			$scope.modal.store.address.disabled = false;
			$scope.modal.store.montlyGoalClp.disabled = false;
			$scope.modal.store.montlyGoalUsd.disabled = false;
			$scope.modal.zones.disabled = false;
			$scope.modal.dealers.disabled = false;

			$scope.modal.alert.color = 'warning';
			$scope.modal.alert.title = 'Para efectuar la edición, presione nuevamente el botón';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.edit.text = 'Editar';
			$scope.modal.store.name.disabled = true;
			$scope.modal.store.contact.disabled = true;
			$scope.modal.store.phone.disabled = true;
			$scope.modal.store.address.disabled = true;
			$scope.modal.store.montlyGoalClp.disabled = true;
			$scope.modal.store.montlyGoalUsd.disabled = true;
			$scope.modal.zones.disabled = true;
			$scope.modal.dealers.disabled = true;

			if (!Validators.validaRequiredField($scope.modal.store.name.text)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un nombre para la tienda';
				$scope.modal.alert.show = true;
				return;
			}

			if ($scope.modal.zones.selectedZones.length === 0) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar una zona para la tienda';
				$scope.modal.alert.show = true;
				return;
			}

			if ($scope.modal.dealers.selectedDealers.length === 0) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un dealer para la tienda';
				$scope.modal.alert.show = true;
				return;
			}

			var zone = {
				type: $scope.modal.zones.selectedZones.type,
				id: $scope.modal.zones.selectedZones.id
			};
			var dealer = {
				type: $scope.modal.dealers.selectedDealers.type,
				id: $scope.modal.dealers.selectedDealers.id
			};

			Stores.update({
				storeId: idStore,
				data: {
					type: "stores",
					id : idStore,
					attributes: {
						name: $scope.modal.store.name.text,
						contact: $scope.modal.store.contact.text,
						phone_number: $scope.modal.store.phone.text,
						address: $scope.modal.store.address.text,
						monthly_goal_clp: $scope.modal.store.montlyGoalClp.text,
						monthly_goal_usd: $scope.modal.store.montlyGoalUsd.text
					},
					relationships: {
						zone: {
							data: zone
						},
						dealer: {
							data: dealer
						}
					}
				}
			}, function(success) {
				// $log.log(success);
				$uibModalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido editar la tienda';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
			});
		}

	};

	$scope.deleteStore = function() {

		if ($scope.modal.buttons.delete.text === 'Eliminar') {
			$scope.modal.buttons.delete.text = 'Si, Eliminar';
			$scope.modal.buttons.delete.border = false;

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = '¿Seguro que desea eliminar la tienda?';
			$scope.modal.alert.text = 'Para eliminarla, vuelva a presionar el botón';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.delete.text = 'Eliminar';

			Stores.delete({
				storeId: idStore
			}, function(success) {
				$uibModalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido borrar la tienda';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
			});
		}

	};

	$scope.ok = function() {
		// $uibModalInstance.close($scope.selected.item);
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.text = '';
		$scope.modal.alert.show = false;
	};

	getZones();

	if (idStore) {
		$scope.modal.title.text = 'Información tienda';
		$scope.modal.subtitle.text = '';
		$scope.modal.buttons.create.show = false;
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.delete.show = true;

		$scope.modal.buttons.edit.border = true;
		$scope.modal.buttons.create.border = true;
		$scope.modal.buttons.delete.border = true;

		$scope.modal.store.name.disabled = true;
		$scope.modal.store.contact.disabled = true;
		$scope.modal.store.phone.disabled = true;
		$scope.modal.store.address.disabled = true;
		$scope.modal.store.montlyGoalClp.disabled = true;
		$scope.modal.store.montlyGoalUsd.disabled = true;
		$scope.modal.zones.disabled = true;
		$scope.modal.dealers.disabled = true;

	} else {
		$scope.modal.title.text = 'Crear tienda';
		$scope.modal.subtitle.text = '';
		$scope.modal.buttons.create.show = true;
		$scope.modal.buttons.edit.show = false;
		$scope.modal.buttons.delete.show = false;

		$scope.modal.store.name.disabled = false;
		$scope.modal.store.contact.disabled = false;
		$scope.modal.store.phone.disabled = false;
		$scope.modal.store.address.disabled = false;
		$scope.modal.store.montlyGoalClp.disabled = false;
		$scope.modal.store.montlyGoalUsd.disabled = false;
		$scope.modal.zones.disabled = false;
		$scope.modal.dealers.disabled = false;
	}

});