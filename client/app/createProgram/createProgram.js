/*
* @Author: VINCE
* @Date:   2015-07-03 17:09:46
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-03 17:22:18
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
      $scope.isCreatingWorkout = WorkoutFactory.isCreatingWorkout() !== false;
      $scope.isForProgram = WorkoutFactory.isCreatingForProgram() === true;
      console.log('workout controller - isForProgram:', $scope.isForProgram);
    }

    $scope.loadNextWorkout = function() {
      //Load next workout from user's workout program
      ProgramFactory.getTrybeWorkouts($scope.username)
        .then(function(workouts) {
          $scope.workout = workouts[0];
          //if no workouts in program, default to blank workout
          if($scope.workout === undefined) {
            $scope.createWorkout();
          }
        })
    };

    $scope.createWorkout = function(type) {
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
      if(type === 'lift') {
        $scope.placeholders.instructions = 'Build up to 5-rep max of:';
        $scope.placeholders.exercise = 'Bench';
      } else if(type !== 'lift') {
        $scope.placeholders.instructions = 'Perform 21, 15, 9 reps of:';
        $scope.placeholders.exercise = 'Pull ups';
      }

      $scope.workout = workout;
      console.log('workout module obj', $scope.workout);
    };

    $scope.addExercise = function() {
      //Set ex, sets, and reps to workout obj
      $scope.workout.exercises.push({
        exerciseName: null,
        quantity: [],
        result: null
      });

      $scope.exerciseCount++;
      console.log('updated workouts obj', $scope.workout);
    };

    $scope.printWorkoutQuantity = function (exercise) {
      var html = '';
      var quantity = exercise.quantity; //delete if works
      if (quantity !== null) {
        html = quantity[0] +' Sets, ' + quantity[1] + ' Reps';
      }
      return html;
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

      //Update workout's username entry, then post
      $scope.workout.username = AuthFactory.getUsername();

      //If workout is for posting to user's program, update trybe prop
      if($scope.isForProgram) {
        $scope.workout.trybe = $scope.workout.username + 'trybe';
      } else {
        $scope.workout.trybe = $scope.workout.username + 'log';
      }

      //If workout was accepted from program, mark completed so
      //workout is hidden from program
      if(!$scope.isForProgram) {
        ProgramFactory.completeWorkout($scope.workout);
      }

      WorkoutFactory.postWorkout($scope.workout);

      //Send user back to either program or log
      if($scope.isForProgram) {
        $state.go('program')
      } else {
        $state.go('feed');
      }
    };

    //Initialize workout for log or program
    if($scope.isCreatingWorkout) {
      $scope.loadNextWorkout();
    } else {
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
