/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 15:09:32
*/

'use strict';

(function (angular, _) {

  /**
   * Sets viewstate for workout module
   * @param {[type]} $stateProvider [description]
   */
  var PlanStateConfig = function ($stateProvider) {
    $stateProvider
      .state('plan', {
        url: '/plan',
        templateUrl: 'plan/plan.tpl.html',
        controller: PlanCtrl
      })
  };

  /**
   * controls feed state from client side
   * @param {angular} $scope
   */
  var PlanCtrl = function ($scope, $location, $state, $window, ProgramFactory, AuthFactory, NavFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        console.log('in PlanCtrl');
        $scope.data = {};
        $scope.data.workouts = [];
        $scope.data.uniqTrybes = {};
        $scope.data.trybes = [];
        $scope.data.trybe;
        $scope.username = AuthFactory.getUsername();
        $scope.getAllWorkoutsAndTrybes();
      }
    };

    $scope.initializeTrybes = function(trybe) {
      if(!$scope.data.uniqTrybes.hasOwnProperty(trybe)) {
        $scope.data.uniqTrybes[trybe] = 1;
        $scope.data.trybes.push(trybe);
      } else {
        $scope.data.uniqTrybes[trybe]++;
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
          allWorkouts.forEach(function(workout){
            $scope.initializeTrybes(workout.trybe);
          });

          $scope.data.allWorkouts = allWorkouts;

          //After retrieving all trybes' workouts, filter
          $scope.filterWorkouts();
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.viewTrybes = function() {
      NavFactory.navigateTo('program');
    };

    $scope.filterWorkouts = function() {
      //If user hasn't chosen trybe, choose trybe with most workouts
      if(!$scope.data.trybe) {
        var max = 0;
        for(var trybe in $scope.data.uniqTrybes) {
          if($scope.data.uniqTrybes[trybe] > max) {
            max = $scope.data.uniqTrybes[trybe];
            $scope.data.trybe = trybe;
          }
        }
      }

      //Only show uncompleted workouts from one trybe
      $scope.data.workouts = $scope.data.allWorkouts.filter(function(element, index, array) {
        if(element.trybe === $scope.data.trybe && element.completed !== true) {
          return true;
        } else {
          return false;
        }
      });

      //Render each trybe's specific schedule
      $scope.getSchedule();
    };

    $scope.getSchedule = function() {
      ProgramFactory.getTrybeSchedule($scope.data.trybe)
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

    .module('trybe-app.plan', ['trybe-app.common'])

    .config(PlanStateConfig)

    .controller('PlanCtrl', PlanCtrl);

})(angular, _);
