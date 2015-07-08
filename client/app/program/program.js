/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-08 16:07:22
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
  var ProgramCtrl = function ($scope, $location, $state, $window, ProgramFactory, AuthFactory, NavFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        $scope.data = {};
        $scope.data.workouts = [];
        $scope.data.trybes = {};
        $scope.data.trybe = 'all';
        $scope.username = AuthFactory.getUsername();
        $scope.getAllWorkoutsAndTrybes();
        $scope.getSchedule();
      }
    };

    $scope.initializeTrybes = function(trybe) {
      if(!$scope.data.trybes.hasOwnProperty(trybe)) {
        $scope.data.trybes[trybe] = true;
      }
    };


    $scope.getAllWorkoutsAndTrybes = function(trybe) {
      ProgramFactory.getAllWorkouts($scope.username)
        .then(function(allWorkouts){

          //Sort workouts by order prop
          allWorkouts.sort(function(a,b){
            if(a.order > b.order) {
              return 1;
            }
            if(a.order < b.order) {
              return -1;
            }
            return 0;
          });

          // Traverse workouts to init trybes,
          // and show only uncompleted workouts from one trybe
          allWorkouts.forEach(function(workout){
            $scope.initializeTrybes(workout.trybe);
          });

          $scope.data.allWorkouts = allWorkouts;

          $scope.filterWorkouts();
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.filterWorkouts = function() {
      //If rendering all workouts, show all
      if($scope.data.trybe === 'all') {
        $scope.data.workouts = $scope.data.allWorkouts.filter(function(element) {
          if(element.completed !== true) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        //Only show uncompleted workouts from one trybe
        $scope.data.workouts = $scope.data.allWorkouts.filter(function(element, index, array) {
          if(element.trybe === $scope.data.trybe && element.completed !== true) {
            return true;
          } else {
            return false;
          }
        });
      }
    };

    //TO DO: pulls schedule for each trybe
    $scope.getSchedule = function() {
      ProgramFactory.getTrybeSchedule('NorCal S&C On-Ramp')
        .then(function(schedule){
          $scope.data.days = schedule.days || 5;
          $scope.data.weeks = schedule.weeks || 12;
          console.log('in program module, schedule retrieved:', schedule);
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
      //Else load blank workout
        selection = null;
        isNewWorkout = true;
        isForProgram = true;
      }
      console.log('selected workout:', selection);
      ProgramFactory.sendWorkout(selection, isNewWorkout, isForProgram);
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
