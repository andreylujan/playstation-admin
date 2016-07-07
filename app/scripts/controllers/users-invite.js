'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('UsersInviteCtrl', function($scope, $log, $window, Invitations, Roles) {

	$scope.page = {
		title: 'Invitar Usuarios',
		formGroups: {
			invite: [{
				faIcon: 'plus',
				email: '',
				index: 0,
				roleId: null,
				showIcon: false
			}]
		},
		msg: {
			show: false,
			text: '',
			color: ''
		}
	};

	$scope.roles = [];
	$scope.responseInvitations = [];

	var getRoles = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.roles = [];

		Roles.query({
			idOrganization: 1
		}, function(success) {
			// $log.log(success);

			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.roles.push({
						name: success.data[i].attributes.name,
						id: success.data[i].id,
						index: i
					});
				}
			} else {
				$log.log('error al obtener los roles');
			}

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getRoles);
			}
		});

	};

	getRoles({
		success: true,
		detail: 'OK'
	});

	$scope.validateMailAndRol = function(index) {

		if ($scope.page.formGroups.invite[index].email && $scope.page.formGroups.invite[index].roleId) {
			$scope.page.formGroups.invite[index].showIcon = true;
		}

		// $log.log('index...' + index);
		// $log.log('mail model...' + $scope.page.formGroups.invite[index].email);
		// $log.log('role model...' + $scope.page.formGroups.invite[index].roleId);
	};

	$scope.addFormGroup = function(index) {

		if (index === ($scope.page.formGroups.invite.length - 1)) {
			$scope.page.formGroups.invite.push({
				faIcon: 'plus',
				email: '',
				index: index + 1,
				roleId: null
			});

			// Cambia los iconos que tienen signo "+" por el icono "-" a todos MENOS el último
			for (var i = 0; i < $scope.page.formGroups.invite.length - 1; i++) {
				$scope.page.formGroups.invite[i].faIcon = 'minus';
			}

		} else {
			$scope.page.formGroups.invite.splice(index, 1);
		}

	};

	$scope.sendInvitations = function(e) {

		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		// $log.log($scope.page.formGroups.invite);

		$scope.responseInvitations = [];
		$scope.page.msg.color = 'orange-ps';
		$scope.page.msg.show = true;
		$scope.page.msg.text = 'Se han enviado las invitaciones a:';
		/* jshint ignore:start */
		for (var i = 0; i < $scope.page.formGroups.invite.length; i++) {

			Invitations.save({
				"data": {
					"type": "invitations",
					"attributes": {
						"role_id": $scope.page.formGroups.invite[i].roleId,
						"email": $scope.page.formGroups.invite[i].email
					}
				}
			}, function(success) {
				// $log.log(success);

				if (success.data) {
					$scope.responseInvitations.push({
						color: 'greensea',
						icon: 'check',
						email: success.data.attributes.email
					});
				} else {
					$scope.responseInvitations.push({
						color: 'danger',
						icon: 'times',
						// email: success.data.attributes.email
						email: success.errors[0].title
					});
				}

			}, function(error) {
				$log.log(error);

				if (error.status === 401) {
					Utils.refreshToken($scope.sendInvitations);
				}

				$scope.responseInvitations.push({
					color: 'danger',
					icon: 'times',
					email: error.data.errors[0].detail
				});

			});
		}
		/* jshint ignore:end */

		clearFormGroups();

	};

	var clearFormGroups = function() {
		$scope.page.formGroups.invite = [];
		$scope.page.formGroups.invite.push({
			faIcon: 'plus',
			email: '',
			index: 0,
			roleId: null,
			showIcon: false
		});

	};


});