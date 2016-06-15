'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CreateTaskCtrl
 * @description
 * # CreateTaskCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('CreateTaskCtrl', function($scope, $log, Utils, Zones, Dealers, Stores, Users, ReportTypes, Reports) {

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

	$scope.createTask = function() {
		Reports.save({

		}, function(success) {
			$log.log(success);
			if (success.data) {

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});
	};

	getUsers();
});