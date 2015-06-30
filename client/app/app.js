/*
* @Author: vincetam
* @Date:   2015-05-05 10:16:27
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-29 20:00:43
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
  var AppCtrl = function($scope, $state) {

    // Add state to rootScope for use inside view templates
    // $rootScope.state = $state;

    // $rootScope.isAuthed = false;
    // $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    //   console.log('routeChangeError: ', event);
    // });
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
      'trybe-app.profile'
    ])

    .config(AppStateConfig)

    .controller('AppCtrl', AppCtrl);

})(angular, _);
