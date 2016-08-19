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
					minDate: $moment('2016-07-01')
				},
				startDate: currentDate,
				endDate: tomorrowDate
			}
		},
		images: []
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

	$scope.getImages = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var zoneIdSelected = $scope.page.filters.zone.selected ? $scope.page.filters.zone.selected.id : '';
		var dealerIdSelected = $scope.page.filters.dealer.selected ? $scope.page.filters.dealer.selected.id : '';
		var storeIdSelected = $scope.page.filters.store.selected ? $scope.page.filters.store.selected.id : '';
		var instructorIdSelected = $scope.page.filters.instructor.selected ? $scope.page.filters.instructor.selected.id : '';
		var supervisorIdSelected = $scope.page.filters.supervisor.selected ? $scope.page.filters.supervisor.selected.id : '';
		var categoryIdSelected = $scope.page.filters.imageCategory.selected ? $scope.page.filters.imageCategory.selected.id : '';
		var dateStartSelected = $scope.page.filters.dateRange.startDate;
		var dateEndSelected = $scope.page.filters.dateRange.endDate;
		dateStartSelected = dateStartSelected.toISOString();
		dateEndSelected = dateEndSelected.toISOString();

		$log.log(zoneIdSelected);
		$log.log(dealerIdSelected);
		$log.log(storeIdSelected);
		$log.log(instructorIdSelected);
		$log.log(supervisorIdSelected);
		$log.log(categoryIdSelected);
		$log.log(dateStartSelected);
		$log.log(dateEndSelected);

		$scope.page.images = [];

		Images.query({
			'page[number]': 1,
			'page[size]': 9999,
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
			// $log.log(success);
			if (success.data) {
				for (i = 0; i < success.data.length; i++) {
					$scope.page.images.push({
						id: success.data[i].id,
						url: success.data[i].attributes.url
					});
				}
				$log.log('$scope.page.images');
				$log.log($scope.page.images);
			}
		}, function(error) {
			$log.error(error);
		});
	};

	getZones();

	getImagesCategories();

	getUsers();

	$scope.getImages({
		success: true,
		detail: 'OK'
	});

	// LOS ELEMENTOS QUE TIENEN ESTAS CLASES DEBEN SER CON BORDER RADIOUS:
	// ui-select-match Y SU HERMANO INPUT TYPE = TEXT

});