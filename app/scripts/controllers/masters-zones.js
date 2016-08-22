'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ZonesCtrl
 * @description
 * # ZonesCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ZonesCtrl', function($scope, $log, $uibModal, $filter, NgTableParams, Zones, Utils) {

	$scope.page = {
		title: 'Zonas'
	};

	var zones = [];

	$scope.getZones = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		zones = [];

		Zones.query({

		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					zones.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}

				$scope.tableParams = new NgTableParams({
					page: 1, // show first page
					count: 25, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: zones.length, // length of zones
					dataset: zones
				});
			} else {
				$log.log(success);
			}

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getZones);
			}
		});
	};

	$scope.openModalCreateZone = function(idZone) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'createZone.html',
			controller: 'CreateZoneModalInstance',
			resolve: {
				idZone: function() {
					return idZone;
				}
			}
		});

		modalInstance.result.then(function() {
			// al close
			$scope.getZones({
				success: true,
				detail: 'OK'
			});
		}, function() {
			// al dismiss
		});
	};

	$scope.getZones({
		success: true,
		detail: 'OK'
	});

})

.controller('CreateZoneModalInstance', function($scope, $log, $uibModalInstance, idZone, Dealers, Zones, Validators, Utils) {

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
		zone: {
			name: '',
			disabled: true,
			dealersIds: []
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

	var getDealers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Dealers.query({}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.modal.dealers.dealers.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						type: 'dealers'
					});
				}

				if (idZone) {
					getZoneDetails(idZone, {
						success: true,
						detail: 'OK'
					});
				}

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getDealers);
			}
		});

	};

	var getZoneDetails = function(idZone, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Zones.query({
			zoneId: idZone
		}, function(success) {
			if (success.data) {
				$scope.modal.zone.name = success.data.attributes.name;
				$scope.modal.zone.dealersIds = success.data.attributes.dealer_ids;
				selectDealers();
			} else {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la zona';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;
				$log.log(success);
			}
		}, function(error) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la zona';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getZoneDetails);
			}
		});
	};

	var selectDealers = function() {
		for (i = 0; i < $scope.modal.zone.dealersIds.length; i++) {
			for (var j = 0; j < $scope.modal.dealers.dealers.length; j++) {
				if ($scope.modal.zone.dealersIds[i] === parseInt($scope.modal.dealers.dealers[j].id)) {
					$scope.modal.dealers.selectedDealers.push({
						id: $scope.modal.dealers.dealers[j].id,
						name: $scope.modal.dealers.dealers[j].name,
						type: 'dealers'
					});
				}
			}
		}
	};

	$scope.createZone = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.zone.name)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un nombre para la zona';
			$scope.modal.alert.show = true;

			return;
		}

		if ($scope.modal.dealers.selectedDealers.length === 0) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar al menos un dealer para la zona';
			$scope.modal.alert.show = true;

			return;
		}

		var dealers = [];
		var zoneName = $scope.modal.zone.name;

		for (var i = 0; i < $scope.modal.dealers.selectedDealers.length; i++) {
			dealers.push({
				type: $scope.modal.dealers.selectedDealers[i].type,
				id: $scope.modal.dealers.selectedDealers[i].id
			});
		}

		Zones.save({
			data: {
				type: "zones",
				attributes: {
					name: $scope.modal.zone.name
				},
				relationships: {
					dealers: {
						data: dealers
					}
				}
			}
		}, function(success) {
			$uibModalInstance.close();
		}, function(error) {

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'No se ha podido crear la zona';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;

			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.createZone);
			}
		});
	};

	$scope.editZone = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if ($scope.modal.buttons.edit.text === 'Editar') {
			$scope.modal.buttons.edit.text = 'Guardar';
			// $scope.modal.buttons.edit.border = false;
			$scope.modal.zone.disabled = false;
			$scope.modal.dealers.disabled = false;

			$scope.modal.alert.color = 'blue-ps-1';
			$scope.modal.alert.title = 'Para efectuar la edición, presione el botón guardar';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.edit.text = 'Editar';
			// $scope.modal.buttons.edit.border = true;
			$scope.modal.zone.disabled = true;
			$scope.modal.dealers.disabled = true;

			if (!Validators.validaRequiredField($scope.modal.zone.name)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un nombre para la zona';
				$scope.modal.alert.show = true;

				return;
			}

			if ($scope.modal.dealers.selectedDealers.length === 0) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar al menos un dealer para la zona';
				$scope.modal.alert.show = true;

				return;
			}

			var dealers = [];

			for (var i = 0; i < $scope.modal.dealers.selectedDealers.length; i++) {
				dealers.push({
					type: $scope.modal.dealers.selectedDealers[i].type,
					id: $scope.modal.dealers.selectedDealers[i].id
				});
			}

			Zones.update({
				zoneId: idZone,
				data: {
					type: "zones",
					id: idZone,
					attributes: {
						name: $scope.modal.zone.name
					},
					relationships: {
						dealers: {
							data: dealers
						}
					}
				}
			}, function(success) {
				// $log.log(success);
				$uibModalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido crear la zona';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.editZone);
				}
			});
		}

		if (!Validators.validaRequiredField($scope.modal.zone.name)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un nombre para la zona';
			$scope.modal.alert.show = true;

			return;
		}
	};

	$scope.deleteZone = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if ($scope.modal.buttons.delete.text === 'Eliminar') {
			$scope.modal.buttons.delete.text = 'Si, Eliminar';
			$scope.modal.buttons.delete.border = false;

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = '¿Seguro que desea eliminar la zona?';
			$scope.modal.alert.text = 'Para eliminarla, vuelva a presionar el botón';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.delete.text = 'Eliminar';

			Zones.delete({
				zoneId: idZone
			}, function(success) {
				$uibModalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido borrar la zona';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.deleteZone);
				}
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

	getDealers({
		success: true,
		detail: 'OK'
	});

	if (idZone) {
		$scope.modal.title.text = 'Información zona';
		$scope.modal.subtitle.text = '';
		$scope.modal.buttons.create.show = false;
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.delete.show = true;

		$scope.modal.buttons.edit.border = true;
		$scope.modal.buttons.create.border = true;
		$scope.modal.buttons.delete.border = true;

		$scope.modal.zone.disabled = true;
		$scope.modal.dealers.disabled = true;

	} else {
		$scope.modal.title.text = 'Crear zona';
		$scope.modal.buttons.create.show = true;
		$scope.modal.buttons.edit.show = false;
		$scope.modal.buttons.delete.show = false;

		$scope.modal.zone.disabled = false;
		$scope.modal.dealers.disabled = false;
	}

});