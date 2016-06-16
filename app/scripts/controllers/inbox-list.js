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

	var data = [];
	var inboxIncluded = null;
	var messageActionName = null;
	var recipients = [];
	var recipientsNames = null;

	var getInboxes = function() {

		data = [];

		Inbox.query({
			include: 'message_action,recipients'
		}, function(success) {

			if (success.data) {

				inboxIncluded = success.included;

				for (i = 0; i < success.data.length; i++) {

					messageActionName = null;
					recipients = [];
					recipientsNames = '';

					for (j = 0; j < inboxIncluded.length; j++) {
						if (inboxIncluded[j].type === 'message_actions') {
							if (success.data[i].relationships.message_action.data.id === inboxIncluded[j].id) {
								messageActionName = inboxIncluded[j].attributes.name;
							}
						}
					}

					for (k = 0; k < success.data[i].relationships.recipients.data.length; k++) {
						for (j = 0; j < inboxIncluded.length; j++) {
							if (inboxIncluded[j].type === 'users') {
								if (success.data[i].relationships.recipients.data[k].id === inboxIncluded[j].id) {
									if (k === 0) {
										recipientsNames = inboxIncluded[j].attributes.first_name + ' ' + inboxIncluded[j].attributes.last_name;
									} else {
										recipientsNames = inboxIncluded[j].attributes.first_name + ' ' + inboxIncluded[j].attributes.last_name + ' <br>' + recipientsNames;
									}
								}
							}
						}
					}

					data.push({
						id: parseInt(success.data[i].id),
						messageActionId: success.data[i].relationships.message_action.data.id,
						messageActionName: messageActionName,
						title: success.data[i].attributes.title,
						sendAt: success.data[i].attributes.send_at,
						recipients: recipientsNames
					});

				}

				$scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: 50,
					filter: {
						//name: 'M'       // initial filter
					},
					sorting: {
						id: 'asc' // initial sorting
					}
				}, {
					total: data.length, // length of data
					getData: function($defer, params) {
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

				// $log.log(data);

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
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
						id: parseInt(success.data[i].id),
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name,
						email: success.data[i].attributes.email,
						roleName: success.data[i].attributes.role_name,
						roleId: success.data[i].attributes.role_id,
						active: success.data[i].attributes.active
					});
				}
				getInboxes();

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

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
			// getInboxes();
		});
	};
	
	$scope.gotoNewInbox = function(idInbox) {

		if (idInbox) {
			$state.go('app.inbox.new', {
				idInbox: idInbox
			});
		} else {
			$state.go('app.inbox.new');
		}
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