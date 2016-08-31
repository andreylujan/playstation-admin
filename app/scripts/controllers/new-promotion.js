'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewPromotionCtrl
 * @description
 * # NewPromotionCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewPromotionCtrl', function($scope, $filter, $log, $window, $moment, $uibModal, $stateParams, $state, Zones, Dealers, Users, Inbox, Validators, Promotions, Utils) {

	var i = 0;
	var j = 0;

	$scope.dropdownMultiselect = {
		settings: {
			enableSearch: true,
			displayProp: 'name'
		},
		zones: {
			texts: {
				checkAll: 'Seleccionar todas',
				uncheckAll: 'Deseleccionar todas',
				searchPlaceholder: 'Buscar',
				buttonDefaultText: 'Seleccionar zonas',
				dynamicButtonTextSuffix: 'zonas seleccionadas'
			},
			settings: {
				enableSearch: true,
				displayProp: 'name',
				scrollable: true,
				scrollableHeight: 400
			}
		},
		dealers: {
			texts: {
				checkAll: 'Seleccionar todos',
				uncheckAll: 'Deseleccionar todos',
				searchPlaceholder: 'Buscar',
				buttonDefaultText: 'Seleccionar dealers',
				dynamicButtonTextSuffix: 'dealers seleccionados'
			},
			settings: {
				enableSearch: true,
				displayProp: 'name',
				scrollable: true,
				scrollableHeight: 400
			}
		}
	};

	$scope.page = {
		title: '',
		buttons: {
			sendInvitation: {
				show: true
			}
		},
		html: '',
		subject: '',
		zones: [],
		dealers: [],
		stores: [],
		users: [],
		zone: {
			selectedZone: []
		},
		dealer: {
			selectedDealer: []
		},
		user: {
			selectedUser: []
		},
		rangeOptions: {
			minDate: $moment()
		},
		startDate: '',
		endDate: ''
	};

	$scope.rangeOptions = {
		minDate: $moment()
	};

	var selectInfoPromotion = function(data) {

		$scope.page.zone.selectedZone = [];
		$scope.page.dealer.selectedDealer = [];
		$scope.page.user.selectedUser = [];

		// $log.log(data);

		for (i = 0; i < $scope.page.zones.length; i++) {
			for (j = 0; j < data.relationships.zones.data.length; j++) {
				if (parseInt($scope.page.zones[i].id) === parseInt(data.relationships.zones.data[j].id)) {
					$scope.page.zone.selectedZone.push($scope.page.zones[i]);
					break;
				}
			}
		}

		for (i = 0; i < $scope.page.dealers.length; i++) {
			for (j = 0; j < data.relationships.dealers.data.length; j++) {
				if (parseInt($scope.page.dealers[i].id) === parseInt(data.relationships.dealers.data[j].id)) {
					$scope.page.dealer.selectedDealer.push($scope.page.dealers[i]);
					break;
				}
			}
		}

		for (i = 0; i < $scope.page.users.length; i++) {
			for (j = 0; j < data.relationships.users.data.length; j++) {
				if (parseInt($scope.page.users[i].id) === parseInt(data.relationships.users.data[j].id)) {
					$scope.page.user.selectedUser.push($scope.page.users[i]);
					break;
				}
			}
		}

		$scope.page.startDate = $moment(data.attributes.start_date).format("MMM D, YYYY");
		$scope.page.endDate = $moment(data.attributes.end_date).format("MMM D, YYYY");
		$scope.page.subject = data.attributes.title;
		$scope.page.html = data.attributes.html;
	};

	var getInfoPromotion = function(idPromotion, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (idPromotion) {
			Promotions.query({
				idPromotion: idPromotion,
				include: 'checklist,users,zones,dealers'
			}, function(success) {
				if (success.data) {
					selectInfoPromotion(success.data);
				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken(getInfoPromotion);
				}
			});
		}
	};

	$scope.getDealers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var dealersIdsSelected = [];
		$scope.page.dealers = [];
		$scope.page.dealer.selectedDealer = [];

		Dealers.query({}, function(success) {
			dealersIdsSelected = [];
			$scope.page.dealers = [];
			$scope.page.dealer.selectedDealer = [];

			for (i = 0; i < $scope.page.zone.selectedZone.length; i++) {
				for (j = 0; j < $scope.page.zone.selectedZone[i].dealersIds.length; j++) {
					dealersIdsSelected.push($scope.page.zone.selectedZone[i].dealersIds[j]);
				}
			}
			dealersIdsSelected = _.uniq(dealersIdsSelected);

			// $log.log('dealersIdsSelected');
			// $log.log(dealersIdsSelected);

			for (i = 0; i < dealersIdsSelected.length; i++) {
				for (j = 0; j < success.data.length; j++) {
					if (parseInt(dealersIdsSelected[i]) === parseInt(success.data[j].id)) {
						$scope.page.dealers.push({
							type: 'dealers',
							id: parseInt(success.data[i].id),
							name: $filter('capitalize')(success.data[i].attributes.name, true)
						});
						break;
					}
				}
			}

			// $log.log('$scope.page.dealers');
			// $log.log($scope.page.dealers);

			for (i = 0; i < $scope.page.dealers.length; i++) {
				$scope.page.dealer.selectedDealer.push($scope.page.dealers[i]);
			}

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getDealers);
			}
		});
	};

	var getZones = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.zones = [];
		$scope.page.zone.selectedZone = [];
		// var selectedZones = [];

		Zones.query({}, function(success) {
			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.page.zones.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'zones'
					});
				}

				for (i = 0; i < $scope.page.zones.length; i++) {
					$scope.page.zone.selectedZone.push($scope.page.zones[i]);
				}

				$scope.getDealers({
					success: true,
					detail: 'OK'
				}, $scope.page.zone.selectedZone);

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
	$scope.getDealers = function(e, zones) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.dealers = [];
		$scope.page.dealer.selectedDealer = [];
		var selectedZonesIds = [];

		for (i = 0; i < zones.length; i++) {
			selectedZonesIds.push(zones[i].id);
		}

		Dealers.query({
			'filter[zone_ids]': selectedZonesIds.toString()
		}, function(success) {
			if (success.data) {

				$scope.page.dealers = [];
				$scope.page.dealer.selectedDealer = [];

				for (i = 0; i < success.data.length; i++) {
					$scope.page.dealers.push({
						id: parseInt(success.data[i].id),
						name: $filter('capitalize')(success.data[i].attributes.name, true),
						type: 'dealers'
					});
				}

				for (i = 0; i < $scope.page.dealers.length; i++) {
					$scope.page.dealer.selectedDealer.push($scope.page.dealers[i]);
				}

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

	$scope.zoneMultiselectEvents = {
		onChange: function() {
			$scope.getDealers({
				success: true,
				detail: 'OK'
			}, $scope.page.zone.selectedZone);
		}
	};

	$scope.dealerMultiselectEvents = {
		onItemSelect: function(item) {
			// $log.log(item);
			// se recorre el arreglo q contiene TODOS los dealers
			for (i = 0; i < $scope.page.dealers.length; i++) {
				// Si el dealer q se seleccionó es el misma q el q se se está recorriedo
				$log.log('comparo ' + $scope.page.dealers[i].id + ' con ' + item.id);
				if (parseInt($scope.page.dealers[i].id) === parseInt(item.id)) {
					// se agrega al arreglo de dealers seleccionada, con toda su info (name, dealersIds, etc)
					$scope.page.dealer.selectedDealer.push({
						type: 'dealers',
						id: parseInt(item.id),
						name: $filter('capitalize')($scope.page.dealers[i].name, true)
					});
					break;
				}
			}
			// cómo por defecto se agrega al arreglo de las dealers seleccionadas un obj con sólo el id de el dealer seleccionada...
			// se borra ese elemento q no tiene el attr name
			for (i = 0; i < $scope.page.dealer.selectedDealer.length; i++) {
				if (!$scope.page.dealer.selectedDealer[i].name) {
					$scope.page.dealer.selectedDealer.splice(i, 1);
				}
			}
			// $log.log('$scope.page.dealer.selectedDealer');
			// $log.log($scope.page.dealer.selectedDealer);
		},
	};

	var getUsers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.users = [];

		Users.query({
			idUser: ''
		}, function(success) {

			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.page.users.push({
						type: 'users',
						id: success.data[i].id,
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
					});
				}

				getInfoPromotion($stateParams.idPromotion, {
					success: true,
					detail: 'OK'
				});

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
		});
	};

	$scope.createPromotion = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var zones = [];
		var dealers = [];
		var users = [];

		for (i = 0; i < $scope.page.zone.selectedZone.length; i++) {
			zones.push({
				id: $scope.page.zone.selectedZone[i].id,
				type: $scope.page.zone.selectedZone[i].type
			});
		}
		for (i = 0; i < $scope.page.dealer.selectedDealer.length; i++) {
			dealers.push({
				id: $scope.page.dealer.selectedDealer[i].id,
				type: $scope.page.dealer.selectedDealer[i].type
			});
		}
		for (i = 0; i < $scope.page.user.selectedUser.length; i++) {
			users.push({
				id: $scope.page.user.selectedUser[i].id,
				type: $scope.page.user.selectedUser[i].type
			});
		}

		if (zones.length === 0) {
			openModalMessage('Debe indicar al menos una zona');
			return;
		}
		if (dealers.length === 0) {
			openModalMessage('Debe indicar al menos un dealer');
			return;
		}
		// if (users.length === 0) {
		// 	openModalMessage('Debe indicar al menos un usuario');
		// 	return;
		// }
		if (!Validators.validaRequiredField($scope.page.startDate)) {
			openModalMessage('Debe indicar la fecha de inicio de la promoción');
			return;
		}
		if (!Validators.validaRequiredField($scope.page.endDate)) {
			openModalMessage('Debe indicar la fecha de fin de la promoción');
			return;
		}
		if (!Validators.validaRequiredField($scope.page.subject)) {
			openModalMessage('Debe indicar el título de la promoción');
			return;
		}
		if (!Validators.validaRequiredField($scope.page.html)) {
			openModalMessage('Debe indicar el cuerpo del mensaje');
			return;
		}

		var startDate = $moment($scope.page.startDate).toISOString();
		var endDate = $moment($scope.page.endDate).toISOString();

		if ($stateParams.idPromotion) {
			Promotions.update({
				idPromotion: $stateParams.idPromotion,
				'data': {
					'id': $stateParams.idPromotion,
					'type': 'promotions',
					'attributes': {
						'title': $scope.page.subject,
						'start_date': startDate,
						'end_date': endDate,
						'html': $scope.page.html
					},
					'relationships': {
						// 'checklist': {
						// 	'data': {
						// 		'type': 'checklists',
						// 		'id': '1'
						// 	}
						// },
						'zones': {
							'data': zones
						},
						'dealers': {
							'data': dealers
						},
						// 'users': {
						// 	'data': users
						// },
						'users': {
							'data': []
						}
					}
				}
			}, function(success) {
				if (success.data) {
					openModalMessage('Se ha actualizado la promoción con éxito');
					$state.go('app.promotions.list');
				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.createPromotion);
				}
			});
		} else {
			Promotions.save({
				data: {
					type: 'promotions',
					attributes: {
						title: $scope.page.subject,
						start_date: startDate,
						end_date: endDate,
						html: '<style>body{background-color: #ffffff !important; color: #3f5b71 !important;}p>span{background-color: #ffffff !important;color: #3f5b71 !important;}p>strong {background-color: #ffffff !important;color: #3f5b71 !important;}img {width: 100% !important;height: auto !important;}ol>li>span{background-color: #ffffff !important;}</style><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' + $scope.page.html + '</html>'
					},
					relationships: {
						zones: {
							data: zones
						},
						dealers: {
							data: dealers
						},
						users: {
							data: users
						}
					}
				}
			}, function(success) {
				if (success.data) {
					openModalMessage('Se ha creado la promoción con éxito');
					$state.go('app.promotions.list');
				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.createPromotion);
				}
			});
		}
	};

	var openModalMessage = function(title) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageModal.html',
			controller: 'MessageModalInstance',
			resolve: {
				title: function() {
					return title;
				}
			}
		});

		modalInstance.result.then(function() {
			// $scope.getPromotions();
		}, function() {
			// $scope.getPromotions();
		});
	};

	getZones({
		success: true,
		detail: 'OK'
	});

	if ($stateParams.idPromotion) {
		$scope.page.title = 'Ver promoción';
		$scope.page.buttons.sendInvitation.show = false;
		getInfoPromotion($stateParams.idPromotion, {
			success: true,
			detail: 'OK'
		});
	} else {
		$scope.page.title = 'Nueva promoción';
		$scope.page.buttons.sendInvitation.show = true;
	}

})

.controller('MessageModalInstance', function($scope, $log, $uibModalInstance, title) {

	$scope.modal = {
		message: {
			title: title
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});