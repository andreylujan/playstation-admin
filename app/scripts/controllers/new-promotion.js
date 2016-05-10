'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('NewPromotionCtrl', function($scope, $filter, $log, $window, $moment, ngTableParams, Zones, Dealers, Users, Promotions, Validators) {

		$scope.page = {
			title: 'Nueva promoción',
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
			startDate: '',
			endDate: ''
		};

		var i = 0;

		$scope.hola = function() {
			$log.log($scope.page.zone.selectedZone);
			$log.log($scope.page.dealer.selectedDealer);
			$log.log($scope.page.user.selectedUser);
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
				$window.alert('falta zonas');
				return;
			}
			if (dealers.length === 0) {
				$window.alert('falta dealers');
				return;
			}
			if (users.length === 0) {
				$window.alert('falta users');
				return;
			}
			if (!Validators.validaRequiredField($scope.page.startDate)) {
				$window.alert('falta fecha inicio');
				return;
			}
			if (!Validators.validaRequiredField($scope.page.endDate)) {
				$window.alert('falta fecha fin');
				return;
			}
			if (!Validators.validaRequiredField($scope.page.subject)) {
				$window.alert('falta asunto');
				return;
			}
			if (!Validators.validaRequiredField($scope.page.html)) {
				$window.alert('falta html');
				return;
			}

			var startDate = $moment($scope.page.startDate).toISOString();
			var endDate = $moment($scope.page.endDate).toISOString();

			Promotions.save({
				"data": {
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
				$log.log(success);
			}, function(error) {
				$log.log(error);
			});
		};

		getZones();
		getUsers();

	});