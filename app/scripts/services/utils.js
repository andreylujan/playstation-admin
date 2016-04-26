'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:Utils
 * @description
 * # Utils
 * Controller of the minovateApp
 */

angular.module('minovateApp')

.service('Utils', function($state, $log, localStorageService) {

	this.setInStorage = function(key, val) {
		return localStorageService.set(key, val);
	};

	this.getInStorage = function(key) {
		return localStorageService.get(key);
	};

	this.gotoPage = function(page) {
		$state.go(page);
	};

	this.escapeRegExp = function(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	this.replaceAll = function(str, find, replace) {
		return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
	};

	this.formatRut = function(rut) {

		if (rut.indexOf('.') !== -1 || rut.indexOf('-') !== -1 || rut.indexOf(',') !== -1) {
			rut = this.replaceAll(rut, ',', '');
			rut = this.replaceAll(rut, '.', '');
			rut = this.replaceAll(rut, '-', '');
		}

		var sRut1 = rut; //contador de para saber cuando insertar el . o la -
		var nPos = 0; //Guarda el rut invertido con los puntos y el guión agregado
		var sInvertido = ""; //Guarda el resultado final del rut como debe ser
		var sRut = "";

		for (var i = sRut1.length - 1; i >= 0; i--) {
			sInvertido += sRut1.charAt(i);

			if (i === sRut1.length - 1) {
				sInvertido += "-";
			} else if (nPos === 3) {
				sInvertido += ".";
				nPos = 0;
			}
			nPos++;
		}

		for (var j = sInvertido.length - 1; j >= 0; j--) {
			if (sInvertido.charAt(sInvertido.length - 1) !== ".") {
				sRut += sInvertido.charAt(j);
			} else if (j !== sInvertido.length - 1) {
				sRut += sInvertido.charAt(j);
			}
		}
		//Pasamos al campo el valor formateado
		rut = sRut.toUpperCase();
		return rut;
	};


});