'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesSignupCtrl
 * @description
 * # PagesSignupCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('SignupCtrl', function($scope, $log, $state, $window, Users, InviteLink) {

		// $log.log($state.params.confirmation_token);

		$scope.page = {
			elements: {
				saveBtn: {
					disabled: false
				},
				msg: {
					color: '',
					text: '',
					show: true
				}
			}
		};

		$scope.newUser = {
			email: '',
			rut: '',
			firstName: '',
			lastName: '',
			// address: '',
			phoneNumber: '',
			password: '',
			passwordConfirmation: '',
			picture: ''
		};

		var acceptInvitation = false;

		$scope.acceptInvitation = function() {

			$log.log($state.params.id);
			$log.log($state.params.confirmation_token);

			InviteLink.update({
				id: $state.params.id,
				confirmation_token: $state.params.confirmation_token,
				data: {
					type: "invitations",
					id: ($state.params.id).toString(),
					attributes: {
						accepted: true
					}
				}
			}, function(success) {
				$log.log(success);

				if (success.data) {
					// saveAccount();

					$scope.newUser.email = success.data.attributes.email;

					acceptInvitation = true;
				} else {
					$window.alert('No se ha podido aceptar la invitación');
					acceptInvitation = false;
				}

			}, function(error) {
				$log.log(error);
				$window.alert('No se ha podido aceptar la invitación');
				acceptInvitation = false;
			});

		};

		$scope.acceptInvitation();

		$scope.saveAccount = function() {

			// $log.log('Se intenta crear cuenta');

			// $log.log($scope.newUser.password);
			// $log.log($scope.newUser.passwordConfirmation);

			if (acceptInvitation) {

				$scope.page.elements.saveBtn.disabled = true;

				Users.save({
					confirmation_token: $state.params.confirmation_token,
					data: {
						type: "users",
						attributes: {
							email: $scope.newUser.email,
							first_name: $scope.newUser.rut,
							last_name: $scope.newUser.firstName,
							rut: $scope.newUser.lastName,
							password: $scope.newUser.password,
							password_confirmation: $scope.newUser.passwordConfirmation,
							phone_number: $scope.newUser.phoneNumber,
							picture: "",
							role_id: 1
						}
					}
				}, function(success) {
					$log.log(success);

					if (success.data) {
						$scope.page.elements.msg.color = 'greensea';
						$scope.page.elements.msg.text = 'Usuario creado exitosamente';
						$scope.page.elements.msg.show = true;
					} else {
						$scope.page.elements.msg.color = 'danger';
						$scope.page.elements.msg.text = success.errors[0].detail;
						$scope.page.elements.msg.show = true;
					}

				}, function(error) {
					$log.log(error);

					$scope.page.elements.msg.color = 'danger';
					$scope.page.elements.msg.text = 'No se ha podido crear el usuario';
					$scope.page.elements.msg.show = true;
				});
			}

		};

		$scope.removeMsg = function() {
			$scope.page.elements.msg.color = '';
			$scope.page.elements.msg.text = '';
			$scope.page.elements.msg.show = false;
		};

	});