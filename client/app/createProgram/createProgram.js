/*
* @Author: VINCE
* @Date:   2015-07-03 17:09:46
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-03 17:41:09
*/

'use strict';
(function (angular, _) {

  /**
   * Sets viewstate for workout module
   * @param {[type]} $stateProvider [description]
   */
  var CreateProgramStateConfig = function ($stateProvider) {

    $stateProvider

      .state('createProgram', {
        url: '/createProgram',
        templateUrl: 'createProgram/createProgram.tpl.html',
        controller: CreateProgramCtrl
      })
  };

  /**
   * Controls interactions in workout view.  Enables user to
   * veiw read only details of workout.  Allows user to
   * record workout results.
   * @param {angular} $scope
   */
  var CreateProgramCtrl = function ($scope, $state, AuthFactory, WorkoutFactory, ProgramFactory, NavFactory) {

    if (!AuthFactory.isAuth()) {
      $state.go('login');
    } else {
      $scope.username = AuthFactory.getUsername();
      $scope.isEdittingWorkout = WorkoutFactory.isCreatingWorkout() !== false;
      $scope.isForProgram = true;
    }

    $scope.initializeWorkout = function(type) {
      type = type || 'metcon';
      $scope.exerciseCount = 0;
      $scope.temp = {};
      var workout = {
        'type':type,
        'exercises':[],
        'finalResult':{
        'type': (type !== 'lift') ? 'time' : null,
        }
      };
      workout.exercises.push({
        exerciseName: null,
        quantity: [],
        result: null
      });

      //Initialize placeholder suggestions
      $scope.placeholders = {};
      if(type !== 'lift') {
        $scope.placeholders.instructions = 'Perform 21, 15, 9 reps of:';
        $scope.placeholders.exercise = 'Pull ups';
      }

      $scope.workout = workout;
      console.log('workout module obj', $scope.workout);
    };

    //Add exercise to lift workout
    $scope.addExercise = function() {
      //Set ex, sets, and reps to workout obj
      $scope.workout.exercises.push({
        exerciseName: null,
        quantity: [],
        result: null
      });
      $scope.exerciseCount++;
    };

    $scope.setResultType = function(type) {
      $scope.workout.finalResult.type = type;
    };

    $scope.log = function() {
      //If user inputs a new exercise, add for them
      if($scope.temp && $scope.temp.exName) {
        $scope.addExercise();
      }

      //If user set a final result value, save for them
      if($scope.temp && $scope.temp.finalResult) {
        $scope.workout.finalResult.value = $scope.temp.finalResult;
      }

      //Update workout's username and trybe
      $scope.workout.username = AuthFactory.getUsername();
      $scope.workout.trybe = $scope.workout.username + 'trybe';

      WorkoutFactory.postWorkout($scope.workout);

      $state.go('program')
    };

    //Initialize workout for log or program
    if($scope.isEdittingWorkout) {
      $scope.initializeWorkout();
    } else {
      //TO DO: Load user's selected workout to edit
      $scope.workout = WorkoutFactory.getWorkout();
    }
  };

  // Entry point for module
  angular

    .module('trybe-app.createProgram', [
      'trybe-app.common'
    ])

    .config(CreateProgramStateConfig)

    .controller('CreateProgramCtrl', CreateProgramCtrl);

})(angular, _);
