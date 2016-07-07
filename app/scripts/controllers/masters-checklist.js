'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ChecklistCtrl
 * @description
 * # ChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, ngTableParams, Checklists, Utils) {

	$scope.page = {
		title: 'Checklists'
	};

	$scope.checklists = [];

	$scope.getChecklists = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.checklists = [];

		Checklists.query({
			'filter[type]': 'Checklist'
		}, function(success) {

			for (var i = 0; i < success.data.length; i++) {
				$scope.checklists.push({
					id: success.data[i].id,
					name: success.data[i].attributes.name
				});
			}

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: 25, // count per page
				filter: {
					//name: 'M'       // initial filter
				},
				sorting: {
					name: 'desc' // initial sorting
				}
			}, {
				total: $scope.checklists.length, // length of $scope.checklists
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
						$filter('filter')($scope.checklists, params.filter()) :
						$scope.checklists;
					var orderedData = params.sorting() ?
						$filter('orderBy')(filteredData, params.orderBy()) :
						$scope.checklists;

					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getChecklists);
			}
		});

	};

	$scope.openModalDeleteChecklist = function(idChecklist) {

		// var idChecklist = idChecklist;

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageListChecklist.html',
			controller: 'MessageListChecklistModalInstance',
			resolve: {
				idChecklist: function() {
					return idChecklist;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getChecklists({
				success: true,
				detail: 'OK'
			});
		}, function() {});
	};

	$scope.gotoNewChecklist = function(idChecklist) {
		$state.go('app.masters.new-checklist', {
			idChecklist: idChecklist
		});
	};

	$scope.getChecklists({
		success: true,
		detail: 'OK'
	});

})

.controller('MessageListChecklistModalInstance', function($scope, $log, $uibModalInstance, idChecklist, ChecklistActions, Validators, Utils) {

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
		buttons: {
			delete: {
				border: false,
				show: true,
				text: 'Eliminar'
			}
		}
	};

	$scope.deleteChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.delete({
			idChecklist: idChecklist
		}, function(success) {
			$log.log(success);
			$uibModalInstance.close();
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.deleteChecklist);
			}
		});

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

});