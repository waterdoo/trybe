/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-06 12:58:30
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
        $scope.getSchedule();
        $scope.getTrybeWorkouts();
      }
    };

    $scope.getSchedule = function() {
      ProgramFactory.getTrybeSchedule($scope.username)
        .then(function(schedule){
          $scope.data.days = schedule.days || 5;
          $scope.data.weeks = schedule.weeks || 12;
          console.log('in program module, schedule retrieved:', schedule);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.getTrybeWorkouts = function() {
      ProgramFactory.getTrybeWorkouts($scope.username)
        .then(function(data){
          //sort workouts by order prop
          data.sort(function(a,b){
            if(a.order > b.order) {
              return 1;
            }
            if(a.order < b.order) {
              return -1;
            }
            return 0;
          });
          $scope.data.workouts = data;
          console.log('program module getTrybeWorkouts: ', $scope.data);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.renderWeekAndDay = function(workoutNum) {
      var html = '';
      var weeks = $scope.data.weeks;
      var days = $scope.data.days;


      var weekNum = Math.floor(workoutNum/days) + 1;
      var dayNum = workoutNum % days;

      //Account for last day of week
      if(workoutNum%days === 0) {
        dayNum = days;
        weekNum = weekNum - 1;
      }

      html = 'Week ' + weekNum + ', Day ' + dayNum;

      return html;
    },

    //Sends workout data from user's selection to createProgram module
    $scope.editProgram = function(index) {
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
      $state.go('createProgram');
    };

    $scope.init();
  };

  // Entry point for module
  angular

    .module('trybe-app.program', ['trybe-app.common'])

    .config(ProgramStateConfig)

    .controller('ProgramCtrl', ProgramCtrl);

})(angular, _);
