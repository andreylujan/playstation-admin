'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ImagesListCtrl
 * @description
 * # ImagesListCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('ImagesListCtrl', function($scope, $log, $state, Zones, Utils) {

	$scope.page = {
		title: 'Fotos',
		filters: {
			zones: {
				list: [],
				selected: null
			},
			dealers: {
				list: [],
				selected: null
			},
			stores: {
				list: [],
				selected: null
			},
			categories: {
				list: [],
				selected: null
			}
		}
	};

	$scope.setAlertProperties = function() {

	};

	var getZones = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.page.filters.zones.list = [];

		Zones.query({}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.page.filters.zones.list.push({
						id: parseInt(success.data[i].id),
						name: success.data[i].attributes.name,
						dealersIds: success.data[i].attributes.dealer_ids
					});
				}
				$scope.page.filters.zones.selected = $scope.page.filters.zones.list[0];

				// $scope.getDealers({
				// 	success: true,
				// 	detail: 'OK'
				// });

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getZones);
			}
		});
	};

	getZones({
		success: true,
		detail: 'OK'
	});

	// LOS ELEMENTOS QUE TIENEN ESTAS CLASES DEBEN SER CON BORDER RADIOUS:
	// ui-select-match Y SU HERMANO INPUT TYPE = TEXT

});