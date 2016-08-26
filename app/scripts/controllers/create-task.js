'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CreateTaskCtrl
 * @description
 * # CreateTaskCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('CreateTaskCtrl', function($scope, $log, Utils, Zones, Dealers, Stores, Users, ReportTypes, Reports, Validators) {

	$scope.page = {
		title: 'Crear tarea',
		prevBtn: {
			disabled: true
		},
		newTask: {
			users: {
				list: [],
				selectedUser: null
			},
			reportTypes: {
				list: [],
				selectedReportType: null
			},
			zones: {
				list: [],
				selectZone: null
			},
			dealers: {
				list: [],
				selectedDealer: null
			},
			stores: {
				list: [],
				selectedStore: null
			},
			limitDate: new Date()
		},
		dateOptions: {
			formatYear: 'yy',
			startingDay: 1,
			class: 'datepicker',
			format: 'dd-MMMM-yyyy',
			datepickerOpened: false,
			minDate: new Date()
		},
		alert: {
			color: null,
			show: false,
			title: null,
			text: null
		}
	};

	var i, j;
	var currentPage = 0,
		pageSize = 30,
		storesIncluded = [];

	$scope.openDatepicker = function() {
		$scope.page.dateOptions.datepickerOpened = true;
	};

	var getUsers = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.newTask.users.list = [];

		Users.query({}, function(success) {
			// $log.log(success);
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					if (success.data[i].attributes.active) {
						$scope.page.newTask.users.list.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}
				$scope.page.newTask.users.selectedUser = $scope.page.newTask.users.list[0];

				getReportTypes({
					success: true,
					detail: 'OK'
				});

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
		});
	};

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

		Zones.query({}, function(success) {
			if (success.data) {
				// $log.log(success);

				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.zones.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name,
						dealersIds: success.data[i].attributes.dealer_ids
					});
				}
				$scope.page.newTask.zones.selectedZone = $scope.page.newTask.zones.list[0];

				$scope.getDealers({
					success: true,
					detail: 'OK'
				});

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

	$scope.getDealers = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.newTask.dealers.list = [];

		Dealers.query({
			include: 'stores'
		}, function(success) {
			if (success.data && success.included) {

				storesIncluded = success.included;

				for (j = 0; j < $scope.page.newTask.zones.selectedZone.dealersIds.length; j++) {
					for (var i = 0; i < success.data.length; i++) {
						if ($scope.page.newTask.zones.selectedZone.dealersIds[j] === parseInt(success.data[i].id)) {
							$scope.page.newTask.dealers.list.push({
								id: parseInt(success.data[i].id),
								name: success.data[i].attributes.name,
								storesIds: success.data[i].relationships.stores.data
							});
							break;
						}
					}
				}

				$scope.page.newTask.dealers.selectedDealer = $scope.page.newTask.dealers.list[0];

				$scope.getStores({
					success: true,
					detail: 'OK'
				});

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

	$scope.getStores = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.newTask.stores.list = [];

		Stores.query({
			'filter[zone_id]': $scope.page.newTask.zones.selectedZone.id,
			'filter[dealer_id]': $scope.page.newTask.dealers.selectedDealer.id
		}, function(success) {
			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.page.newTask.stores.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}

				$scope.page.newTask.stores.selectedStore = $scope.page.newTask.stores.list[0];

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

	$scope.setAlertProperties = function(show, color, title, text) {
		$scope.page.alert.color = color;
		$scope.page.alert.show = show;
		$scope.page.alert.title = title;
		$scope.page.alert.text = text;
	};

	var validateForm = function() {
		if (!Validators.validaRequiredField($scope.page.newTask.users.selectedUser)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar un usuario');
			return false;
		}
		if (!Validators.validaRequiredField($scope.page.newTask.limitDate)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar una fecha límite');
			return false;
		}
		if (!Validators.validaRequiredField($scope.page.newTask.reportTypes.selectedReportType)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar un tipo de reporte');
			return false;
		}
		if (!Validators.validaRequiredField($scope.page.newTask.zones.selectedZone)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar una zona');
			return false;
		}
		if (!Validators.validaRequiredField($scope.page.newTask.dealers.selectedDealer)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar un dealer');
			return false;
		}
		if (!Validators.validaRequiredField($scope.page.newTask.stores.selectedStore)) {
			$scope.setAlertProperties(true, 'danger', 'Faltan campos', 'Debe indicar una tienda');
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

		if (!validateForm()) {
			Utils.gotoAnyPartOfPage('topPageCreateTask');
			return;
		}

		var limitDate = new Date($scope.page.newTask.limitDate);
		// limitDate.setHours(0,0,0,0);

		Reports.save({
			dynamic_attributes: {
				sections: [{
					id: 1,
					data_section: [{
						map_location: {}
					}, {
						zone_location: {
							zone: $scope.page.newTask.zones.selectedZone.id,
							name_zone: $scope.page.newTask.zones.selectedZone.name,
							dealer: $scope.page.newTask.dealers.selectedDealer.id,
							name_dealer: $scope.page.newTask.dealers.selectedDealer.name,
							store: $scope.page.newTask.stores.selectedStore.id,
							name_store: $scope.page.newTask.stores.selectedStore.name
						}
					}, {
						address_location: {}
					}]
				}]
			},
			report_type_id: $scope.page.newTask.reportTypes.selectedReportType.id,
			assigned_user_id: $scope.page.newTask.users.selectedUser.id,
			limit_date: limitDate.toISOString()
		}, function(success) {
			$log.log(success);
			if (success.data) {
				$scope.setAlertProperties(true, 'success', 'Tarea creada', 'Tarea creada con éxito');
				Utils.gotoAnyPartOfPage('topPageCreateTask');
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

	getUsers({
		success: true,
		detail: 'OK'
	});
});