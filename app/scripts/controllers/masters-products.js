'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ProductsCtrl', function($scope, $log, $filter, $window, $uibModal, ngTableParams, Products, Csv, Utils) {

	$scope.status = {
		open: true
	};

	$scope.page = {
		title: 'Productos',
		cvsProductsFile: {
			value: null
		}
	};

	var i = 0,
		j = 0;

	var data = [];

	var productsIncluded = [];

	$scope.getProducts = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		data = [];

		Products.query({
			include: 'product_type,product_classification,platform'
		}, function(success) {

			// $log.log(success);

			if (success.errors) {
				$log.error(success);
				return;
			} else if (success.data && success.included) {

				productsIncluded = success.included;

				for (i = 0; i < success.data.length; i++) {
					data.push({
						id: success.data[i].id,
						sku: success.data[i].attributes.sku,
						name: success.data[i].attributes.name,
						typeId: success.data[i].relationships.product_type.data.id,
						typeName: '',
						destinationId: success.data[i].relationships.product_classification.data.id,
						destinationName: '',
						platformId: success.data[i].relationships.platform.data.id,
						platformName: '',
						publisher: success.data[i].attributes.publisher
							// description: success.data[i].attributes.description,
							// plu: success.data[i].attributes.plu,
							// validityCode: success.data[i].attributes.validity_code,
							// createdAt: success.data[i].attributes.created_at,
							// brand: success.data[i].attributes.brand,
							// minPrice: success.data[i].attributes.min_price,
							// maxPrice: success.data[i].attributes.max_price,
							// isTop: success.data[i].attributes.is_top,
					});

					for (j = 0; j < productsIncluded.length; j++) {
						if (productsIncluded[j].type === 'product_types') {
							if (data[i].typeId === productsIncluded[j].id) {
								data[i].typeName = productsIncluded[j].attributes.name;
							}
						}
					}

					for (j = 0; j < productsIncluded.length; j++) {
						if (productsIncluded[j].type === 'product_classifications') {
							if (data[i].destinationId === productsIncluded[j].id) {
								data[i].destinationName = productsIncluded[j].attributes.name;
							}
						}
					}

					for (j = 0; j < productsIncluded.length; j++) {
						if (productsIncluded[j].type === 'platforms') {
							if (data[i].platformId === productsIncluded[j].id) {
								data[i].platformName = productsIncluded[j].attributes.name;
							}
						}
					}

				}

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 25, // count per page
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						//name: 'asc'     // initial sorting
					}
				}, {
					total: data.length, // length of data
					getData: function($defer, params) {
						// use build-in angular filter
						var filteredData = params.filter() ?
							$filter('filter')(data, params.filter()) :
							data;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							data;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getProducts);
			}
		});
	};

	$scope.openModalCreateProduct = function(idProduct) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'createProduct.html',
			controller: 'CreateProductModalInstance',
			resolve: {
				idProduct: function() {
					return idProduct;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getProducts({
				success: true,
				detail: 'OK'
			});
			// closed
		}, function() {
			// dismissed 
			$scope.getProducts({
				success: true,
				detail: 'OK'
			});
		});
	};

	$scope.uploadCsvProducts = function(e) {
		// if (!e.success) {
		// 	$log.error(e.detail);
		// 	return;
		// }

		// Csv.upload(form).success(function(success) {
		// 	$log.log(success);
		// 	// openModalCsvProductChargeSummary(success);
		// }, function(error) {
		// 	$log.error(error);
		// 	if (error.status === 401) {
		// 		Utils.refreshToken($scope.uploadCsvProducts);
		// 	}
		// });

	};

	var openModalCsvProductChargeSummary = function(result) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'csvProductChargeSummary.html',
			controller: 'CsvProductChargeSummaryModalInstance',
			resolve: {
				result: function() {
					return result;
				}
			}
		});

		modalInstance.result.then(function() {
			// closed
		}, function() {
			// dismissed 
		});
	};

	$scope.getProducts({
		success: true,
		detail: 'OK'
	});

})

.controller('CreateProductModalInstance', function($scope, $log, $uibModal, $uibModalInstance, $window, ProductTypes, ProductClassifications, Platforms, idProduct, Validators, Utils, Products, Files) {

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
		product: {
			name: {
				text: '',
				disabled: false
			},
			description: {
				text: '',
				disabled: false
			},
			sku: {
				text: '',
				disabled: false
			},
			plu: {
				text: '',
				disabled: false
			},
			validityCode: {
				text: '',
				disabled: false
			},
			brand: {
				text: '',
				disabled: false
			},
			minPrice: {
				text: '',
				disabled: false
			},
			maxPrice: {
				text: '',
				disabled: false
			},
			stock: {
				text: '',
				disabled: false
			},
			isTop: {
				value: false,
				disabled: false
			},
			isListed: {
				value: false,
				disabled: false
			},
			type: {
				id: null,
				name: null,
				disabled: false
			},
			destination: {
				id: null,
				name: null,
				disabled: false
			},
			platform: {
				id: null,
				name: null,
				disabled: false
			},
			images: {
				src: [],
				disabled: false,
				show: false
			},
			publisher: {
				disabled: false,
				text: null
			}
		},
		productTypes: [],
		destinations: [],
		platforms: [],
		imagesUploaded: [],
		buttons: {
			create: {
				show: false,
				text: null,
				border: false,
				disabled: false
			},
			edit: {
				show: false,
				text: null,
				border: false,
				disabled: true
			},
			delete: {
				show: false,
				text: null,
				border: false,
				disabled: true
			}
		}
	};

	var getProductDetails = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Products.query({
			idProduct: idProduct,
			include: 'product_type,product_classification,platform,images'
		}, function(success) {
			// $log.log(success);
			$scope.modal.product.name.text = success.data.attributes.name;
			$scope.modal.product.description.text = success.data.attributes.description;
			$scope.modal.product.sku.text = success.data.attributes.sku;
			$scope.modal.product.plu.text = success.data.attributes.plu;
			// $scope.modal.product.brand.text = success.data.attributes.brand;
			$scope.modal.product.validityCode.text = success.data.attributes.validity_code;
			$scope.modal.product.minPrice.text = success.data.attributes.min_price;
			$scope.modal.product.maxPrice.text = success.data.attributes.max_price;
			$scope.modal.product.stock.text = success.data.attributes.stock;
			$scope.modal.product.isTop.value = success.data.attributes.is_top;
			$scope.modal.product.isListed.value = success.data.attributes.is_listed;
			$scope.modal.product.publisher.text = success.data.attributes.publisher;

			for (var i = 0; i < $scope.modal.productTypes.length; i++) {
				if ($scope.modal.productTypes[i].id === success.data.relationships.product_type.data.id) {
					$scope.modal.product.type.id = $scope.modal.productTypes[i].id;
					$scope.modal.product.type.name = $scope.modal.productTypes[i].name;
					break;
				}
			}
			for (i = 0; i < $scope.modal.destinations.length; i++) {
				if ($scope.modal.destinations[i].id === success.data.relationships.product_classification.data.id) {
					$scope.modal.product.destination.id = $scope.modal.destinations[i].id;
					$scope.modal.product.destination.name = $scope.modal.destinations[i].name;
					break;
				}
			}
			for (i = 0; i < $scope.modal.platforms.length; i++) {
				if (success.data.relationships.platform.data) {
					if ($scope.modal.platforms[i].id === success.data.relationships.platform.data.id) {
						$scope.modal.product.platform.id = $scope.modal.platforms[i].id;
						$scope.modal.product.platform.name = $scope.modal.platforms[i].name;
						break;
					}
				}
			}

			$scope.modal.buttons.edit.disabled = false;
			$scope.modal.buttons.delete.disabled = false;

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getProductDetails);
			}
		});
	};

	var setDisabledStateForInputs = function(state) {
		$scope.modal.product.name.disabled = state;
		$scope.modal.product.description.disabled = state;
		$scope.modal.product.sku.disabled = state;
		$scope.modal.product.plu.disabled = state;
		$scope.modal.product.brand.disabled = state;
		$scope.modal.product.validityCode.disabled = state;
		$scope.modal.product.minPrice.disabled = state;
		$scope.modal.product.maxPrice.disabled = state;
		$scope.modal.product.stock.disabled = state;
		$scope.modal.product.isTop.disabled = state;
		$scope.modal.product.isListed.disabled = state;
		$scope.modal.product.type.disabled = state;
		$scope.modal.product.destination.disabled = state;
		$scope.modal.product.platform.disabled = state;
		$scope.modal.product.images.disabled = state;
		$scope.modal.product.publisher.disabled = state;
	};

	var getProductTypes = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ProductTypes.query({}, function(success) {
			// $log.log(success);
			if (success.data) {

				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.productTypes.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}

				getProductDestinations({
					success: true,
					detail: 'OK'
				});

			} else if (success.errors) {
				$log.error(success);
				return;
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getProductTypes);
			}
		});
	};

	var getProductDestinations = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ProductClassifications.query({}, function(success) {
			// $log.log(success);
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.destinations.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}
				getPlaforms({
					success: true,
					detail: 'OK'
				});
			} else if (success.errors) {
				$log.error(success);
				return;
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getProductDestinations);
			}
		});
	};

	var getPlaforms = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Platforms.query({}, function(success) {
			// $log.log(success);
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.platforms.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name
					});
				}

				if (idProduct) {
					getProductDetails({
						success: true,
						detail: 'OK'
					});
				}

			} else if (success.errors) {
				$log.error(success);
				return;
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getPlaforms);
			}
		});
	};

	var setAlertProperties = function(show, color, title, text) {
		$scope.modal.alert.color = color;
		$scope.modal.alert.show = show;
		$scope.modal.alert.title = title;
		$scope.modal.alert.text = text;
	};

	var uploadImages = function() {
		// $log.log($scope.modal.product.images.src);
		Utils.gotoAnyPartOfPage('topModal');
		if ($scope.modal.product.images.src.length > 0) {
			setAlertProperties(true, 'info', 'Subiendo producto', 'Subiendo imágenes');

			var imagesUploaded = 0;

			/* jshint ignore:start */
			for (var i = 0; i < $scope.modal.product.images.src.length; i++) {
				// $log.log($scope.modal.product.images.src[i]);
				Files.save({
					category_id: null,
					report_id: null,
					last_image: null,
					image: 'data:' + $scope.modal.product.images.src[i].filetype + 'base64,' + $scope.modal.product.images.src[i].base64
				}, function(success) {
					// $log.log(success);
					if (success.data) {
						$scope.modal.imagesUploaded.push({
							type: 'images',
							id: success.data.id
						});
					}
					imagesUploaded++;
					if (imagesUploaded === ($scope.modal.product.images.src.length)) {
						setAlertProperties(false, null, null, null);
						if (idProduct) {
							editProduct({
								success: true,
								detail: 'OK'
							});
						} else {
							saveProduct({
								success: true,
								detail: 'OK'
							});
						}
					}
				}, function(error) {
					$log.error(error);
					imagesUploaded++;
					if (imagesUploaded === ($scope.modal.product.images.src.length)) {
						setAlertProperties(false, null, null, null);
						if (idProduct) {
							editProduct({
								success: true,
								detail: 'OK'
							});
						} else {
							saveProduct({
								success: true,
								detail: 'OK'
							});
						}
					}
				});
			}
			/* jshint ignore:end */
		} else {
			setAlertProperties(true, 'info', 'Subiendo producto', 'Subiendo información del producto');
			if (idProduct) {
				editProduct({
					success: true,
					detail: 'OK'
				});
			} else {
				saveProduct({
					success: true,
					detail: 'OK'
				});
			}
		}
	};

	$scope.validateForm = function() {

		if (idProduct) {
			if (!$scope.modal.buttons.edit.border) {
				$scope.modal.buttons.edit.border = true;
				$scope.modal.buttons.edit.text = 'Guardar';
				setDisabledStateForInputs(false);
				$scope.modal.product.images.show = true;
				Utils.gotoAnyPartOfPage('topModal');
			} else {
				if (!Validators.validaRequiredField($scope.modal.product.name.text)) {
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					$scope.modal.alert.title = 'Faltan campos por rellenar';
					$scope.modal.alert.text = 'Debe indicar el nombre del producto';
					Utils.gotoAnyPartOfPage('topModal');
					return;
				}
				if (!Validators.validaRequiredField($scope.modal.product.sku.text)) {
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					$scope.modal.alert.title = 'Faltan campos por rellenar';
					$scope.modal.alert.text = 'Debe indicar el sku del producto';
					Utils.gotoAnyPartOfPage('topModal');
					return;
				}
				if (!$scope.modal.product.type) {
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					$scope.modal.alert.title = 'Faltan campos por rellenar';
					$scope.modal.alert.text = 'Debe indicar el tipo de producto';
					Utils.gotoAnyPartOfPage('topModal');
					return;
				}
				if (!$scope.modal.product.destination) {
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					$scope.modal.alert.title = 'Faltan campos por rellenar';
					$scope.modal.alert.text = 'Debe indicar el destino del producto';
					Utils.gotoAnyPartOfPage('topModal');
					return;
				}
				uploadImages();
			}
		} else {
			if (!Validators.validaRequiredField($scope.modal.product.name.text)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el nombre del producto';
				Utils.gotoAnyPartOfPage('topModal');
				return;
			}
			if (!Validators.validaRequiredField($scope.modal.product.sku.text)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el sku del producto';
				Utils.gotoAnyPartOfPage('topModal');
				return;
			}
			if (!$scope.modal.product.type) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el tipo de producto';
				Utils.gotoAnyPartOfPage('topModal');
				return;
			}
			if (!$scope.modal.product.destination) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.show = true;
				$scope.modal.alert.title = 'Faltan campos por rellenar';
				$scope.modal.alert.text = 'Debe indicar el destino del producto';
				Utils.gotoAnyPartOfPage('topModal');
				return;
			}
			$scope.modal.buttons.create.disabled = true;
			uploadImages();
		}
	};

	var saveProduct = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.product.name.text)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el nombre del producto';
			Utils.gotoAnyPartOfPage('topModal');
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.product.sku.text)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el sku del producto';
			Utils.gotoAnyPartOfPage('topModal');
			return;
		}

		if (!$scope.modal.product.type) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el tipo de producto';
			Utils.gotoAnyPartOfPage('topModal');
			return;
		}
		if (!$scope.modal.product.destination) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'Faltan campos por rellenar';
			$scope.modal.alert.text = 'Debe indicar el destino del producto';
			Utils.gotoAnyPartOfPage('topModal');
			return;
		}

		setAlertProperties(true, 'info', 'Subiendo producto', 'Subiendo información del producto');
		Utils.gotoAnyPartOfPage('topModal');

		Products.save({
			data: {
				type: 'products',
				attributes: {
					name: $scope.modal.product.name.text,
					description: $scope.modal.product.description.text,
					sku: $scope.modal.product.sku.text,
					plu: $scope.modal.product.plu.text,
					validity_code: $scope.modal.product.validityCode.text,
					// brand: $scope.modal.product.brand.text,
					min_price: $scope.modal.product.minPrice.text,
					max_price: $scope.modal.product.maxPrice.text,
					// stock: $scope.modal.product.stock.text,
					is_top: $scope.modal.product.isTop.value,
					is_listed: $scope.modal.product.isListed.value,
					publisher: $scope.modal.product.publisher.text
				},
				relationships: {
					product_type: {
						data: {
							type: 'product_types',
							id: $scope.modal.product.type.id
						}
					},
					product_classification: {
						data: {
							type: 'product_classifications',
							id: $scope.modal.product.destination.id
						}
					},
					platform: {
						data: {
							type: 'platforms',
							id: $scope.modal.product.platform.id
						}
					},
					images: {
						data: $scope.modal.imagesUploaded
					}
				}
			}
		}, function(success) {
			// $log.log(success);
			setAlertProperties(false, null, null, null);
			$uibModalInstance.close();
		}, function(error) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.show = true;
			$scope.modal.alert.title = 'Error al agregar producto';
			$scope.modal.alert.text = error.data.errors[0].detail;
			Utils.gotoAnyPartOfPage('topModal');
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(saveProduct());
			}
			return;
		});
	};

	var editProduct = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Products.update({
				idProduct: idProduct,
				data: {
					type: "products",
					id: idProduct,
					attributes: {
						name: $scope.modal.product.name.text,
						description: $scope.modal.product.description.text,
						sku: $scope.modal.product.sku.text,
						plu: $scope.modal.product.plu.text,
						validity_code: $scope.modal.product.validityCode.text,
						// brand: $scope.modal.product.brand.text,
						min_price: $scope.modal.product.minPrice.text,
						max_price: $scope.modal.product.maxPrice.text,
						is_top: $scope.modal.product.isTop.value,
						is_listed: $scope.modal.product.isListed.value,
						publisher: $scope.modal.product.publisher.text
					},
					relationships: {
						product_type: {
							data: {
								type: 'product_types',
								id: $scope.modal.product.type.id
							}
						},
						product_classification: {
							data: {
								type: 'product_classifications',
								id: $scope.modal.product.destination.id
							}
						},
						platform: {
							data: {
								type: 'platforms',
								id: $scope.modal.product.platform.id
							}
						},
						images: {
							data: $scope.modal.imagesUploaded
						}
					}
				}
			}, function(success) {
				$log.log(success);
				$uibModalInstance.close();
			},
			function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(editProduct);
				}
			});
	};

	$scope.deleteProduct = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (!$scope.modal.buttons.delete.border) {
			$scope.modal.buttons.delete.border = true;
			$scope.modal.buttons.delete.text = 'Si, eliminar';
			setAlertProperties(true, 'danger', '¿Realmente desea eliminar el produto?', 'Para hacerlo vuelva a presionar el boton eliminar');
			Utils.gotoAnyPartOfPage('topModal');
		} else {


			Products.delete({
				idProduct: idProduct
			}, function(success) {
				// $log.log(success);
				$uibModalInstance.close();
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.deleteProduct);
				}
			});
		}
	};

	$scope.openModalProductImages = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'productImages.html',
			controller: 'ProductImagesModalInstance',
			resolve: {
				idProduct: function() {
					return idProduct;
				}
			}
		});

		modalInstance.result.then(function() {
			// closed
		}, function() {
			// dismissed 
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	if (idProduct) {

		setDisabledStateForInputs(true);
		$scope.modal.product.images.show = false;

		$scope.modal.title.text = 'Editar producto';
		$scope.modal.buttons.create.show = false;
		$scope.modal.buttons.create.text = 'Guardar';
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.edit.text = 'Editar';
		$scope.modal.buttons.delete.show = true;
		$scope.modal.buttons.delete.text = 'Eliminar';
	} else {
		$scope.modal.product.images.show = true;
		$scope.modal.title.text = 'Nuevo producto';
		$scope.modal.buttons.create.show = true;
		$scope.modal.buttons.create.text = 'Guardar';
		$scope.modal.buttons.edit.show = false;
		$scope.modal.buttons.edit.text = 'Editar';
		$scope.modal.buttons.delete.show = false;
		$scope.modal.buttons.delete.text = 'Eliminar';
	}

	getProductTypes({
		success: true,
		detail: 'OK'
	});

})

.controller('ProductImagesModalInstance', function($scope, $log, $uibModalInstance, idProduct) {

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

})

.controller('CsvProductChargeSummaryModalInstance', function($scope, $log, $uibModalInstance, idProduct) {

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});