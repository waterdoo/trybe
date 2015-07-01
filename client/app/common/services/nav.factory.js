/*
* @Author: VINCE
* @Date:   2015-06-30 17:32:24
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-30 17:36:39
*/

'use strict';

(function (angular, _) {

  /**
   * Handles auth services for login view
   * @param {[angular]} $http
   * @param {[angular]} $location
   * @param {[angular]} $window
   */
  var NavFactory = function ($http, $location, $window, $state) {
    var navigateTo = function(destination) {
      $state.go(destination);
    };

    return {
      navigateTo: navigateTo
    };
  };

angular

  .module('trybe-app.common')

  .factory('NavFactory', NavFactory);

})(angular, _);