'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('InboxListCtrl', function($scope, $filter, $log, $window, $state, $uibModal, ngTableParams, Inbox, Zones, Dealers, Users) {

	$scope.page = {
		title: 'Inbox'
	};

	var i = 0;
	var j = 0;
	var k = 0;
	var zones = [];
	var dealers = [];
	var users = [];

	$scope.inboxes = [];

	var getInboxes = function() {

		$scope.inboxes = [];

		Inbox.query({
			include: ''
		}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {

					$scope.inboxes.push({
						
					});

				}

				// for (i = 0; i < $scope.promotions.length; i++) {
				// 	for (j = 0; j < $scope.promotions[i].zones.length; j++) {
				// 		for (k = 0; k < zones.length; k++) {
				// 			if (parseInt($scope.promotions[i].zones[j].id) === parseInt(zones[k].id)) {
				// 				$scope.promotions[i].zones[j].name = zones[k].name;
				// 				break;
				// 			}
				// 		}
				// 	}
				// 	for (j = 0; j < $scope.promotions[i].dealers.length; j++) {
				// 		for (k = 0; k < dealers.length; k++) {
				// 			if (parseInt($scope.promotions[i].dealers[j].id) === parseInt(dealers[k].id)) {
				// 				$scope.promotions[i].dealers[j].name = dealers[k].name;
				// 				break;
				// 			}
				// 		}
				// 	}
				// 	for (j = 0; j < $scope.promotions[i].users.length; j++) {
				// 		for (k = 0; k < users.length; k++) {
				// 			if (parseInt($scope.promotions[i].users[j].id) === parseInt(users[k].id)) {
				// 				$scope.promotions[i].users[j].fullName = users[k].fullName;
				// 				break;
				// 			}
				// 		}
				// 	}
				// }

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 50,
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						title: 'asc' // initial sorting
					}
				}, {
					total: $scope.inboxes.length, // length of $scope.inboxes
					getData: function($defer, params) {
						var filteredData = params.filter() ?
							$filter('filter')($scope.inboxes, params.filter()) :
							$scope.inboxes;
						var orderedData = params.sorting() ?
							$filter('orderBy')(filteredData, params.orderBy()) :
							$scope.inboxes;

						params.total(orderedData.length); // set total for recalc pagination
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});

				// $log.log($scope.inboxes);

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

	};

	var getZones = function() {

		zones = [];

		Zones.query({}, function(success) {
			for (var i = 0; i < success.data.length; i++) {
				zones.push({
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}

			getDealers();

		}, function(error) {
			$log.log(error);
		});
	};

	var getDealers = function() {

		dealers = [];

		Dealers.query({}, function(success) {
			for (var i = 0; i < success.data.length; i++) {
				dealers.push({
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}

			getUsers();
		}, function(error) {
			$log.log(error);
		});
	};

	var getUsers = function() {

		users = [];

		Users.query({
			idUser: ''
		}, function(success) {

			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					users.push({
						id: success.data[i].id,
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name,
						email: success.data[i].attributes.email,
						roleName: success.data[i].attributes.role_name,
						roleId: success.data[i].attributes.role_id,
						active: success.data[i].attributes.active
					});
				}
				getPromotions();

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

	};

	$scope.gotoNewPromotion = function(idInbox) {

		if (idInbox) {
			$state.go('app.inbox.new', {
				idInbox: idInbox
			});
		} else {
			$state.go('app.inox.new');
		}

	};

	$scope.openModalRemovePromotion = function(idInbox) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'removeInboxModal.html',
			controller: 'RemoveInboxModalInstance',
			resolve: {
				idInbox: function() {
					return idInbox;
				}
			}
		});

		modalInstance.result.then(function() {
			getInboxes();
		}, function() {
			// getPromotions();
		});
	};

	getZones();
})

.controller('RemoveInboxModalInstance', function($scope, $filter, $log, $uibModalInstance, idInbox, Inbox) {

	$scope.modal = {
		inbox: {
			title: ''
		}
	};

	var getInfoInbox = function() {
		Inbox.query({
			idInbox: idInbox
		}, function(success) {
			if (success.data) {
				$scope.modal.inbox.title = success.data.attributes.title;
			} else {
				$log.error('no se pudo obtener el titulo');
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	$scope.removeInbox = function() {
		Inbox.delete({
			idInbox: idInbox
		}, function(success) {
			if (!success.errors) {
				$uibModalInstance.close();
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	getInfoInbox();

});