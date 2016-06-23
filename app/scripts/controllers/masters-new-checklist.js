'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewChecklistCtrl
 * @description
 * # NewChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, $window, ngTableParams, Checklists, ChecklistActions) {

	var idChecklist = $state.params.idChecklist;

	$scope.page = {
		title: '',
		buttons: {
			oneMoreItem: {
				disabled: false
			}
		}
	};

	$scope.checklist = {
		id: idChecklist,
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

		$scope.checklist.items = [];

		Checklists.query({
			idChecklist: idChecklist
		}, function(success) {
			// $log.log(success);

			if (success.data) {

				$scope.checklist.name = success.data.attributes.name;

				for (i = 0; i < success.data.attributes.children.length; i++) {
					$scope.checklist.items.push({
						id: success.data.attributes.children[i].id,
						name: success.data.attributes.children[i].name,
						position: parseInt(success.data.attributes.children[i].position),
						options: success.data.attributes.children[i].data.option_ids,
						option: null,
						required: success.data.attributes.children[i].required
					});
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
			required: false,
			position: 0,
			data: {
				option_ids: []
			},
			options: [],
			option: null,
		});

		$scope.page.buttons.oneMoreItem.disabled = true;

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
		children = [];

		for (i = 0; i < $scope.checklist.items.length; i++) {
			if ($scope.checklist.items[i].id) {
				children.push({
					id: $scope.checklist.items[i].id,
					name: $scope.checklist.items[i].name,
					required: $scope.checklist.items[i].required,
					position: $scope.checklist.items[i].position
				});
			} else {
				children.push({
					id: null,
					name: $scope.checklist.items[i].name,
					required: $scope.checklist.items[i].required,
					position: $scope.checklist.items[i].position,
					data: {
						option_ids: []
							// option_ids: [$scope.checklist.items[i].option.id]
					}
				});
			}
		}

		$log.log(children);
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
				infoChecklist: function() {
					return $scope.checklist;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getInfoChecklist();
			$scope.page.buttons.oneMoreItem.disabled = false;
		}, function() {
			$scope.getInfoChecklist();
		});
	};

	var updateChecklist = function() {
		prepareChecklistToSend();

		// $log.log(children);

		ChecklistActions.update({
			idChecklist: idChecklist,
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: $scope.checklist.name,
					children: children
				}
			}
		}, function(success) {
			if (success.data) {
				$log.log(success);
				$state.go('app.masters.checklist');
			} else {
				$window.alert('Error al actualizar el checklist');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al actualizar el checklist');
			$log.error(error);
		});
	};

	$scope.updateOrCreateChecklist = function() {
		if (idChecklist) {
			updateChecklist();
		} else {
			$scope.createChecklist();
		}
	};

	getChecklistOptions();

})

.controller('addItemOptionsModalInstance', function($scope, $log, $uibModalInstance, $window, idItem, Checklists, ChecklistActions, infoChecklist) {

	$log.log(infoChecklist);

	$scope.modal = {
		checklistOptions: [],
		selectedOption: null,
		options: []
	};

	var i = 0,
		j = 0,
		k = 0,
		children = [];

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
				$scope.getInfoChecklist();
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	$scope.getInfoChecklist = function() {
		if (infoChecklist.id) {
			Checklists.query({
				idChecklist: infoChecklist.id
			}, function(success) {
				if (success.data) {

					for (i = 0; i < success.data.attributes.children.length; i++) {
						if (success.data.attributes.children[i].id === idItem) {
							for (j = 0; j < success.data.attributes.children[i].data.option_ids.length; j++) {
								$scope.modal.options.push({
									id: success.data.attributes.children[i].data.option_ids[j],
									selected: null
								});
							}
						}
					}

					for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
						for (j = 0; j < $scope.modal.options.length; j++) {
							if (parseInt($scope.modal.checklistOptions[i].id) === parseInt($scope.modal.options[j].id)) {
								$scope.modal.options[j].selected = $scope.modal.checklistOptions[i];
								break;
							}
						}
					}

				} else {
					$log.error(success);
				}

			}, function(error) {
				$log.error(error);
			});
		}
	};

	$scope.generateOption = function() {
		if ($scope.modal.checklistOptions[0]) {
			$scope.modal.options.push({
				id: $scope.modal.checklistOptions[0].id,
				selected: $scope.modal.checklistOptions[0]
			});
		} else {
			$scope.modal.options.push({
				id: null,
				selected: null
			});
		}
	};

	$scope.addChecklistOptions = function() {

		children = [];

		for (i = 0; i < infoChecklist.items.length; i++) {
			children.push({
				id: infoChecklist.items[i].id,
				name: infoChecklist.items[i].name,
				data: {
					option_ids: infoChecklist.items[i].options
				},
				required: infoChecklist.items[i].required
			});
		}

		for (i = 0; i < children.length; i++) {
			if (children[i].id && idItem) {
				if (children[i].id === idItem) {
					for (j = 0; j < $scope.modal.options.length; j++) {
						children[i].data.option_ids.push(parseInt($scope.modal.options[j].selected.id));
					}
				}
			} else {
				for (j = 0; j < $scope.modal.options.length; j++) {
					children[i].data.option_ids.push(parseInt($scope.modal.options[j].selected.id));
				}
			}
			children[i].data.option_ids = _.uniq(children[i].data.option_ids);
		}


		ChecklistActions.update({
			idChecklist: infoChecklist.id,
			data: {
				type: 'checklists',
				id: infoChecklist.id,
				attributes: {
					name: infoChecklist.id.name,
					children: children
				}
			}
		}, function(success) {
			if (success.data) {
				$log.log(success);
				$uibModalInstance.close();
			} else {
				$window.alert('Error al asiginar las opciones');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al asiginar las opciones');
			$log.error(error);
		});
	};

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

	getChecklistOptions();

	if (idItem) {

	} else {
		$scope.generateOption();
	}

});