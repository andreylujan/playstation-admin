'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:Utils
 * @description
 * # Utils
 * Controller of the minovateApp
 */

angular.module('minovateApp')

.service('Utils', function($state, localStorageService) {

	this.setInStorage = function(key, val) {
		return localStorageService.set(key, val);
	};

	this.getInStorage = function(key) {
		return localStorageService.get(key);
	};

	this.gotoPage = function(page) {
		$state.go(page);
	};

});