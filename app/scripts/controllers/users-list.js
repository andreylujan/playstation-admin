'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('UsersListCtrl', function($scope, $filter, ngTableParams) {

		$scope.page = {
			title: 'Lista de usuarios'
		};

		$scope.getUsers = function() {

			var data = [{
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 2,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 3,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 4,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 5,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 6,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 7,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 8,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 9,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 10,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 11,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 12,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 13,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 14,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 15,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 16,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				id: 17,
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}];

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: 10, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: data.length, // length of data
				getData: function($defer, params) {
					// use build-in angular filter
					var orderedData = params.sorting() ?
						$filter('orderBy')(data, params.orderBy()) :
						data;

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});

		};

		$scope.getUsers();


		$scope.openModalUserDetails = function(idUser) {

			var modalInstance = $uibModal.open({
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

	});