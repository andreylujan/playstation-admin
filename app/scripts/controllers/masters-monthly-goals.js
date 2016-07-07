'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MonthlyGoalsCtrl
 * @description
 * # MonthlyGoalsCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('MonthlyGoalsCtrl', function($scope, $log, $uibModal, $filter, ngTableParams, SaleGoalUploads, Utils) {

	$scope.page = {
		title: 'Metas mensuales',
		dateSearch: {
			value: new Date()
		}
	};

	$scope.flag = false;

	var i = 0,
		j = 0;
	$scope.data = []

	$scope.getSaleGoalUploads = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.flag = false;

		$scope.data = [];

		SaleGoalUploads.query({
			year: $scope.page.dateSearch.value.getFullYear(),
			month: $scope.page.dateSearch.value.getMonth() + 2
		}, function(success) {
			// $log.log(success);

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					$scope.data.push({
						month: success.data[i].attributes.month,
						year: success.data[i].attributes.year,
						createdAt: success.data[i].attributes.created_at,
						uploadedCsv: success.data[i].attributes.uploaded_csv,
						resultCsv: success.data[i].attributes.result_csv,
						rowsSuccesses: 0,
						rowsErrors: 0
					});
				}

				var params = {
					page: 1,
					count: 25,
					filter: {
						//name: 'M'       
					},
					sorting: {
						year: 'asc',
						month: 'asc'
					}
				};

				setTableParams($scope.data, params);

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getSaleGoalUploads);
			}
		});
	};

	var setTableParams = function(data, params) {

		$scope.tableParams = new ngTableParams(params, {
			total: data.length, // length of data
			getData: function($defer, params) {
				// use build-in angular filter
				var filteredData = params.filter() ?
					$filter('filter')(data, params.filter()) :
					data;
				var orderedData = params.sorting() ?
					$filter('orderBy')(filteredData, params.orderBy()) :
					data;

				params.total(orderedData.length); // set total for recalc pagination
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});

		$scope.flag = true;

	};


	$scope.openModalNewMonthlyGoal = function(idMonthlyGoal) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'newMonthlyGoal.html',
			controller: 'NewMonthlyGoalModalInstance',
			resolve: {
				idMonthlyGoal: function() {
					return idMonthlyGoal;
				}
			}
		});

		modalInstance.result.then(function() {
			// $scope.getStockBreaks();
		}, function() {
			// $scope.getStockBreaks();
		});
	};

	$scope.getSaleGoalUploads({
		success: true,
		detail: 'OK'
	});

})

.controller('NewMonthlyGoalModalInstance', function($scope, $log, $uibModalInstance, $uibModal, idMonthlyGoal, Csv, Utils) {

	$scope.modal = {
		title: {
			text: 'Carga de metas mensuales'
		},
		subtitle: {
			text: ''
		},
		alert: {
			show: false,
			title: '',
			text: '',
			color: ''
		},
		monthlyGoal: {
			date: {
				value: new Date()
			},
			goal: {
				value: null
			},
			file: {
				value: null
			}
		},
		datepicker: {
			opened: false
		},
		buttons: {
			create: {
				text: 'Guardar',
				show: false,
				border: false
			},
			edit: {
				text: 'Editar',
				show: false,
				border: false
			},
			delete: {
				text: 'Eliminar',
				show: false,
				border: false
			}
		}
	};

	var i = 0,
		j = 0;

	$scope.openDatePicker = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.modal.datepicker.opened = !$scope.modal.datepicker.opened;
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

	$scope.createMonthlyGoal = function() {

		if ($scope.modal.monthlyGoal.file.value) {
			uploadCsvMonthlyGoals({success: true,detail: 'OK'});
		} else {

		}
	};

	var uploadCsvMonthlyGoals = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		// openModalSummaryLoadMonthlyGoal();

		var form = [{
			field: 'csv',
			value: $scope.modal.monthlyGoal.file.value
		}, {
			field: 'month',
			value: $scope.modal.monthlyGoal.date.value.getMonth() + 1
		}, {
			field: 'year',
			value: $scope.modal.monthlyGoal.date.value.getFullYear()
		}];

		Csv.upload(form).success(function(success) {
			// $log.log(success);
			$uibModalInstance.close();
			openModalSummaryLoadMonthlyGoal(success);
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(uploadCsvMonthlyGoals);
			}
		});
	};

	var openModalSummaryLoadMonthlyGoal = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summaryLoadMonthlyGoal.html',
			controller: 'SummaryLoadMonthlyGoalModalInstance',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {
			// $scope.getStockBreaks();
		}, function() {
			// $scope.getStockBreaks();
		});
	};

	if (idMonthlyGoal) {
		$scope.modal.buttons.edit.show = true;
		$scope.modal.buttons.delete.show = true;
	} else {
		$scope.modal.buttons.create.show = true;
	}

})

.controller('SummaryLoadMonthlyGoalModalInstance', function($scope, $log, $uibModalInstance, data) {

	$scope.modal = {
		title: {
			text: 'Resumen carga de metas mensuales'
		},
		subtitle: {
			text: ''
		},
		alert: {
			show: false,
			title: '',
			text: '',
			color: ''
		},
		summaryData: data,
		successes: {
			data: [],
			count: 0
		},
		errors: {
			data: [],
			count: 0
		}
	};

	var i = 0,
		j = 0;

	for (i = 0; i < data.data.length; i++) {
		// éxito
		if (data.data[i].meta.success) {
			$scope.modal.successes.count++;
			$scope.modal.successes.data.push({
				storeCode: data.data[i].meta.row_data.store_code
			});

			// error
		} else {
			$scope.modal.errors.count++;

			var storeCode = data.data[i].meta.errors.store_code ? storeCode = 'Código producto' : storeCode = null;
			var descriptionStoreCode = data.data[i].meta.errors.store_code ? descriptionStoreCode = data.data[i].meta.errors.store_code[0] : descriptionStoreCode = null;

			var monthlyGoal = data.data[i].meta.errors.monthly_goal ? monthlyGoal = 'Monto' : monthlyGoal = null;
			var descriptionMonthlyGoal = data.data[i].meta.errors.monthly_goal ? descriptionMonthlyGoal = data.data[i].meta.errors.monthly_goal[0] : descriptionMonthlyGoal = null;

			$scope.modal.errors.data.push({
				rowNumber: data.data[i].meta.row_number + 1,
				fields: [{
					name: storeCode,
					detail: descriptionStoreCode
				}, {
					name: monthlyGoal,
					detail: descriptionMonthlyGoal
				}]
			});
		}
	}

	$scope.cancel = function() {
		$uibModalInstance.close();
	};

})

.controller('CsvMonthlyGoalsSummaryModalInstance', function($scope, $log, $uibModalInstance, idProduct) {

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});