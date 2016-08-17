'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailInboxCtrl
 * @description
 * # MailInboxCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')
  .controller('HeaderCtrl', function($scope, $state, $auth, Utils) {

    $scope.page = {
      user: {
        fullName: Utils.getInStorage('fullName'),
        image: Utils.getInStorage('image')
      }
    };

    $scope.logout = function() {

      $auth.logout()
        .then(function() {
          Utils.clearAllStorage();
          $state.go('core.login');
        });


    };

  });