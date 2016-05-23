'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('StoresCtrl', function($scope, $log, $modal, $filter, ngTableParams, Stores) {

	$scope.page = {
		title: 'Zonas'
	};

	$scope.stores = [];

	$scope.getStores = function() {

		$scope.stores = [];

		Stores.query({}, function(success) {

			$log.log(success);

			for (var i = 0; i < success.data.length; i++) {
				$scope.stores.push({
					name: success.data[i].attributes.name
				});
			}

			$log.log($scope.stores);

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

		var modalInstance = $modal.open({
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
			$scope.getDealers();
		}, function() {});
	};

	$scope.getStores();

})

.controller('CreateStoreModalInstance', function($scope, $log, $modalInstance, idStore, Stores, Dealers, Zones, Validators) {

	$scope.modal = {
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		alert: {
			color: '',
			show: false,
			title: '',
			text: ''
		},
		store: {
			name: {
				text: '',
				disabled: true
			},
			contact: {
				text: '',
				disabled: true
			},
			phone: {
				text: '',
				disabled: true
			},
			address: {
				text: '',
				disabled: true
			},
			montlyGoalClp: {
				text: '',
				disabled: true
			},
			montlyGoalUsd: {
				text: '',
				disabled: true
			},
			disabled: true,
			zonesIds: []
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

				if (idStore) {
					getStoreDetails(idStore);
				}

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

				// if (idStore) {
				// 	getStoreDetails(idStore);
				// }

			}
			// $log.log(success);
		}, function(error) {
			$log.log(error);
		});

	};

	var getStoreDetails = function(idStore) {
		Dealers.query({
			dealerId: idStore
		}, function(success) {
			// $log.log(success);
			if (success.data) {
				$scope.modal.dealer.name.text = success.data.attributes.name;
				$scope.modal.dealer.contact.text = success.data.attributes.contact;
				$scope.modal.dealer.phone.text = success.data.attributes.phone_number;
				$scope.modal.dealer.address.text = success.data.attributes.address;

				$scope.modal.dealer.zonesIds = success.data.attributes.zone_ids;
				selectZones();
			} else {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la dealer';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;
				$log.log(success);
			}
		}, function(error) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la dealer';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
			$log.log(error);
		});
	};

	var selectZones = function() {
		for (i = 0; i < $scope.modal.dealer.zonesIds.length; i++) {
			for (j = 0; j < $scope.modal.zones.zones.length; j++) {
				if ($scope.modal.dealer.zonesIds[i] === parseInt($scope.modal.zones.zones[j].id)) {
					$scope.modal.zones.selectedZones.push({
						id: $scope.modal.zones.zones[j].id,
						name: $scope.modal.zones.zones[j].name,
						type: 'zones'
					});
				}
			}
		}
	};

	$scope.createDealer = function() {

		if (!Validators.validaRequiredField($scope.modal.dealer.name.text)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un nombre para el dealer';
			$scope.modal.alert.show = true;

			return;
		}

		// if (!Validators.validaRequiredField($scope.modal.dealer.contact.text)) {
		// 	$scope.modal.alert.color = 'danger';
		// 	$scope.modal.alert.title = 'Faltan datos';
		// 	$scope.modal.alert.text = 'Debe indicar un email de contacto para el dealer';
		// 	$scope.modal.alert.show = true;

		// 	return;
		// }

		// if (!Validators.validaRequiredField($scope.modal.dealer.phone.text)) {
		// 	$scope.modal.alert.color = 'danger';
		// 	$scope.modal.alert.title = 'Faltan datos';
		// 	$scope.modal.alert.text = 'Debe indicar un teléfono de contacto para el dealer';
		// 	$scope.modal.alert.show = true;

		// 	return;
		// }

		// if (!Validators.validaRequiredField($scope.modal.dealer.address.text)) {
		// 	$scope.modal.alert.color = 'danger';
		// 	$scope.modal.alert.title = 'Faltan datos';
		// 	$scope.modal.alert.text = 'Debe indicar una dirección para el dealer';
		// 	$scope.modal.alert.show = true;

		// 	return;
		// }

		if ($scope.modal.zones.selectedZones.length === 0) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar al menos una zona para el dealer';
			$scope.modal.alert.show = true;

			return;
		}

		var zones = [];
		// var dealerName = $scope.modal.dealer.name;

		for (var i = 0; i < $scope.modal.zones.selectedZones.length; i++) {
			zones.push({
				type: $scope.modal.zones.selectedZones[i].type,
				id: $scope.modal.zones.selectedZones[i].id
			});
		}

		Dealers.save({
			data: {
				type: "dealers",
				attributes: {
					name: $scope.modal.dealer.name.text,
					contact: $scope.modal.dealer.contact.text,
					phone_number: $scope.modal.dealer.phone.text,
					address: $scope.modal.dealer.address.text
				},
				relationships: {
					zones: {
						data: zones
					}
				}
			}
		}, function(success) {
			$modalInstance.close();
		}, function(error) {

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'No se ha podido crear el dealer';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;

			$log.log(error);
		});

	};

	$scope.editDealer = function() {

		if ($scope.modal.buttons.edit.text === 'Editar') {
			$scope.modal.buttons.edit.text = 'Si, Editar';
			$scope.modal.buttons.edit.border = false;
			$scope.modal.dealer.name.disabled = false;
			$scope.modal.dealer.contact.disabled = false;
			$scope.modal.dealer.phone.disabled = false;
			$scope.modal.dealer.address.disabled = false;
			$scope.modal.zones.disabled = false;

			$scope.modal.alert.color = 'warning';
			$scope.modal.alert.title = 'Para efectuar la edición, presione nuevamente el botón';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.edit.text = 'Editar';
			$scope.modal.dealer.name.disabled = true;
			$scope.modal.dealer.contact.disabled = true;
			$scope.modal.dealer.phone.disabled = true;
			$scope.modal.dealer.address.disabled = true;
			$scope.modal.zones.disabled = true;

			if (!Validators.validaRequiredField($scope.modal.dealer.name)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un nombre para la dealer';
				$scope.modal.alert.show = true;

				return;
			}

			if ($scope.modal.zones.selectedZones.length === 0) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar al menos una dealer para el dealer';
				$scope.modal.alert.show = true;

				return;
			}

			var zones = [];

			for (var i = 0; i < $scope.modal.zones.selectedZones.length; i++) {
				zones.push({
					type: $scope.modal.zones.selectedZones[i].type,
					id: $scope.modal.zones.selectedZones[i].id
				});
			}

			Dealers.update({
				dealerId: idStore,
				data: {
					type: "dealers",
					id: idStore,
					attributes: {
						name: $scope.modal.dealer.name.text,
						contact: $scope.modal.dealer.contact.text,
						phone_number: $scope.modal.dealer.phone.text,
						address: $scope.modal.dealer.address.text
					},
					relationships: {
						zones: {
							data: zones
						}
					}
				}
			}, function(success) {
				// $log.log(success);
				$modalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido crear el dealer';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
			});
		}

		if (!Validators.validaRequiredField($scope.modal.dealer.name)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un nombre para el dealer';
			$scope.modal.alert.show = true;

			return;
		}

	};

	$scope.deleteDealer = function() {

		if ($scope.modal.buttons.delete.text === 'Eliminar') {
			$scope.modal.buttons.delete.text = 'Si, Eliminar';
			$scope.modal.buttons.delete.border = false;

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = '¿Seguro que desea eliminar la dealer?';
			$scope.modal.alert.text = 'Para eliminarla, vuelva a presionar el botón';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.delete.text = 'Eliminar';

			Dealers.delete({
				dealerId: idStore
			}, function(success) {
				$modalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido borrar la dealer';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
			});
		}

	};

	$scope.ok = function() {
		// $modalInstance.close($scope.selected.item);
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.text = '';
		$scope.modal.alert.show = false;
	};

	getZones();

	if (idStore) {
		$scope.modal.title.text = 'Información dealer';
		$scope.modal.subtitle.text = '';
		$scope.modal.buttons.create.show = false;
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.delete.show = true;

		$scope.modal.buttons.edit.border = true;
		$scope.modal.buttons.create.border = true;
		$scope.modal.buttons.delete.border = true;

		$scope.modal.dealer.name.disabled = true;
		$scope.modal.dealer.contact.disabled = true;
		$scope.modal.dealer.phone.disabled = true;
		$scope.modal.dealer.address.disabled = true;
		$scope.modal.zones.disabled = true;

	} else {
		$scope.modal.title.text = 'Crear dealer';
		$scope.modal.buttons.create.show = true;
		$scope.modal.buttons.edit.show = false;
		$scope.modal.buttons.delete.show = false;

		$scope.modal.dealer.name.disabled = false;
		$scope.modal.dealer.contact.disabled = false;
		$scope.modal.dealer.phone.disabled = false;
		$scope.modal.dealer.address.disabled = false;
		$scope.modal.zones.disabled = false;
	}

});