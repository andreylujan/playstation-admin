'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('UsersListCtrl', function($scope, $log, $filter, $modal, ngTableParams, Users) {

	$scope.page = {
		title: 'Lista de usuarios'
	};

	$scope.users = [];

	$scope.getUsers = function() {

		$scope.users = [];

		Users.query({
			idUser: 'all'
		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.users.push({
						id: success.data[i].id,
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						email: success.data[i].attributes.email,
						roleName: success.data[i].attributes.role_name,
					});
				}
			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

		$scope.tableParams = new ngTableParams({
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				firstName: 'asc' // initial sorting
			}
		}, {
			total: $scope.users.length, // length of $scope.users
			getData: function($defer, params) {
				// use build-in angular filter
				var orderedData = params.sorting() ?
					$filter('orderBy')($scope.users, params.orderBy()) :
					$scope.users;

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});

	};

	$scope.getUsers();

	$scope.openModalUserDetails = function(idUser) {

		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'userDetails.html',
			controller: 'UserDetailsInstance',
			resolve: {
				idUser: function() {
					return idUser;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

})

.controller('UserDetailsInstance', function($scope, $log, $modalInstance, idUser, Users, Roles, Validators) {

	$scope.user = {
		id: null,
		email: {
			text: '',
			disabled: true
		},
		image: '',
		firstName: {
			text: '',
			disabled: true
		},
		lastName: {
			text: '',
			disabled: true
		},
		rut: {
			text: '',
			disabled: true
		},
		role: {
			id: null,
			text: '',
			disabled: true
		},
		phoneNumber: {
			text: '',
			disabled: true
		}
	};
	$scope.roles = [];
	$scope.elements = {
		buttons: {
			editUser: {
				text: 'Editar',
				border: 'btn-border'
			},
			removeUser: {
				text: 'Eliminar',
				border: 'btn-border'
			}
		},
		title: '',
		alert: {
			show: false,
			title: '',
			text: '',
			color: '',
		}
	};

	$scope.ok = function() {
		// $modalInstance.close($scope.selected.item);
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.getUserDetails = function(idUser) {

		Users.query({
			idUser: idUser
		}, function(success) {
			if (success.data) {

				$scope.elements.title = success.data.attributes.first_name + ' ' + success.data.attributes.last_name;

				$scope.user.id = success.data.id;
				$scope.user.firstName.text = success.data.attributes.first_name;
				$scope.user.lastName.text = success.data.attributes.last_name;
				$scope.user.email.text = success.data.attributes.email;
				$scope.user.role.id = success.data.attributes.role_id;
				$scope.user.role.text = success.data.attributes.role_name;
				$scope.user.phoneNumber.text = success.data.attributes.phone_number;
				$scope.user.rut.text = success.data.attributes.rut;

				if (success.data.attributes.image) {
					$scope.user.image = success.data.attributes.image;
				} else {
					$scope.user.image = 'images/placeholder-user-photo.png';
				}

			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
		});

	};

	$scope.getUserDetails(idUser);

	var getRoles = function() {
		$scope.roles = [];

		Roles.query({
			idOrganization: 1
		}, function(success) {
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
		});
	};

	getRoles();

	$scope.editUser = function(idUser) {

		if ($scope.elements.buttons.editUser.text === 'Editar') {
			$scope.elements.buttons.editUser.text = 'Guardar';
			$scope.elements.buttons.editUser.border = '';
			enableFormInputs();
		} else {
			$scope.elements.buttons.editUser.text = 'Editar';
			$scope.elements.buttons.editUser.border = 'btn-border';

			// $log.log($scope.user.firstName.text);
			// $log.log($scope.user.lastName.text);
			// $log.log($scope.user.rut.text);
			// $log.log($scope.user.phoneNumber.text);
			// $log.log($scope.user.role.id);

			if (!Validators.validaRequiredField($scope.user.firstName.text) || !Validators.validaRequiredField($scope.user.lastName.text) || !Validators.validaRequiredField($scope.user.role.id)) {
				$scope.elements.alert.show = true;
				$scope.elements.alert.title = 'Faltan datos por rellenar';
				$scope.elements.alert.text = '';
				$scope.elements.alert.color = 'danger';
				return;
			}

			Users.update({
				data: {
					type: 'users',
					id: idUser,
					attributes: {
						first_name: $scope.user.firstName.text,
						last_name: $scope.user.lastName.text,
						rut: $scope.user.rut.text,
						phone_number: $scope.user.phoneNumber.text,
						image: '',
						role_id: $scope.user.role.id
					}
				},
				idUser: idUser
			}, function(success) {
				if (success.data) {
					$scope.elements.alert.show = true;
					$scope.elements.alert.title = 'Se han actualizado los datos del usuario';
					$scope.elements.alert.text = '';
					$scope.elements.alert.color = 'success';

					disableFormInputs();

					$scope.getUserDetails(idUser);

				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.log(error);
			});

		}

	};

	$scope.removeUser = function(idUser) {

		if ($scope.elements.buttons.removeUser.text === 'Eliminar') {
			$scope.elements.buttons.removeUser.text = 'Si, eliminar';

			$scope.elements.buttons.removeUser.border = '';
			$scope.elements.alert.show = true;
			$scope.elements.alert.title = '¿Seguro que desea eliminar al usuario?';
			$scope.elements.alert.text = 'Para eliminarlo, vuelva a presionar el botón';
			$scope.elements.alert.color = 'danger';

		} else {
			$scope.elements.buttons.removeUser.text = 'Eliminar';

			Users.delete({
				idUser: idUser
			}, function(success) {
				if (success.data) {
					// $log.log(success);

					// HACER QUE SE REFRESQUE LA LISTA DE USUARIOS!!!
				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.log(error);
			});

			$scope.ok();

		}

	};

	var enableFormInputs = function() {
		$scope.user.firstName.disabled = false;
		$scope.user.lastName.disabled = false;
		$scope.user.rut.disabled = false;
		$scope.user.phoneNumber.disabled = false;
		$scope.user.role.disabled = false;
	};

	var disableFormInputs = function() {
		$scope.user.firstName.disabled = true;
		$scope.user.lastName.disabled = true;
		$scope.user.rut.disabled = true;
		$scope.user.phoneNumber.disabled = true;
		$scope.user.role.disabled = true;
	};

	$scope.hideAlert = function() {
		$scope.elements.alert.show = false;
		$scope.elements.alert.title = '';
		$scope.elements.alert.text = '';
		$scope.elements.alert.color = '';
	};

});