'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailInboxCtrl
 * @description
 * # MailInboxCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('HeaderCtrl', function($scope, $state, Utils) {

  	$scope.page = {
  		user: {
        fullName: Utils.getInStorage('fullName'),
  			image: Utils.getInStorage('image')
  		}
  	};

    $scope.logout = function() {

      Utils.setInStorage('token', null);
      Utils.setInStorage('userid', null);
      Utils.setInStorage('fullName', null);
      Utils.setInStorage('role', null);
      Utils.setInStorage('loggedIn', false);
      Utils.setInStorage('image', null);

      $state.go('core.login');

    };

  });