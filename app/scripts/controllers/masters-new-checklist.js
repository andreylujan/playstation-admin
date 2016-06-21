'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewChecklistCtrl
 * @description
 * # NewChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, ngTableParams, Checklists, ChecklistActions) {

	var idChecklist = $state.params.idChecklist;

	$scope.page = {
		title: ''
	};

	$scope.checklist = {
		name: '',
		items: [],
		option: null
	};

	$scope.checklistOptions = [];

	$scope.page.title = idChecklist ? 'Editar checklist' : 'Nuevo checklist';

	var i = 0,
		j = 0,
		k = 0,
		children = [];

	$scope.getInfoChecklist = function() {

		Checklists.query({
			idChecklist: idChecklist
		}, function(success) {
			// $log.log(success);

			if (success.data) {

				$scope.checklist.name = success.data.attributes.name;

				for (i = 0; i < success.data.attributes.children.length; i++) {
					for (j = 0; j < success.data.attributes.children[i].data.option_ids.length; j++) {
						if (true) {}
						$scope.checklist.items.push({
							id: success.data.attributes.children[i].id,
							name: success.data.attributes.children[i].name,
							position: success.data.attributes.children[i].position,
							options: [{
								id: success.data.attributes.children[i].data.option_ids[j]
							}],
							option: null,
							required: success.data.attributes.children[i].required
						});
					}
				}
				// $log.log($scope.checklist.items);
				for (i = 0; i < $scope.checklistOptions.length; i++) {
					for (j = 0; j < $scope.checklist.items.length; j++) {
						for (k = 0; k < $scope.checklist.items[j].options.length; k++) {
							if (parseInt($scope.checklist.items[j].options[k].id) === parseInt($scope.checklistOptions[i].id)) {
								$scope.checklist.items[j].option = $scope.checklistOptions[i];
								break;
							}
						}
					}
				}

			} else {
				$log.error(success);
			}

		}, function(error) {
			$log.error(error);
		});
	};

	$scope.generateItem = function() {

		$scope.checklist.items.push({
			id: null,
			name: '',
			position: '0',
			options: [],
			option: null,
			required: false
		});
	};

	var getChecklistOptions = function() {
		Checklists.query({
			'filter[type]': 'ChecklistOption',
			include: 'detail'
		}, function(success) {
			// $log.log(success);
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					$scope.checklistOptions.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});

				}

				if (idChecklist) {
					$scope.getInfoChecklist();
				} else {
					$scope.generateItem();
				}


			} else {

			}
		}, function(error) {
			$log.error(error);
		});
	};

	var prepareChecklistToSend = function() {

		for (i = 0; i < $scope.checklist.items.length; i++) {

			children.push({
				name: $scope.checklist.items[i].name,
				required: $scope.checklist.items[i].required,
				position: $scope.checklist.items[i].position,
				data: {
					option_ids: [$scope.checklist.items[i].option.id]
				}
			});

		}
	};

	$scope.createChecklist = function() {
		prepareChecklistToSend();

		$log.log($scope.checklist.items);
		$log.log($scope.checklist.name);
		$log.log(children);

		ChecklistActions.save({
			data: {
				type: 'checklists',
				attributes: {
					name: $scope.checklist.name,
					children: children
				}
			}
		}, function(success) {
			$log.log(success);
			if (success.data) {
				$log.log(success);
				$state.go('app.masters.checklist');
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	$scope.openModalAddOptions = function(idItem) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'addItemOptionsModal.html',
			controller: 'addItemOptionsModalInstance',
			resolve: {
				idItem: function() {
					return idItem;
				},
				idChecklist: function() {
					return idChecklist;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	getChecklistOptions();

})

.controller('addItemOptionsModalInstance', function($scope, $log, $uibModalInstance, idChecklist, idItem, Checklists) {

	$scope.modal = {
		checklistOptions: [],
		selectedOption: {},
		options: []
	};

	var i = 0,
		j = 0,
		k = 0;

	$scope.getInfoChecklist = function() {

		Checklists.query({
			idChecklist: idChecklist
		}, function(success) {
			if (success.data) {

				for (i = 0; i < success.data.attributes.children.length; i++) {
					for (j = 0; j < success.data.attributes.children[i].data.option_ids.length; j++) {
						$scope.checklist.items.push({
							options: [{
								id: success.data.attributes.children[i].data.option_ids[j]
							}]
						});
					}
				}

				for (i = 0; i < $scope.checklistOptions.length; i++) {
					for (j = 0; j < $scope.checklist.items.length; j++) {
						for (k = 0; k < $scope.checklist.items[j].options.length; k++) {
							if (parseInt($scope.checklist.items[j].options[k].id) === parseInt($scope.checklistOptions[i].id)) {
								$scope.checklist.items[j].option = $scope.checklistOptions[i];
								break;
							}
						}
					}
				}

			} else {
				$log.error(success);
			}

		}, function(error) {
			$log.error(error);
		});
	};

	var getChecklistOptions = function() {
		Checklists.query({
			'filter[type]': 'ChecklistOption',
			include: 'detail'
		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.checklistOptions.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	$scope.generateItem = function() {
		$scope.modal.options.push({});
	};

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	getChecklistOptions();

	if (idItem) {

	} else {
		$scope.generateItem();
	}

});

// .controller('MessageListChecklistModalInstance', function($scope, $log, $uibModalInstance, idChecklist, Checklists, Validators) {

// 	$scope.modal = {
// 		title: {
// 			text: null
// 		},
// 		subtitle: {
// 			text: null
// 		},
// 		alert: {
// 			color: '',
// 			show: false,
// 			title: '',
// 			text: null
// 		},
// 		buttons: {
// 			delete: {
// 				border: false,
// 				show: true,
// 				text: 'Eliminar'
// 			}
// 		}
// 	};

// 	$scope.deleteChecklist = function() {
// 		Checklists.delete({
// 			idChecklist: idChecklist
// 		}, function(success) {
// 			$log.log(success);
// 			if (success.data) {
// 				$uibModalInstance.close();
// 			} else {
// 				$log.error(success);
// 			}
// 		}, function(error) {
// 			$log.error(error);
// 		});

// 	};

// 	$scope.ok = function() {
// 		// $uibModalInstance.close($scope.selected.item);
// 		$uibModalInstance.close();
// 	};

// 	$scope.cancel = function() {
// 		$uibModalInstance.dismiss('cancel');
// 	};

// 	$scope.removeAlert = function() {
// 		$scope.modal.alert.color = '';
// 		$scope.modal.alert.title = '';
// 		$scope.modal.alert.text = '';
// 		$scope.modal.alert.show = false;
// 	};

// });