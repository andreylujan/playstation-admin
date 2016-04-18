'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('ResetPasswordCtrl', function($scope, $log, Users, ResetPassword) {

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

		$scope.validateToken = function() {

			Users.query({
				email: 'atroncoso@ewin.cl',
				reset_password_token: $scope.user.token
			}, function(success) {
				$log.log(success);

				// SI SE HIZO LA CONSULTA BIEN
				resetPass();

			}, function(error) {
				$log.log(error);
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
			}, function(error) {
				$log.log(error);
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