'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ZonesCtrl
 * @description
 * # ZonesCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ZonesCtrl', function($scope, $log, $modal, $filter, ngTableParams, Zones) {

	$scope.page = {
		title: 'Zonas'
	};

	$scope.zones = [];

	$scope.getZones = function() {

		$scope.zones = [];

		Zones.query({

		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.zones.push({
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
					total: $scope.zones.length, // length of zones
					getData: function($defer, params) {
						var filteredData = params.filter() ?
							$filter('filter')($scope.zones, params.filter()) :
							$scope.zones;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.zones;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});
			} else {
				$log.log(success);
			}

		}, function(error) {
			$log.log(error);
		});

	};

	$scope.openModalCreateZone = function(idZone) {

		// var idZone = idZone;

		var modalInstance = $modal.open({
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
			$scope.getZones();
		}, function() {});
	};

	$scope.getZones();

})

.controller('CreateZoneModalInstance', function($scope, $log, $modalInstance, idZone, Dealers, Zones, Validators) {

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

	var getDealers = function() {

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
					getZoneDetails(idZone);
				}

			}
			// $log.log(success);
		}, function(error) {
			$log.log(error);
		});

	};

	var getZoneDetails = function(idZone) {
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

	$scope.createZone = function() {

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
			$modalInstance.close();
		}, function(error) {

			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'No se ha podido crear la zona';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;

			$log.log(error);
		});

	};

	$scope.editZone = function() {

		if ($scope.modal.buttons.edit.text === 'Editar') {
			$scope.modal.buttons.edit.text = 'Si, Editar';
			$scope.modal.buttons.edit.border = false;
			$scope.modal.zone.disabled = false;
			$scope.modal.dealers.disabled = false;

			$scope.modal.alert.color = 'warning';
			$scope.modal.alert.title = 'Para efectuar la edición, presione nuevamente el botón';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
		} else {
			$scope.modal.buttons.edit.text = 'Editar';
			$scope.modal.buttons.edit.border = true;
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
				$modalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido crear la zona';
				$scope.modal.alert.text = '';
				$scope.modal.alert.show = true;

				$log.log(error);
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

	$scope.deleteZone = function() {

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
				$modalInstance.close();
			}, function(error) {

				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'No se ha podido borrar la zona';
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

	getDealers();

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