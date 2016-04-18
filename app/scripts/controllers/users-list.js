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
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
				userName: 'Usuario',
				email: 'email@ejemplo.com'
			}, {
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

	});