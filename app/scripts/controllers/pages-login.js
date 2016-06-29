'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('LoginCtrl', function($rootScope, $scope, $state, $log, $auth, Utils) {

		$scope.page = {
			user: {
				username: '',
				password: '',
				grant_type: 'password'
			},
			message: {
				show: false,
				text: ''
			}
		};

		$scope.login = function() {

			$auth.login({
					username: $scope.page.user.username,
					password: $scope.page.user.password,
					grant_type: "password"
				})
				.then(function(success) {

					Utils.setInStorage('logged', true);
					Utils.setInStorage('refresh_t', success.data.data.attributes.refresh_token);
					$auth.setToken(success.data.data.attributes.access_token);

					Utils.setInStorage('userid', success.data.data.relationships.user.data.id);
					Utils.setInStorage('fullName', success.data.data.relationships.user.data.full_name);
					Utils.setInStorage('role', success.data.data.relationships.user.data.role_id);
					Utils.setInStorage('loggedIn', true);
					Utils.setInStorage('image', success.data.data.relationships.user.data.image);

					if (Utils.getInStorage('role') === 1) {
						$state.go('app.playStation.reports');
					} else if (Utils.getInStorage('role') === 2) {
						$state.go('app.playStation.my-reports');
					}

				})
				.catch(function(error) {
					if (error.status === 401) {
						$scope.page.message.text = 'Usuario y/o contraseña incorrectos';
						$scope.page.message.show = true;
					} else {
						$scope.page.message.text = 'Ha ocurrido un error al loguear, inténte nuevamente';
						$scope.page.message.show = true;
					}
					$log.error(error);
				});

			// Login.save({
			// 	username: $scope.user.username,
			// 	password: $scope.user.password,
			// 	grant_type: $scope.user.grant_type
			// }, function(success) {
			// 	// $log.log(success);
			// 	Utils.setInStorage('token', success.data.attributes.access_token);
			// 	Utils.setInStorage('userid', success.data.relationships.user.data.id);
			// 	Utils.setInStorage('fullName', success.data.relationships.user.data.full_name);
			// 	Utils.setInStorage('role', success.data.relationships.user.data.role_id);
			// 	Utils.setInStorage('loggedIn', true);
			// 	Utils.setInStorage('image', success.data.relationships.user.data.image);

			// 	if (Utils.getInStorage('role') === 1) {
			// 		$state.go('app.playStation.reports');
			// 	} else if (Utils.getInStorage('role') === 2) {
			// 		$state.go('app.playStation.my-reports');
			// 	}

			// }, function(error) {
			// 	$log.log(error);
			// 	if (error.status === 401) {
			// 		$scope.elements.msg.text = 'Usuario y/o contraseña incorrectos';
			// 		$scope.elements.msg.show = true;
			// 	} else {
			// 		$scope.elements.msg.text = 'Ha ocurrido un error al loguear';
			// 		$scope.elements.msg.show = true;
			// 	}
			// });

		};

		$scope.removeMsg = function() {
			$scope.page.message.show = false;
		};

	});