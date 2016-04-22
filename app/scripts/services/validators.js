'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:Validators
 * @description
 * # Validators
 * Controller of the minovateApp
 */

angular.module('minovateApp')

.service('Validators', function() {

	var valid = false;

	this.comparePasswords = function(pass1, pass2) {
		valid = false;

		if (pass1 === pass2) {
			valid = true;
		}

		return valid;
	};

	this.validaRequiredField = function(field) {
		valid = false;
		if (field) {
			valid = true;
		}

		return valid;
	};

	this.validateStringLength = function(field, length) {
		valid = false;

		if ((typeof(field) === 'string') && (typeof(length) === 'number')) {
			if (field.length >= length) {
				valid = true;
			}
		}

		return valid;
	};

});