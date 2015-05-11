/*
* @Author: vincetam
* @Date:   2015-05-05 10:16:27
* @Last Modified by:   VINCE
* @Last Modified time: 2015-05-11 16:53:02
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
  var AppCtrl = function($scope) {
    $scope.items = ['A', 'List', 'Of', 'Items'];

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
      'trybe-app.login',
      'trybe-app.profile'
    ])

    .config(AppStateConfig)

    .controller('AppCtrl', AppCtrl);

})(angular, _);
