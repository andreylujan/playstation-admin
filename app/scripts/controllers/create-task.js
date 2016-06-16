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
	var currentPage = 0;
	var pageSize = 30;

	$scope.openDatepicker = function() {
		$scope.page.dateOptions.datepickerOpened = true;
	};

	var getUsers = function() {

		$scope.page.newTask.users.list = [];

		Users.query({}, function(success) {
			// $log.log(success);
			if (success.data) {
				getReportTypes();
				for (var i = 0; i < success.data.length; i++) {
					if (success.data[i].attributes.active) {
						$scope.page.newTask.users.list.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}
				$scope.page.newTask.users.selectedUser = $scope.page.newTask.users.list[0];
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
		});
	};

	var getReportTypes = function() {

		$scope.page.newTask.reportTypes.list = [];

		ReportTypes.query({
			idOrganization: 1
		}, function(success) {
			// $log.log(success);
			if (success.data) {
				getZones();
				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.reportTypes.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}
				$scope.page.newTask.reportTypes.selectedReportType = $scope.page.newTask.reportTypes.list[0];
			} else {
				$log.success(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	var getZones = function() {

		$scope.page.newTask.zones.list = [];

		Zones.query({}, function(success) {
			if (success.data) {
				// $log.log(success);
				getDealers();
				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.zones.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}
				$scope.page.newTask.zones.selectedZone = $scope.page.newTask.zones.list[0];
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	var getDealers = function() {

		$scope.page.newTask.dealers.list = [];

		Dealers.query({}, function(success) {
			if (success.data) {
				// $log.log(success);
				getStores();
				for (var i = 0; i < success.data.length; i++) {
					$scope.page.newTask.dealers.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name
					});
				}
				$scope.page.newTask.dealers.selectedDealer = $scope.page.newTask.dealers.list[0];
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	var getStores = function() {

		$scope.page.newTask.stores.list = [];

		Stores.query({}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
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

	$scope.createTask = function() {

		if (!validateForm()) {
			Utils.gotoAnyPartOfPage('topPageCreateTask');
			return;
		}

		Reports.save({
			dynamic_attributes: {
				sections: [{
					id: 1,
					data_section: [{
						map_location: {}
					}, {
						zone_location: {
							zone: $scope.page.newTask.zones.selectedZone.id,
							dealer: $scope.page.newTask.dealers.selectedDealer.id,
							store: $scope.page.newTask.stores.selectedStore.id
						}
					}, {
						address_location: {}
					}]
				}]
			},
			report_type_id: $scope.page.newTask.reportTypes.selectedReportType.id,
			assigned_user_id: $scope.page.newTask.users.selectedUser.id,
			limit_date: $scope.page.newTask.limitDate.toISOString()
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
		});
	};

	getUsers();
});