'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('NavCtrl', function($scope, $log, Utils) {
		$scope.oneAtATime = false;

		$scope.status = {
			isFirstOpen: true,
			isSecondOpen: true,
			isThirdOpen: true
		};


		$scope.nav = {
			dashboard: {
				show: true
			},
			users: {
				show: true,
				list: {
					show: true
				},
				invite: {
					show: true
				}
			},
			reports: {
				show: true,
				reports: {
					show: true
				},
				myReportsMyTasks: {
					show: true
				}
			},
			masters: {
				show: true,
				zone: {
					show: true
				},
				dealers: {
					show: true
				},
				stores: {
					show: true
				},
				products: {
					show: true
				},
				checklists: {
					show: true
				},
				inbox: {
					show: true
				}
			},
			promotions: {
				list: {
					show: true
				}
			}
		};

		if (Utils.getInStorage('role') === 1) {
			$scope.nav.dashboard.show = true;
			$scope.nav.users.show = true;
			$scope.nav.reports.show = true;
			$scope.nav.reports.reports.show = true;
			$scope.nav.reports.myReportsMyTasks.show = true;
			$scope.nav.masters.show = true;
			$scope.nav.promotions.list.show = true;
		} else if (Utils.getInStorage('role') === 2) {
			$scope.nav.dashboard.show = false;
			$scope.nav.users.show = false;
			$scope.nav.reports.show = true;
			$scope.nav.reports.reports.show = false;
			$scope.nav.reports.myReportsMyTasks.show = true;
			$scope.nav.masters.show = false;
			$scope.nav.promotions.list.show = false;
		}

	});