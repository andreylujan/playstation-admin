'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:StockBreakCtrl
 * @description
 * # StockBreakCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('StockBreakCtrl', function($scope, $log, $uibModal, $filter, NgTableParams, StockBreaks, Utils) {

	$scope.page = {
		title: 'Quiebre de Stock'
	};

	var stockbreaksIncluded = [],
		data = [];
	var i = 0,
		j = 0;

	$scope.getStockBreaks = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		data = [];

		StockBreaks.query({
			include: 'dealer,store_type,product_classification'
		}, function(success) {
			if (success.data && success.included) {

				stockbreaksIncluded = success.included;

				for (i = 0; i < success.data.length; i++) {
					data.push({
						id: success.data[i].id,
						storeTypeID: success.data[i].relationships.store_type.data.id,
						storeTypeName: '',
						productClassificationID: success.data[i].relationships.product_classification.data.id,
						productClassificationName: '',
						dealerID: success.data[i].relationships.dealer.data.id,
						dealerName: '',
						stockbreak: parseInt(success.data[i].attributes.stock_break)
					});
				}

				for (i = 0; i < stockbreaksIncluded.length; i++) {
					for (j = 0; j < data.length; j++) {
						if (stockbreaksIncluded[i].type === 'store_types') {
							if (stockbreaksIncluded[i].id === data[j].storeTypeID) {
								data[j].storeTypeName = stockbreaksIncluded[i].attributes.name;
							}
						}
						if (stockbreaksIncluded[i].type === 'product_classifications') {
							if (stockbreaksIncluded[i].id === data[j].productClassificationID) {
								data[j].productClassificationName = stockbreaksIncluded[i].attributes.name;
							}
						}
						if (stockbreaksIncluded[i].type === 'dealers') {
							if (stockbreaksIncluded[i].id === data[j].dealerID) {
								data[j].dealerName = stockbreaksIncluded[i].attributes.name;
							}
						}
					}
				}

				var parms = {
					page: 1,
					count: 25,
					filter: {
						//name: 'M'       
					},
					sorting: {
						stockbreak: 'asc'
					}
				};

				setTableParams(data, parms);

			} else {
				$log.error(success);
			}

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getStockBreaks);
			}
		});

	};

	var setTableParams = function(data, params) {
		$scope.tableParams = new NgTableParams(params, {
			total: data.length, // length of data
			dataset: data
		});
	};

	$scope.openModalCreateDealer = function(idStockBreak) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'createStockBreak.html',
			controller: 'CreateStockBreakModalInstance',
			resolve: {
				idStockBreak: function() {
					return idStockBreak;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getStockBreaks({
				success: true,
				detail: 'OK'
			});
		}, function() {
			$scope.getStockBreaks({
				success: true,
				detail: 'OK'
			});
		});
	};

	$scope.getStockBreaks({
		success: true,
		detail: 'OK'
	});

})

.controller('CreateStockBreakModalInstance', function($scope, $log, $uibModalInstance, idStockBreak, StoreTypes, ProductClassifications, Dealers, StockBreaks, Validators, Utils) {

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
		storeTypes: {
			disabled: false,
			selected: null,
			list: []
		},
		productClassifications: {
			disabled: false,
			selected: null,
			list: []
		},
		dealers: {
			disabled: false,
			selected: null,
			list: []
		},
		stockBreak: {
			disabled: false,
			value: null
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
		j = 0,
		stockbreakIncluded = [];

	if (idStockBreak) {
		$scope.modal.title.text = 'Editar quiebre de stock';
	} else {
		$scope.modal.title.text = 'Nuevo quiebre de stock';
	}

	var getStoreTypes = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		StoreTypes.query({}, function(success) {
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.modal.storeTypes.list.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}
				getProductClassifications({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error();
			if (error.status === 401) {
				Utils.refreshToken(getStoreTypes);
			}
		});
	};

	var getProductClassifications = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ProductClassifications.query({}, function(success) {
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.modal.productClassifications.list.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}
				getDealers({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error();
			if (error.status === 401) {
				Utils.refreshToken(getProductClassifications);
			}
		});
	};

	

	var getDealers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Dealers.query({}, function(success) {
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.modal.dealers.list.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}
				getInfoStockBreak({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error();
			if (error.status === 401) {
				Utils.refreshToken(getDealers);
			}
		});
	};

	var getInfoStockBreak = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (idStockBreak) {

			disableForm();
			$scope.modal.buttons.create.show = false;
			$scope.modal.buttons.edit.show = true;
			$scope.modal.buttons.delete.show = true;

			StockBreaks.query({
				idStockBreak: idStockBreak,
				include: 'dealer,store_type,product_classification'
			}, function(success) {
				if (success.data) {
					stockbreakIncluded = success.included;

					for (i = 0; i < $scope.modal.storeTypes.list.length; i++) {
						if ($scope.modal.storeTypes.list[i].id === success.data.relationships.store_type.data.id) {
							$scope.modal.storeTypes.selected = $scope.modal.storeTypes.list[i];
						}
					}
					for (i = 0; i < $scope.modal.productClassifications.list.length; i++) {
						if ($scope.modal.productClassifications.list[i].id === success.data.relationships.store_type.data.id) {
							$scope.modal.productClassifications.selected = $scope.modal.productClassifications.list[i];
						}
					}
					for (i = 0; i < $scope.modal.dealers.list.length; i++) {
						if ($scope.modal.dealers.list[i].id === success.data.relationships.dealer.data.id) {
							$scope.modal.dealers.selected = $scope.modal.dealers.list[i];
						}
					}

					$scope.modal.stockBreak.value = success.data.attributes.stock_break;

				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(getInfoStockBreak);
				}
			});
		} else {
			$scope.modal.buttons.create.show = true;
			$scope.modal.buttons.edit.show = false;
			$scope.modal.buttons.delete.show = false;
		}
	};

	$scope.saveStockBreak = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.productClassifications.selected)) {
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el tipo de producto';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
			return;
		}
		if (!Validators.validaRequiredField($scope.modal.storeTypes.selected)) {
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el tipo de tienda';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
			return;
		}
		if (!Validators.validaRequiredField($scope.modal.dealers.selected)) {
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el dealer';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
			return;
		}
		if (!Validators.validaRequiredField($scope.modal.stockBreak.value)) {
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el valor de quiebre de stock';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
			return;
		}
		$scope.removeAlert();

		StockBreaks.save({
			data: {
				type: 'stock_breaks',
				attributes: {
					stock_break: $scope.modal.stockBreak.value
				},
				relationships: {
					dealer: {
						data: {
							type: 'dealers',
							id: $scope.modal.dealers.selected.id
						}
					},
					product_classification: {
						data: {
							type: 'product_classifications',
							id: $scope.modal.productClassifications.selected.id
						}
					},
					store_type: {
						data: {
							type: 'store_types',
							id: $scope.modal.storeTypes.selected.id
						}
					}
				}
			}
		}, function(success) {
			if (success.data) {
				$uibModalInstance.close();
			} else {
				$log.error(success);
				$scope.modal.alert.title = 'Error al Guardar';
				$scope.modal.alert.text = '';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				return;
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.saveStockBreak);
			}
			$scope.modal.alert.title = 'Error al Guardar';
			$scope.modal.alert.text = '';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
			return;
		});
	};

	$scope.editStockBreak = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if ($scope.modal.buttons.edit.text === 'Editar') {
			// $scope.modal.buttons.edit.border = true;
			$scope.modal.buttons.edit.text = 'Guardar';
			$scope.modal.alert.color = 'blue-ps-1';
			$scope.modal.alert.title = 'Para efectuar la edición presione el botón guardar';
			$scope.modal.alert.text = '';
			$scope.modal.alert.show = true;
			enableForm();
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
		} else {
			// $scope.modal.buttons.edit.border = false;
			$scope.modal.buttons.edit.text = 'Editar';
			disableForm();

			if (!Validators.validaRequiredField($scope.modal.productClassifications.selected)) {
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el tipo de producto';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				return;
			}
			if (!Validators.validaRequiredField($scope.modal.storeTypes.selected)) {
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el tipo de tienda';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				return;
			}
			if (!Validators.validaRequiredField($scope.modal.dealers.selected)) {
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el dealer';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				return;
			}
			if (!Validators.validaRequiredField($scope.modal.stockBreak.value)) {
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el valor de quiebre de stock';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				return;
			}
			$scope.removeAlert();

			StockBreaks.update({
				idStockBreak: idStockBreak,
				data: {
					type: 'stock_breaks',
					id: idStockBreak,
					attributes: {
						stock_break: $scope.modal.stockBreak.value
					},
					relationships: {
						dealer: {
							data: {
								type: 'dealers',
								id: $scope.modal.dealers.selected.id
							}
						},
						product_classification: {
							data: {
								type: 'product_classifications',
								id: $scope.modal.productClassifications.selected.id
							}
						},
						store_type: {
							data: {
								type: 'store_types',
								id: $scope.modal.storeTypes.selected.id
							}
						}
					}
				}
			}, function(success) {
				if (success.data) {
					$uibModalInstance.close();
				} else {
					$log.error(success);
					$scope.modal.alert.title = 'Error al editar';
					$scope.modal.alert.text = '';
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
					return;
				}
			}, function(error) {
				$scope.modal.alert.title = 'Error al editar';
				$scope.modal.alert.text = '';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.editStockBreak);
				}
				return;
			});
		}
	};

	$scope.deleteStockBreak = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if ($scope.modal.buttons.delete.text === 'Eliminar') {
			$scope.modal.buttons.delete.border = true;
			$scope.modal.buttons.delete.text = 'Si, Eliminar';
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = '¿Está seguro?';
			$scope.modal.alert.text = 'Para efectuar la eliminación, presione nuevamente el botón';
			$scope.modal.alert.show = true;
			enableForm();
			Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
		} else {
			StockBreaks.delete({
				idStockBreak: idStockBreak
			}, function(success) {
				$log.log(success);
				$uibModalInstance.close();
			}, function(error) {
				$scope.modal.alert.title = 'Error al Eliminar';
				$scope.modal.alert.text = '';
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStockBreak');
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.deleteStockBreak);
				}
				return;
			});
		}
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.show = false;
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

	var disableForm = function() {
		$scope.modal.storeTypes.disabled = true;
		$scope.modal.productClassifications.disabled = true;
		$scope.modal.dealers.disabled = true;
		$scope.modal.stockBreak.disabled = true;
	};

	var enableForm = function() {
		$scope.modal.storeTypes.disabled = false;
		$scope.modal.productClassifications.disabled = false;
		$scope.modal.dealers.disabled = false;
		$scope.modal.stockBreak.disabled = false;
	};

	getStoreTypes({
		success: true,
		detail: 'OK'
	});


});