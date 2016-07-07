'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NewInboxCtrl
 * @description
 * # NewInboxCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('NewInboxCtrl', function($scope, $filter, $log, $window, $moment, $uibModal, $stateParams, $state, Inbox, Users, Validators, MessageActions, Utils) {

	var i = 0,
		j = 0;

	$scope.page = {
		title: 'Nuevo mensaje',
		html: {
			value: '',
			disabled: false
		},
		subject: {
			text: '',
			disabled: false
		},
		users: [],
		user: {
			selectedUser: [],
			disabled: false
		},
		messageActions: [],
		messageAction: {
			selectedMessageAction: [],
			disabled: false
		},
		dateTimePicker: {
			date: new Date(),
			open: false,
			disabled: false
		},
		checkSendImmediate: {
			disabled: false
		},
		checkSendToAll: {
			disabled: false
		},
		buttons: {
			sendInbox: {
				show: true
			}
		}
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
					if (success.data[i].attributes.active) {
						$scope.page.users.push({
							type: 'users',
							id: success.data[i].id,
							firstName: success.data[i].attributes.first_name,
							lastName: success.data[i].attributes.last_name,
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}
				$scope.page.user.selectedUser = $scope.page.users[0];

				getMessageActions({
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

	var getMessageActions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.messageActions = [];

		MessageActions.query({}, function(success) {

			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					if (success.data[i].id !== '4') {
						$scope.page.messageActions.push({
							type: 'message_actions',
							id: success.data[i].id,
							name: success.data[i].attributes.name
						});
					}
				}
				$scope.page.messageAction.selectedMessageAction = $scope.page.messageActions[0];

				if ($stateParams.idInbox) {
					getInfoInbox($stateParams.idInbox, {
						success: true,
						detail: 'OK'
					});
					$scope.page.dateTimePicker.disabled = true;
					$scope.page.checkSendImmediate.disabled = true;
					$scope.page.checkSendToAll.disabled = true;
					$scope.page.user.disabled = true;
					$scope.page.messageAction.disabled = true;
					$scope.page.subject.disabled = true;
					$scope.page.html.disabled = true;
					$scope.page.buttons.sendInbox.show = false;
				} else {
					$scope.page.dateTimePicker.disabled = false;
					$scope.page.checkSendImmediate.disabled = false;
					$scope.page.checkSendToAll.disabled = false;
					$scope.page.user.disabled = false;
					$scope.page.messageAction.disabled = false;
					$scope.page.subject.disabled = false;
					$scope.page.html.disabled = false;
					$scope.page.buttons.sendInbox.show = true;
				}

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getMessageActions);
			}
		});
	};

	var getInfoInbox = function(idInbox, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Inbox.query({
			idInbox: idInbox,
			include: 'message_action,recipients'
		}, function(success) {
			if (success.data) {
				selectInfoPromotion(success.data);
			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getInfoInbox);
			}
		});
	};

	var selectInfoPromotion = function(data) {

		var dateCreatedAt = new Date(data.attributes.created_at);
		var day = dateCreatedAt.getUTCDate();
		var month = dateCreatedAt.getUTCMonth();
		var year = dateCreatedAt.getUTCFullYear();
		var hour = dateCreatedAt.getUTCHours();
		var minutes = dateCreatedAt.getUTCMinutes();

		$scope.page.dateTimePicker.date = new Date(year, month, day, hour, minutes);

		$scope.page.user.selectedUser = [];

		for (i = 0; i < $scope.page.users.length; i++) {
			if (data.relationships.recipients.data.length > 0) {
				for (j = 0; j < data.relationships.recipients.data.length; j++) {
					if (parseInt($scope.page.users[i].id) === parseInt(data.relationships.recipients.data[j].id)) {
						$scope.page.user.selectedUser.push($scope.page.users[i]);
						break;
					}
				}
				break;
			}
		}

		$scope.page.user.selectedMessageAction = [];

		for (i = 0; i < $scope.page.messageActions.length; i++) {
			if (parseInt($scope.page.messageActions[i].id) === parseInt(data.relationships.message_action.data.id)) {
				$scope.page.user.selectedMessageAction = $scope.page.messageActions[i];
				break;
			}
		}

		$scope.page.subject.text = data.attributes.title;
		$scope.page.html.value = data.attributes.html;
	};

	$scope.createInbox = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var users = [];

		for (i = 0; i < $scope.page.user.selectedUser.length; i++) {
			users.push({
				id: $scope.page.user.selectedUser[i].id,
				type: $scope.page.user.selectedUser[i].type
			});
		}

		if (!$scope.checkSentToAll) {
			if (users.length === 0) {
				openModalMessage('Debe indicar al menos un usuario');
				return;
			}
		}
		if (!$scope.checkSendImmediate) {
			if (!Validators.validaRequiredField($scope.page.dateTimePicker.date)) {
				openModalMessage('Debe indicar la fecha de envío del mensaje');
				return;
			}
		}

		if (!Validators.validaRequiredField($scope.page.subject.text)) {
			openModalMessage('Debe indicar el asunto del mensaje');
			return;
		}
		if (!Validators.validaRequiredField($scope.page.html.value)) {
			openModalMessage('Debe indicar el cuerpo del mensaje');
			return;
		}

		if (!$stateParams.idInbox) {
			Inbox.save({
				data: {
					type: 'broadcasts',
					attributes: {
						title: $scope.page.subject.text,
						html: '<style>body{background-color: #fbfbfb !important; color: #3f5b71 !important;}p>span{background-color: #fbfbfb !important;color: #3f5b71 !important;}p>strong {background-color: #fbfbfb !important;color: #3f5b71 !important;}img {width: 100% !important;height: auto !important;}ol>li>span{background-color: #fbfbfb !important;}</style><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' + $scope.page.html.value + '</html>',
						// Este campo es OPCIONAL, por mientra no lo pesques
						// resource_id: 1,
						// Este campo también es opcional, si NO se manda se envían los mensajes al tiro
						// Si se fija, se enviarán en la fecha indicada
						send_at: $scope.page.dateTimePicker.date,
						is_immediate: $scope.checkSendImmediate, // indica si se envia de inmediato
						send_to_all: $scope.checkSentToAll // indica si se envia a todos los users
					},
					relationships: {
						recipients: {
							data: users
						},
						message_action: {
							data: {
								type: 'message_actions',
								id: $scope.page.messageAction.selectedMessageAction.id
							}
						}
					}
				}
			}, function(success) {
				openModalMessage('Se ha enviado el mensaje con éxito');
				$state.go('app.inbox.list');
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.createInbox);
				}
			});
		}
	};

	var openModalMessage = function(title) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageModal.html',
			controller: 'MessageNewInboxModalInstance',
			resolve: {
				title: function() {
					return title;
				}
			}
		});

		modalInstance.result.then(function() {
			// $scope.getInboxes();
		}, function() {
			// $scope.getInboxes();
		});
	};

	$scope.openCalendar = function(e) {
		$scope.page.dateTimePicker.open = true;
	};

	getUsers({
		success: true,
		detail: 'OK'
	});

})

.controller('MessageNewInboxModalInstance', function($scope, $log, $uibModalInstance, title) {

	$scope.modal = {
		message: {
			title: title
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});