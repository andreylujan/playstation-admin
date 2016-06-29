'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MonthlyGoalsCtrl
 * @description
 * # MonthlyGoalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('MonthlyGoalsCtrl', function($scope, $log, $uibModal, $filter, ngTableParams) {

	$scope.page = {
		title: 'Metas mensuales'
	};

	$scope.openModalNewMonthlyGoal = function(idMonthlyGoal) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'newMonthlyGoal.html',
			controller: 'NewMonthlyGoalModalInstance',
			resolve: {
				idMonthlyGoal: function() {
					return idMonthlyGoal;
				}
			}
		});

		modalInstance.result.then(function() {
			// $scope.getStockBreaks();
		}, function() {
			// $scope.getStockBreaks();
		});
	};


})

.controller('NewMonthlyGoalModalInstance', function($scope, $log, $uibModalInstance, $uibModal, idMonthlyGoal) {

	$scope.modal = {
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		alert: {
			show: false,
			title: '',
			text: '',
			color: ''
		},
		monthlyGoal: {
			date: {
				value: new Date()
			},
			goal: {
				value: null
			},
			file: {
				value: null
			}
		},
		datepicker: {
			opened: false
		},
		buttons: {
			create: {
				text: 'Guardar',
				show: false,
				border: false
			},
			edit: {
				text: 'Editar',
				show: false,
				border: false
			},
			delete: {
				text: 'Eliminar',
				show: false,
				border: false
			}
		}
	};

	var i = 0,
		j = 0;

	$scope.openDatePicker = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.modal.datepicker.opened = !$scope.modal.datepicker.opened;
	};

	var openModalSummaryLoadMonthlyGoal = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summaryLoadMonthlyGoal.html',
			controller: 'SummaryLoadMonthlyGoalModalInstance',
			resolve: {}
		});

		modalInstance.result.then(function() {
			// $scope.getStockBreaks();
		}, function() {
			// $scope.getStockBreaks();
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

	$scope.createMonthlyGoal = function() {
		$log.log($scope.modal.monthlyGoal.date.value);
		$log.log($scope.modal.monthlyGoal.file.value.filetype);
		$log.log($scope.modal.monthlyGoal.file.value.base64);

		openModalSummaryLoadMonthlyGoal();
	};

	if (idMonthlyGoal) {
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.delete.show = true;
	} else {
		$scope.modal.buttons.create.show = true;
	}

})

.controller('SummaryLoadMonthlyGoalModalInstance', function($scope, $log, $uibModalInstance) {

	$scope.modal = {
		title: {
			text: 'Resumen carga de metas mensuales'
		},
		subtitle: {
			text: ''
		},
		alert: {
			show: false,
			title: '',
			text: '',
			color: ''
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

});