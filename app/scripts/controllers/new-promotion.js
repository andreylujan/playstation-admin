'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewPromotionCtrl
 * @description
 * # NewPromotionCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewPromotionCtrl', function($scope, $filter, $log, $window, $moment, $uibModal, $stateParams, $state, ngTableParams, Zones, Dealers, Users, Inbox, Validators, Promotions) {

	var i = 0;
	var j = 0;

	$scope.page = {
		title: 'Nuevo mensaje',
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

	var getInfoPromotion = function(idPromotion) {
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
			});
		}
	};

	var getZones = function() {
		$scope.page.zones = [];

		Zones.query({}, function(success) {
			for (i = 0; i < success.data.length; i++) {
				$scope.page.zones.push({
					type: 'zones',
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}

			for (i = 0; i < $scope.page.zones.length; i++) {
				$scope.page.zone.selectedZone.push($scope.page.zones[i]);
			}

			getDealers();

		}, function(error) {
			$log.log(error);
		});
	};

	var getDealers = function() {
		$scope.page.dealers = [];

		Dealers.query({}, function(success) {
			for (i = 0; i < success.data.length; i++) {
				$scope.page.dealers.push({
					type: 'dealers',
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}
			for (i = 0; i < $scope.page.dealers.length; i++) {
				$scope.page.dealer.selectedDealer.push($scope.page.dealers[i]);
			}
			getUsers();

		}, function(error) {
			$log.log(error);
		});
	};

	var getUsers = function() {
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

				getInfoPromotion($stateParams.idPromotion);

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

	};

	$scope.createPromotion = function() {

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
		if (users.length === 0) {
			openModalMessage('Debe indicar al menos un usuario');
			return;
		}
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
				"data": {
					"id" : $stateParams.idPromotion,
					"type": "promotions",
					"attributes": {
						"title": $scope.page.subject,
						"start_date": startDate,
						"end_date": endDate,
						"html": $scope.page.html
					},
					"relationships": {
						// "checklist": {
						// 	"data": {
						// 		"type": "checklists",
						// 		"id": "1"
						// 	}
						// },
						"zones": {
							"data": zones
						},
						"dealers": {
							"data": dealers
						},
						"users": {
							"data": users
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
				$log.log(error);
			});
		} else {
			Promotions.save({
				"data": {
					"type": "promotions",
					"attributes": {
						"title": $scope.page.subject,
						"start_date": startDate,
						"end_date": endDate,
						"html": '<style>body{background-color: #fbfbfb !important; color: #3f5b71 !important;}p>span{background-color: #fbfbfb !important;color: #3f5b71 !important;}p>strong {background-color: #fbfbfb !important;color: #3f5b71 !important;}img {width: 100% !important;height: auto !important;}ol>li>span{background-color: #fbfbfb !important;}</style><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' + $scope.page.html + '</html>'
					},
					"relationships": {
						// "checklist": {
						// 	"data": {
						// 		"type": "checklists",
						// 		"id": "1"
						// 	}
						// },
						"zones": {
							"data": zones
						},
						"dealers": {
							"data": dealers
						},
						"users": {
							"data": users
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
				$log.log(error);
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

	getZones();

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