'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('DealersCtrl', function($scope, $log, $uibModal, $filter, ngTableParams, Dealers) {

	$scope.page = {
		title: 'Dealers'
	};

	$scope.dealers = [];

	$scope.getDealers = function() {

		$scope.dealers = [];

		Dealers.query({}, function(success) {

			for (var i = 0; i < success.data.length; i++) {
				$scope.dealers.push({
					id: success.data[i].id,
					name: success.data[i].attributes.name
				});
			}

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: 10, // count per page
				filter: {
					//name: 'M'       // initial filter
				},
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: $scope.dealers.length, // length of $scope.dealers
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
						$filter('filter')($scope.dealers, params.filter()) :
						$scope.dealers;
					var orderedData = params.sorting() ?
						$filter('orderBy')(filteredData, params.orderBy()) :
						$scope.dealers;

					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}, function(error) {
			$log.log(error);
		});

	};

	$scope.openModalCreateDealer = function(idDealer) {

		// var idDealer = idDealer;

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'createDealer.html',
			controller: 'CreateDealerModalInstance',
			resolve: {
				idDealer: function() {
					return idDealer;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getDealers();
		}, function() {});
	};

	$scope.getDealers();

})

.controller('CreateDealerModalInstance', function($scope, $log, $uibModalInstance, idDealer, Dealers, Zones, Validators) {

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
		dealer: {
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
			disabled: true,
			zonesIds: []
		},
		zones: {
			selectedZones: [],
			zones: [],
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

				if (idDealer) {
					getDealerDetails(idDealer);
				}

			}
			// $log.log(success);
		}, function(error) {
			$log.log(error);
		});

	};

	var getDealerDetails = function(idDealer) {
		Dealers.query({
			dealerId: idDealer
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
			$uibModalInstance.close();
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
				dealerId: idDealer,
				data: {
					type: "dealers",
					id: idDealer,
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
				$uibModalInstance.close();
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
				dealerId: idDealer
			}, function(success) {
				$uibModalInstance.close();
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

	if (idDealer) {
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