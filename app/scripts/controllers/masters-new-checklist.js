'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewChecklistCtrl
 * @description
 * # NewChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, $window, Checklists, ChecklistActions, Utils) {

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

	var getChecklistOptions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		// Checklists.query({
		// 	'filter[type]': 'ChecklistOption',
		// 	include: 'detail'
		// }, function(success) {
		// 	// $log.log(success);
		// 	if (success.data) {

		// 		for (var i = 0; i < success.data.length; i++) {
		// 			$scope.checklistOptions.push({
		// 				id: success.data[i].id,
		// 				name: success.data[i].attributes.name
		// 			});
		// 		}

		// 		if (idChecklist) {
		// 			$scope.getInfoChecklist({
		// 				success: true,
		// 				detail: 'OK'
		// 			});
		// 		} else {
		// 			$scope.generateItem();
		// 		}

		// 	} else {

		// 	}
		// }, function(error) {
		// 	$log.error(error);
		// 	if (error.status === 401) {
		// 		Utils.refreshToken(getChecklistOptions);
		// 	}
		// });
	};

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.checklist.items = [];

		Checklists.query({
			idChecklist: idChecklist
		}, function(success) {
			if (success.data) {
				$scope.checklist.name = success.data.attributes.name;

				for (i = 0; i < success.data.attributes.children.length; i++) {
					$scope.checklist.items.push({
						id: success.data.attributes.children[i].id,
						name: success.data.attributes.children[i].name,
						position: parseInt(success.data.attributes.children[i].position),
						options: success.data.attributes.children[i].data.options,
						option: null,
						required: success.data.attributes.children[i].required
					});
				}

			}
		}, function(error) {
			$log.log(error);
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getInfoChecklist);
			}
		});

		// $scope.checklist.items = [];

		// Checklists.query({
		// 	idChecklist: idChecklist
		// }, function(success) {
		// 	// $log.log(success);

		// 	if (success.data) {

		// 		$scope.checklist.name = success.data.attributes.name;

		// 		for (i = 0; i < success.data.attributes.children.length; i++) {
		// 			$scope.checklist.items.push({
		// 				id: success.data.attributes.children[i].id,
		// 				name: success.data.attributes.children[i].name,
		// 				position: parseInt(success.data.attributes.children[i].position),
		// 				options: success.data.attributes.children[i].data.options,
		// 				option: null,
		// 				required: success.data.attributes.children[i].required
		// 			});
		// 		}

		// 		for (i = 0; i < $scope.checklistOptions.length; i++) {
		// 			for (j = 0; j < $scope.checklist.items.length; j++) {
		// 				for (k = 0; k < $scope.checklist.items[j].options.length; k++) {
		// 					if (parseInt($scope.checklist.items[j].options[k].id) === parseInt($scope.checklistOptions[i].id)) {
		// 						$scope.checklist.items[j].option = $scope.checklistOptions[i];
		// 						break;
		// 					}
		// 				}
		// 			}
		// 		}

		// 	} else {
		// 		$log.error(success);
		// 	}

		// }, function(error) {
		// 	$log.error(error);
		// 	if (error.status === 401) {
		// 		Utils.refreshToken($scope.getInfoChecklist);
		// 	}
		// });
	};

	$scope.generateItem = function() {

		$scope.checklist.items.push({
			id: null,
			name: '',
			required: false,
			position: 0,
			data: {
				options: []
			},
			options: [],
			option: null
		});

		$scope.page.buttons.oneMoreItem.disabled = true;
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
						options: []
							// option_ids: []
							// option_ids: [$scope.checklist.items[i].option.id]
					}
				});
			}
		}

		// $log.log(children);
	};

	$scope.createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		prepareChecklistToSend();

		// $log.log($scope.checklist.items);
		// $log.log($scope.checklist.name);
		// $log.log(children);

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
			if (error.status === 401) {
				Utils.refreshToken($scope.createChecklist);
			}
		});
	};

	$scope.openModalAddOptions = function(idItem, itemName, checklistName) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'addItemOptionsModal.html',
			controller: 'addItemOptionsModalInstance',
			resolve: {
				checklistName: function() {
					return checklistName;
				},
				idItem: function() {
					return idItem;
				},
				itemName: function() {
					return itemName;
				},
				infoChecklist: function() {
					return $scope.checklist;
				}
			}
		});

		modalInstance.result.then(function(idChecklist) {
			// Al cerrar el modal de nuevo item
			// si hay un id checklist en url, se refresca la info checklist
			if ($state.params.idChecklist) {
				$scope.getInfoChecklist({
					success: true,
					detail: 'OK'
				});
				$scope.page.buttons.oneMoreItem.disabled = false;
			} else {
				$state.go('app.masters.new-checklist', {
					idChecklist: idChecklist
				});
			}
		}, function() {
			// $scope.getInfoChecklist();
		});
	};

	var updateChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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
			if (error.status === 401) {
				Utils.refreshToken(updateChecklist);
			}
		});
	};

	$scope.updateOrCreateChecklist = function() {
		if (idChecklist) {
			updateChecklist({
				success: true,
				detail: 'OK'
			});
		} else {
			$scope.createChecklist({
				success: true,
				detail: 'OK'
			});
		}
	};

	$scope.removeItem = function(index) {
		$scope.checklist.items.splice(index, 1);
	};

	if (idChecklist) {
		$scope.getInfoChecklist({
			success: true,
			detail: 'OK'
		});

	}

})

.controller('addItemOptionsModalInstance', function($scope, $log, $uibModalInstance, $window, idItem, itemName, checklistName, Checklists, ChecklistActions, infoChecklist, Utils) {

	// $log.log('infoChecklist');
	// $log.log(infoChecklist);

	$scope.modal = {
		checklistOptions: [],
		selectedOption: null,
		options: []
	};

	var i = 0,
		j = 0,
		k = 0,
		infoItem = [],
		children = [];

	var getChecklistOptions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Checklists.query({
			'filter[type]': 'ChecklistOption',
			// include: 'detail'
		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.checklistOptions.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						appVisibility: false,
						detail: false
					});
				}
				$scope.getInfoChecklist({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getChecklistOptions);
			}
		});
	};

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (infoChecklist.id) {

			// $log.log(infoChecklist);

			// for (var i = 0; i < infoChecklist.data.attributes.children.length; i++) {
			// 	if (success.data.attributes.children[i].id === idItem) {
			// 		infoItem.id = success.data.attributes.children[i].id;
			// 		infoItem.name = success.data.attributes.children[i].name;
			// 		infoItem.data = success.data.attributes.children[i].data;
			// 	}
			// }


			Checklists.query({
				idChecklist: infoChecklist.id
			}, function(success) {
				if (success.data) {

					// $log.log(success);

					for (i = 0; i < success.data.attributes.children.length; i++) {
						if (success.data.attributes.children[i].id === idItem) {
							infoItem.id = success.data.attributes.children[i].id;
							infoItem.name = success.data.attributes.children[i].name;
							infoItem.data = success.data.attributes.children[i].data;
						}
					}

					for (i = 0; i < success.data.attributes.children.length; i++) {
						if (success.data.attributes.children[i].id === idItem) {
							for (j = 0; j < success.data.attributes.children[i].data.options.length; j++) {
								$scope.modal.options.push({
									id: success.data.attributes.children[i].data.options[j].id,
									detail: success.data.attributes.children[i].data.options[j].has_detail,
									selected: null
								});
							}
						}
					}


					// $scope.modal.checklistOptions -> todas las opciones q existen y q salen en el modal
					for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
						// $scope.modal.options -> todas las opciones disponibles
						for (j = 0; j < $scope.modal.options.length; j++) {
							if (parseInt($scope.modal.checklistOptions[i].id) === parseInt($scope.modal.options[j].id)) {
								$scope.modal.checklistOptions[i].appVisibility = true;
								if ($scope.modal.options[j].detail) {
									$scope.modal.checklistOptions[i].detail = true;
								}
								// $scope.modal.options[j].selected = $scope.modal.checklistOptions[i];
								break;
							}
						}
					}

				} else {
					$log.error(success);
				}

			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.getInfoChecklist);
				}
			});
		}
	};

	$scope.createChecklistOrAssignItems = function() {

		children = [];
		var optionIds = [];
		var ordererIds = [];

		// Se al arreglo de ids sólo los id de items q tienen visibilidad
		for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
			if ($scope.modal.checklistOptions[i].appVisibility) {
				if ($scope.modal.checklistOptions[i].detail) {
					optionIds.push({
						id: $scope.modal.checklistOptions[i].id,
						has_detail: true
					});
				} else {
					optionIds.push({
						id: $scope.modal.checklistOptions[i].id,
						has_detail: false
					});
				}
			}
		}

		// se agrega al children los id's q se seleccionaron con visibilidad
		children.push({
			id: idItem,
			name: itemName,
			data: {
				options: optionIds
					// option_ids: optionIds
			}
		});

		// se agrega al children los items que no estan siendo editados
		for (i = 0; i < infoChecklist.items.length; i++) {
			if (infoChecklist.items[i].id !== idItem) {
				children.push({
					id: infoChecklist.items[i].id,
					name: infoChecklist.items[i].name,
					data: {
						options: infoChecklist.items[i].options
							// option_ids: infoChecklist.items[i].options
					}
				});
			}
		}

		// se ordenan los id's ascendiente
		for (i = 0; i < children.length; i++) {
			ordererIds = _.sortBy(children[i].data.options, 'id');
			children[i].data.options = ordererIds;
		}

		// $log.log('infoChecklist');
		// $log.log(infoChecklist);
		// $log.log('children');
		// $log.log(children);

		if (infoChecklist.id) {
			addChecklistOptions(infoChecklist.id, {
				success: true,
				detail: 'OK'
			});
		} else {
			createChecklist({
				success: true,
				detail: 'OK'
			});
		}

	};

	var createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.save({
			data: {
				type: 'checklists',
				attributes: {
					name: checklistName,
					children: []
				}
			}
		}, function(success) {
			if (success.data) {
				// $log.log(success);
				addChecklistOptions(success.data.id, {
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(createChecklist);
			}
		});
	};

	var addChecklistOptions = function(idChecklist, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.update({
			idChecklist: idChecklist,
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: infoChecklist.name,
					children: children
				}
			}
		}, function(success) {
			if (success.data) {
				// $log.log(success);
				$uibModalInstance.close(idChecklist);
			} else {
				$window.alert('Error al asiginar las opciones');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al asiginar las opciones');
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(addChecklistOptions);
			}
		});

	};

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

	getChecklistOptions({
		success: true,
		detail: 'OK'
	});

	if (idItem) {

	} else {
		// $scope.generateOption();
	}

});