/*
* @Author: VINCE
* @Date:   2015-07-03 17:09:46
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-08 17:44:56
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
  var CreateProgramCtrl = function ($scope, $state, AuthFactory, ProgramFactory, NavFactory) {

    $scope.init = function() {
      $scope.data = {};
      $scope.username = AuthFactory.getUsername();
      $scope.isCreatingProgram = ProgramFactory.isCreatingProgram() !== false;
      console.log('isCreatingProgram: ', $scope.isCreatingProgram);
      $scope.orders = [0];

      //If creating new program, initialize workout
      if($scope.isCreatingProgram) {
        $scope.data.daysPerWeek = 3;
        $scope.initializeWorkout();
        $scope.getNextOrder();
      } else {
        //Else load user's selected workout to edit
        $scope.workout = ProgramFactory.getWorkout();
        $scope.loadTrybeWorkout();
      }
    };


    $scope.initializeWorkout = function(type) {
      type = type || 'metcon';
      $scope.exerciseCount = 0;
      $scope.temp = {};

      var workout = {
        'type':type,
        'exercises': [{
          exerciseName: null,
          quantity: [],
          result: null
        }],
        'finalResult': {
          'type': (type !== 'lift') ? 'time' : null
        },
      };

      //Initialize placeholder suggestions
      $scope.placeholders = {};
      if(type !== 'lift') {
        $scope.placeholders.instructions = 'ie. Perform 21, 15, 9 reps of:';
        $scope.placeholders.exercise = 'ie. Pull ups';
      }

      $scope.workout = workout;
      console.log('workout module obj', $scope.workout);
    };

    //Initialize default next order num
    $scope.getNextOrder = function(){
      console.log('getNextOrder $scope.orders:', $scope.orders);
      var nextOrder;

      //Determine default next workout in week/day for user
      for(var i = 0; i < $scope.orders.length; i++) {
        if($scope.orders[i+1] - $scope.orders[i] > 1) {
          nextOrder = $scope.orders[i] + 1;
          break;
        } else if (i === $scope.orders.length - 1) {
          nextOrder = $scope.orders[i] + 1;
        }
      }

      $scope.data.nextOrder = nextOrder;

      //Translate order val to week and day
      $scope.renderWeek();
      $scope.renderDay();
    };

    $scope.loadTrybeWorkout = function(){
      //Load trybe name
      $scope.data.programName = $scope.workout.trybe;

      //Load trybe schedule
      ProgramFactory.getTrybeSchedule($scope.workout.trybe)
      .then(function(schedule){
        console.log('schedule:', schedule);
        $scope.data.daysPerWeek = schedule.days;

        //Load week/day
        $scope.data.nextOrder = $scope.workout.order;
        $scope.renderWeek();
        $scope.renderDay();
      });
    };

    $scope.renderWeek = function() {
      var week = Math.floor($scope.data.nextOrder/$scope.data.daysPerWeek) + 1;

      if($scope.data.nextOrder % $scope.data.daysPerWeek === 0) {
        week = week - 1;
      }
      console.log('renderWeek week:', week);
      $scope.data.week = week;
    };

    $scope.renderDay = function() {
      var day = $scope.data.nextOrder % $scope.data.daysPerWeek;
      if($scope.data.nextOrder % $scope.data.daysPerWeek === 0) {
        day = $scope.data.daysPerWeek;
      }
      console.log('renderDay day:', day);
      $scope.data.day = day;
    };

    //Store user input workout order
    $scope.setOrderVal = function() {
      var orderVal = $scope.data.daysPerWeek * ($scope.data.week - 1) + $scope.data.day;
      console.log('createProgram module, orderVal:', orderVal);
      $scope.workout.order = orderVal;

      //Insert order val to orders array and sort
      //so getNextOrder finds correct val
      $scope.orders.push(orderVal);
      $scope.orders.sort(function(a,b){
        return a-b;
      });
    };

    $scope.refreshWorkout = function(){
      $scope.getNextOrder();
      $scope.initializeWorkout();
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

    $scope.saveUserEntries = function() {
      //If user inputs a new exercise, add for them
      if($scope.temp && $scope.temp.exName) {
        $scope.addExercise();
      }

      //If user set a final result value, save for them
      if($scope.temp && $scope.temp.finalResult) {
        $scope.workout.finalResult.value = $scope.temp.finalResult;
      }

      //Save order val to workout obj if creating program
      if($scope.isCreatingProgram) {
        $scope.setOrderVal();
      }
    };

    $scope.save = function() {
      $scope.saveUserEntries();

      //Finalize workout object
      $scope.workout.username = AuthFactory.getUsername();
      $scope.workout.trybe = $scope.data.programName;

      //Save trybe settings
      var trybeSettings = {
        username: $scope.username,
        name: $scope.data.programName,
        days: $scope.data.daysPerWeek,
        weeks: null
      };

      //If creating program, save workout trybe settings
      //Else, update workout
      if($scope.isCreatingProgram) {
        ProgramFactory.postWorkout($scope.workout)
        .then(function() {
          ProgramFactory.saveTrybeSettings(trybeSettings);
        });
      } else {
        ProgramFactory.editWorkout($scope.workout);
      }

      $scope.refreshWorkout();
    };

    $scope.finishProgram = function() {
      $scope.save();
      $state.go('program')
    };


    if (!AuthFactory.isAuth()) {
      $state.go('login');
    } else {
      $scope.init();
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
