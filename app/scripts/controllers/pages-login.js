'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('LoginCtrl', function($rootScope, $scope, $state, $log, Login, Utils) {

		$scope.user = {
			username: 'pablo.lluch@gmail.com',
			password: '11111111',
			grant_type: 'password'
		};

		$scope.elements = {
			msg: {
				show: false,
				text: ''
			}
		};

		$scope.login = function() {

			Login.save({
				username: $scope.user.username,
				password: $scope.user.password,
				grant_type: $scope.user.grant_type
			}, function(success) {
				// $log.log(success);
				Utils.setInStorage('token', success.data.attributes.access_token);
				Utils.setInStorage('userid', success.data.relationships.user.data.id);
				Utils.setInStorage('fullName', success.data.relationships.user.data.full_name);
				Utils.setInStorage('role', success.data.relationships.user.data.role_id);
				Utils.setInStorage('loggedIn', true);
				Utils.setInStorage('image', success.data.relationships.user.data.image);

				if (Utils.getInStorage('role') === 1) {
					$state.go('app.playStation.reports');
				} else if (Utils.getInStorage('role') === 2) {
					$state.go('app.playStation.my-reports');
				}
				
			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					$scope.elements.msg.text = 'Usuario y/o contraseña incorrectos';
					$scope.elements.msg.show = true;
				} else {
					$scope.elements.msg.text = 'Ha ocurrido un error al loguear';
					$scope.elements.msg.show = true;
				}
			});

		};

		$scope.removeMsg = function() {
			$scope.elements.msg.show = false;
		};

	});