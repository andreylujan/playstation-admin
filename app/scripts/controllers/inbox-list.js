'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('InboxListCtrl', function($scope, $filter, $log, $window, $state, $uibModal, NgTableParams, Inbox, Zones, Dealers, Users, Utils) {

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

	var getInboxes = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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
						recipients: recipientsNames,
						sendToAll: success.data[i].attributes.send_to_all
					});

				}

				$scope.tableParams = new NgTableParams({
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
					dataset: data
				});

				// $log.log(data);

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getInboxes);
			}
		});
	};

	var getZones = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		zones = [];

		Zones.query({}, function(success) {
			for (var i = 0; i < success.data.length; i++) {
				zones.push({
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}

			getDealers({
				success: true,
				detail: 'OK'
			});

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getZones);
			}
		});
	};

	var getDealers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		dealers = [];

		Dealers.query({}, function(success) {
			for (var i = 0; i < success.data.length; i++) {
				dealers.push({
					id: parseInt(success.data[i].id),
					name: success.data[i].attributes.name
				});
			}

			getUsers({
				success: true,
				detail: 'OK'
			});

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getDealers);
			}
		});
	};

	var getUsers = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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
				getInboxes({
					success: true,
					detail: 'OK'
				});

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			}
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
			getInboxes({
				success: true,
				detail: 'OK'
			});
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

	getZones({
		success: true,
		detail: 'OK'
	});
})

.controller('RemoveInboxModalInstance', function($scope, $filter, $log, $uibModalInstance, idInbox, Inbox, Utils) {

	$scope.modal = {
		inbox: {
			title: ''
		}
	};

	var getInfoInbox = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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
			if (error.status === 401) {
				Utils.refreshToken(getInfoInbox);
			}
		});
	};

	$scope.removeInbox = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

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
			if (error.status === 401) {
				Utils.refreshToken($scope.removeInbox);
			}
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	getInfoInbox({
		success: true,
		detail: 'OK'
	});

});