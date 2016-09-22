'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
	.controller('MyReportsCtrl', function($scope, $log, NgTableParams, $filter, $window, Utils, Reports) {

		$scope.page = {
			title: 'Mis Reportes',
			prevBtn: {
				disabled: true
			},
			myReportsMysTasksSel: [{
				id: 1,
				name: 'Mis Reportes'
			}, {
				name: 'Mis Tareas',
				id: 2
			}]
		};

		$scope.pagination = {
			reports: {
				pages: {
					actual: 1,
					size: 30,
					_current: 1,
					total: 0,
				},
				total: 0
			}
		};
		$scope.pageSize = 30;

		$scope.option = $scope.page.myReportsMysTasksSel[0];

		var reports = [];
		var zones = [];
		var dealers = [];
		var stores = [];
		var loggedUserId = Utils.getInStorage('userid');
		var i, j;
		$scope.currentPage = 0;

		$scope.decrementPage = function() {
			if ($scope.pagination.reports.pages._current > 1) {
				$scope.pagination.reports.pages._current--;
				$scope.getMyreports({
					success: true,
					detail: 'OK'
				}, $scope.pagination.reports.pages._current, $scope.pageSize);
			}
		};

		$scope.incrementPage = function() {
			if ($scope.pagination.reports.pages._current <= $scope.pagination.reports.total - 1) {
				$scope.pagination.reports.pages._current++;
				$scope.getMyreports({
					success: true,
					detail: 'OK'
				}, $scope.pagination.reports.pages._current, $scope.pageSize);
			}
		};

		$scope.getMyreports = function(e, page, pageSize) {
			// Valida si el parametro e.success se seteó true para el refresh toke
			if (!e.success) {
				$log.error(e.detail);
				return;
			}

			if ($scope.option.id === 1) {

				Reports.query({
					'page[number]': page,
					'page[size]': pageSize,
					'filter[creator_id]': loggedUserId
				}, function(success) {

					if (success.data) {

						reports = [];
						$scope.pagination.reports.total = success.meta.page_count;

						for (i = 0; i < success.data.length; i++) {
							reports.push({
								id: success.data[i].id,
								reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
								createdAt: success.data[i].attributes.created_at,
								limitDate: success.data[i].attributes.limit_date,
								zoneName: success.data[i].attributes.zone_name,
								dealerName: success.data[i].attributes.dealer_name,
								storeName: success.data[i].attributes.store_name,
								creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
								pdfUploaded: success.data[i].attributes.pdf_uploaded,
								pdf: success.data[i].attributes.pdf
							});
						}

						$scope.tableParams = new NgTableParams({
							count: reports.length,
							sorting: {}
						}, {
							dataset: reports,
							counts: [],
							total: reports.length
						});

					} else {
						$log.error(success);
					}
				}, function(error) {
					$log.error(error);
					if (error.status === 401) {
						Utils.refreshToken($scope.getMyreports);
					}
				});

			} else if ($scope.option.id === 2) {

				Reports.query({
					'page[number]': page,
					'page[size]': pageSize,
					'filter[assigned_user_id]': loggedUserId
				}, function(success) {

					if (success.data) {

						reports = [];
						$scope.pagination.reports.total = success.meta.page_count;

						for (i = 0; i < success.data.length; i++) {
							reports.push({
								id: success.data[i].id,
								reportTypeName: success.data[i].attributes.dynamic_attributes.report_type_name,
								createdAt: success.data[i].attributes.created_at,
								limitDate: success.data[i].attributes.limit_date,
								zoneName: success.data[i].attributes.zone_name,
								dealerName: success.data[i].attributes.dealer_name,
								storeName: success.data[i].attributes.store_name,
								creatorName: success.data[i].attributes.dynamic_attributes.creator_name,
								pdfUploaded: success.data[i].attributes.pdf_uploaded,
								pdf: success.data[i].attributes.pdf
							});
						}

						$scope.tableParams = new NgTableParams({
							count: reports.length,
							sorting: {}
						}, {
							dataset: reports,
							counts: [],
							total: reports.length
						});

					} else {
						$log.error(success);
					}
				}, function(error) {
					$log.error(error);
				});
			}
		};

		$scope.downloadPdf = function() {
			var pdf = angular.element(event.target).data('pdf');
			if (pdf) {
				$window.open(pdf, '_blank');
			}
		};

		$scope.getMyreports({
			success: true,
			detail: 'OK'
		}, 1, $scope.pageSize);

	});