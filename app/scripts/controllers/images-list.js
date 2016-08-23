'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ImagesListCtrl
 * @description
 * # ImagesListCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ImagesListCtrl', function($scope, $log, $state, $moment, Utils, DataPlayStation, Images) {

	var currentDate = new Date();
	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);

	var tomorrowDate = new Date();
	tomorrowDate.setHours(0);
	tomorrowDate.setMinutes(0);
	tomorrowDate.setSeconds(0);
	tomorrowDate.setMilliseconds(0);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);

	var i = 0;

	$scope.page = {
		title: 'Fotos',
		filters: {
			zone: {
				list: [],
				selected: null
			},
			dealer: {
				list: [],
				selected: null,
				disabled: false
			},
			store: {
				list: [],
				selected: null,
				disabled: false
			},
			instructor: {
				list: [],
				selected: null,
				disabled: false
			},
			supervisor: {
				list: [],
				selected: null,
				disabled: false
			},
			imageCategory: {
				list: [],
				selected: null,
				disabled: false
			},
			dateRange: {
				options: {
					minDate: $moment('2016-07-01'),
					locale: {
						applyLabel: 'Buscar',
						cancelLabel: 'Cerrar',
						fromLabel: 'Desde',
						toLabel: 'Hasta',
						customRangeLabel: 'Personalizado',
						daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
						monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
						firstDay: 1
					}
				},
				startDate: currentDate,
				endDate: tomorrowDate
			}
		},
		images: [],
		overlay: {
			show: false
		},
	};

	$scope.pagination = {
		pages: {
			actual: 1,
			size: 30,
			_current: 1,
			total: 0,
		}
	};

	var getZones = function(e) {
		DataPlayStation.getZones({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.zone.list = data.data;
			$scope.page.filters.zone.selected = data.data[0];

			$scope.getDealers({
				success: true,
				detail: 'OK'
			}, $scope.page.filters.zone.selected);

		}).catch(function(error) {
			$log.error(error);
		});
	};

	$scope.getDealers = function(e, zoneSelected) {

		$scope.page.filters.dealer.disabled = true;
		DataPlayStation.getDealers({
			success: true,
			detail: 'OK'
		}, zoneSelected).then(function(data) {
			$scope.page.filters.dealer.list = data.data;
			$scope.page.filters.dealer.selected = data.data[0];
			$scope.page.filters.dealer.disabled = false;
			$scope.getStores({
				success: true,
				detail: 'OK'
			}, $scope.page.filters.zone.selected, $scope.page.filters.dealer.selected);
		}).catch(function(error) {
			$log.error(error);
		});

		// Cada vez que se cargan los dealers, se limpia la lista de tiendas y se deselecciona la tienda anteriormente seleccionada
		$scope.page.filters.store.list = [];
		$scope.page.filters.store.selected = null;
	};

	$scope.getStores = function(e, zoneSelected, dealerSelected) {

		$scope.page.filters.store.disabled = true;
		DataPlayStation.getStores({
			success: true,
			detail: 'OK'
		}, zoneSelected, dealerSelected).then(function(data) {
			$scope.page.filters.store.list = data.data;
			$scope.page.filters.store.selected = data.data[0];
			$scope.page.filters.store.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	var getUsers = function(e) {
		$scope.page.filters.supervisor.disabled = true;
		$scope.page.filters.instructor.disabled = true;
		DataPlayStation.getUsers({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.instructor.list = data.data;
			$scope.page.filters.supervisor.list = data.data;
			$scope.page.filters.instructor.selected = $scope.page.filters.instructor.list[0];
			$scope.page.filters.supervisor.selected = $scope.page.filters.supervisor.list[0];
			$scope.page.filters.instructor.disabled = false;
			$scope.page.filters.supervisor.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	var getImagesCategories = function(e) {

		$scope.page.filters.imageCategory.disabled = true;
		DataPlayStation.getImagesCategories({
			success: true,
			detail: 'OK'
		}).then(function(data) {
			$scope.page.filters.imageCategory.list = data.data;
			$scope.page.filters.imageCategory.selected = data.data[0];
			$scope.page.filters.imageCategory.disabled = false;
		}).catch(function(error) {
			$log.error(error);
		});
	};

	$scope.incrementPage = function() {
		if ($scope.pagination.pages._current <= $scope.pagination.pages.total - 1) {
			$scope.pagination.pages._current++;
			$scope.getImages({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pages._current);
		}
	};

	$scope.decrementPage = function() {
		if ($scope.pagination.pages._current > 1) {
			$scope.pagination.pages._current--;
			$scope.getImages({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pages._current);
		}
	};

	$scope.getImages = function(e, page) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$log.log('page ' + page);

		$scope.page.overlay.show = true;

		var zoneIdSelected = $scope.page.filters.zone.selected ? $scope.page.filters.zone.selected.id : '';
		var dealerIdSelected = $scope.page.filters.dealer.selected ? $scope.page.filters.dealer.selected.id : '';
		var storeIdSelected = $scope.page.filters.store.selected ? $scope.page.filters.store.selected.id : '';
		var instructorIdSelected = $scope.page.filters.instructor.selected ? $scope.page.filters.instructor.selected.id : '';
		var supervisorIdSelected = $scope.page.filters.supervisor.selected ? $scope.page.filters.supervisor.selected.id : '';
		var categoryIdSelected = $scope.page.filters.imageCategory.selected ? $scope.page.filters.imageCategory.selected.id : '';
		var dateStartSelected = $scope.page.filters.dateRange.startDate;
		var dateEndSelected = $scope.page.filters.dateRange.endDate;

		dateStartSelected = moment($scope.page.filters.dateRange.startDate, "DD/MM/YYYY");
		dateEndSelected = moment($scope.page.filters.dateRange.endDate, "DD/MM/YYYY");

		dateStartSelected = dateStartSelected.toISOString();
		dateEndSelected = dateEndSelected.toISOString();

		// $log.log(zoneIdSelected);
		// $log.log(dealerIdSelected);
		// $log.log(storeIdSelected);
		// $log.log(instructorIdSelected);
		// $log.log(supervisorIdSelected);
		// $log.log(categoryIdSelected);
		// $log.log(dateStartSelected);
		// $log.log(dateEndSelected);

		$scope.page.images = [];

		Images.query({
			'page[number]': page,
			'page[size]': $scope.pagination.pages.size,
			include: 'category',
			zone_id: zoneIdSelected,
			dealer_id: dealerIdSelected,
			store_id: storeIdSelected,
			instructor_id: instructorIdSelected,
			supervisor_id: supervisorIdSelected,
			start_date: dateStartSelected,
			end_date: dateEndSelected,
			category_id: categoryIdSelected
		}, function(success) {
			$scope.pagination.pages.total = success.meta.page_count;

			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.page.images.push({
						id: success.data[i].id,
						url: success.data[i].attributes.url
					});
				}
			}
			$scope.page.overlay.show = false;
		}, function(error) {
			$log.error(error);
		});
	};

	angular.element('#daterange').on('apply.daterangepicker', function(ev, picker) {
		$scope.getImages({
			success: true,
			detail: 'OK'
		}, $scope.pagination.pages._current);
	});

	getZones();

	getImagesCategories();

	getUsers();

	$scope.getImages({
		success: true,
		detail: 'OK'
	}, $scope.pagination.pages._current);

});