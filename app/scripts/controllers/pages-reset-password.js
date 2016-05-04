'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ResetPasswordCtrl', function($scope, $log, $stateParams, Users, ResetPassword, Validators) {

		$scope.user = {
			token: '',
			password: '',
			passwordConfirmation: ''
		};

		$scope.page = {
			msg: {
				color: '',
				text: '',
				show: false
			}
		};

		var passLength = 8;

		$scope.validateToken = function() {

			if (!Validators.validateStringLength($scope.user.password, passLength)) {
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = 'Las debe tener ' + passLength + ' caracteres como mínimo';
				$scope.page.msg.show = true;
				return;
			}

			if (!Validators.comparePasswords($scope.user.password, $scope.user.passwordConfirmation)) {
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = 'Las contraseñas no coinciden';
				$scope.page.msg.show = true;
				return;
			}

			Users.verifyPassToken({
				idUser: 'verify',
				email: $stateParams.email,
				reset_password_token: $scope.user.token
			}, function(success) {
				// $log.log(success);

				if (success.data) {
					resetPass();
				} else {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				}

			}, function(error) {
				$log.log(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.data.errors[0].detail;
				$scope.page.msg.show = true;
			});

		};

		var resetPass = function() {

			ResetPassword.update({
				idOrganization: 1,
				password: $scope.user.password,
				password_confirmation: $scope.user.passwordConfirmation,
				reset_password_token: $scope.user.token
			}, function(success) {
				$log.log(success);

				if (success.data) {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				}
			}, function(error) {
				$log.log(error);

				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.data.errors[0].detail;
				$scope.page.msg.show = true;
			});

		};

		$scope.resetPassword = function() {

			ResetPassword.save({
				email: $scope.user.email
			}, function(success) {
				// $log.log(success);

				// Si el servicio se ejecuta (200) pero lanza un error de validacion
				if (success.errors) {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				} else {
					$scope.page.msg.color = 'greensea';
					$scope.page.msg.text = 'Te hemos enviado un correo con instrucciones, si el correo no aparece por favor revisa tu carpeta de spam';
					$scope.page.msg.show = true;
				}

			}, function(error) {
				$log.log(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.errors[0].detail;
				$scope.page.msg.show = true;
			});
		};

		$scope.removeMsg = function() {
			$scope.page.msg.color = '';
			$scope.page.msg.text = '';
			$scope.page.msg.show = false;
		};

	});