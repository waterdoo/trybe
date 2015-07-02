/*
* @Author: vincetam
* @Date:   2015-05-05 10:16:27
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-01 17:31:15
*/

'use strict';

(function (angular, _) {

  /**
   * Sets config for module
   * @param {angular} $stateProvider
   * @param {angular} $urlRouterProvider
   */
  var AppStateConfig = function($stateProvider, $urlRouterProvider){
    $stateProvider.state('root', {
      url: '/feed',
      controller: AppCtrl
    });

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/feed');
  };

  /**
   * Entry point for application. Loads all client-side dependencies
   * @param {angular} $scope
   */
  var AppCtrl = function($scope, $state, NavFactory) {

    $scope.go = function(destination) {
      NavFactory.navigateTo(destination);
    }

  };

  //Entry point for for module
  angular

    .module('trybe-app', [
      // angular modules
      'ngAnimate',
      'ui.router',

      // app modules
      'templates-app',
      'trybe-app.workout',
      'trybe-app.feed',
      'trybe-app.program',
      'trybe-app.login',
      'trybe-app.profile',
      'trybe-app.common'
    ])

    .config(AppStateConfig)

    .controller('AppCtrl', AppCtrl);

})(angular, _);
