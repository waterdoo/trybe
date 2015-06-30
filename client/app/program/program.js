/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-29 20:13:45
*/

'use strict';

(function (angular, _) {

  /**
   * Sets viewstate for workout module
   * @param {[type]} $stateProvider [description]
   */
  var ProgramStateConfig = function ($stateProvider) {
    $stateProvider
      .state('program', {
        url: '/program',
        templateUrl: 'program/program.tpl.html',
        controller: ProgramCtrl
      })
  };

  /**
   * controls feed state from client side
   * @param {angular} $scope
   */
  var ProgramCtrl = function ($scope, $location, $state, $window, ProgramFactory, AuthFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        $scope.data = {};
        $scope.username = AuthFactory.getUsername();
        $scope.getMyWorkouts();
      }
    };

    $scope.getAllWorkouts = function() {
      ProgramFactory.getWorkouts($scope.username)
        .then(function(data) {
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
          console.log('FeedCtrl getAllWorkouts: ', $scope.data);
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getMyWorkouts = function() {
      ProgramFactory.getMyWorkouts($scope.username)
        .then(function(data){
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
          console.log('FeedCtrl getMyWorkouts: ', $scope.data);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.renderDate = function(workout) {
      var html = '';
      var rawDate = workout.date;

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      var day = rawDate.slice(8,10);
      var monthNum = Number(rawDate.slice(5,7)) - 1;
      var month = months[monthNum];
      var year = rawDate.slice(0,4);

      html = month + ' ' + day + ', ' + year;

      return html;
    },

    //Sends workout data from user's selection to workout
    //module so user can log workout
    $scope.log = function(index) {
      var isNewWorkout;
      var selection;

      //If user selected a pre-existing workout,
      //save workout and send to workout factory
      if(index !== undefined) {
        selection = $scope.data.workouts[index];
        isNewWorkout = false;
      } else {
        selection = null;
        isNewWorkout = true;
      }
      console.log('selected workout:', selection);
      ProgramFactory.sendWorkout(selection, isNewWorkout);
      $state.go('workout');
    };

    $scope.init();
  };

  // Entry point for module
  angular

    .module('trybe-app.program', ['trybe-app.common'])

    .config(ProgramStateConfig)

    .controller('ProgramCtrl', ProgramCtrl);

})(angular, _);
