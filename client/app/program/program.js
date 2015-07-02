/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 14:11:28
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
  var ProgramCtrl = function ($scope, $location, $state, $window, ProgramFactory, WorkoutFactory, AuthFactory, NavFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        $scope.data = {};
        $scope.username = AuthFactory.getUsername();
        $scope.getTrybeWorkouts();
      }
    };

    $scope.getTrybeWorkouts = function() {
      ProgramFactory.getTrybeWorkouts($scope.username)
        .then(function(data){
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data;
          console.log('program module getTrybeWorkouts: ', $scope.data);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.renderWeekAndDay = function(workoutNum) {
      var html = '';
      var weeks = $scope.data.weeks || 12;
      var days = $scope.data.days || 4;

      var weekNum = Math.floor(workoutNum/days);
      var dayNum = workoutNum % days;

      html = 'Week ' + weekNum + ', Day ' + dayNum;

      return html;
    },

    //Sends workout data from user's selection to workout
    //module so user can log workout
    $scope.addWorkout = function(index) {
      var isNewWorkout;
      var selection;
      var isForProgram;

      //If user selected a pre-existing workout,
      //save workout and send to workout factory
      if(index !== undefined) {
        selection = $scope.data.workouts[index];
        isNewWorkout = false;
        isForProgram = false;
      } else {
        selection = null;
        isNewWorkout = true;
        isForProgram = true;
      }
      console.log('selected workout:', selection);
      WorkoutFactory.sendWorkout(selection, isNewWorkout, isForProgram);
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
