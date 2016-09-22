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
				},
				createTask: {
					show: true
				},
				taskTracking: {
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
				show: true,
				new: {
					show: true
				},
				list: {
					show: true
				},
				tracking: {
					show: true
				}
			},
			inbox: {
				show: true
			},
			images: {
				show: true
			}
		};

		if (Utils.getInStorage('role') === 1) { //SUPERVISOR
			$scope.nav.dashboard.show = true;
			$scope.nav.users.show = true;
			$scope.nav.reports.show = true;
			$scope.nav.reports.reports.show = true;
			$scope.nav.reports.myReportsMyTasks.show = true;
			$scope.nav.reports.createTask.show = true;
			$scope.nav.reports.taskTracking.show = true;
			$scope.nav.masters.show = true;
			$scope.nav.promotions.show = true;
			$scope.nav.promotions.list.show = true;
			$scope.nav.promotions.new.show = true;
			$scope.nav.promotions.tracking.show = true;
			$scope.nav.inbox.show = true;
			$scope.nav.images.show = true;
		} else if (Utils.getInStorage('role') === 2) { //PROMOTOR
			$scope.nav.dashboard.show = false;
			$scope.nav.users.show = false;
			$scope.nav.reports.show = true;
			$scope.nav.reports.reports.show = false;
			$scope.nav.reports.myReportsMyTasks.show = true;
			$scope.nav.reports.createTask.show = false;
			$scope.nav.reports.taskTracking.show = false;
			$scope.nav.masters.show = false;
			$scope.nav.promotions.show = false;
			$scope.nav.promotions.list.show = false;
			$scope.nav.promotions.new.show = false;
			$scope.nav.promotions.tracking.show = false;
			$scope.nav.inbox.show = false;
			$scope.nav.images.show = false;
		} else if (Utils.getInStorage('role') === 3) { // INSTRUCTOR
			$scope.nav.dashboard.show = true;
			$scope.nav.users.show = true;
			$scope.nav.reports.show = true;
			$scope.nav.reports.reports.show = true;
			$scope.nav.reports.myReportsMyTasks.show = true;
			$scope.nav.reports.createTask.show = true;
			$scope.nav.reports.taskTracking.show = true;
			$scope.nav.masters.show = true;
			$scope.nav.promotions.show = true;
			$scope.nav.promotions.list.show = true;
			$scope.nav.promotions.new.show = true;
			$scope.nav.promotions.tracking.show = true;
			$scope.nav.inbox.show = true;
			$scope.nav.images.show = true;
		}

	});