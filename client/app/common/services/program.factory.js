/*
* @Author: VINCE
* @Date:   2015-06-29 19:54:34
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-29 20:19:22
*/

'use strict';
(function (angular, _) {

  /**
   * Handles auth services for login view
   * @param {[angular]} $http
   * @param {[angular]} $location
   * @param {[angular]} $window
   */
  var ProgramFactory = function ($http, $location, $window) {
    var workout;
    var isNewWorkout;
    var workoutSelectionStore = 'com.trybe.selectedWorkout';
    var localStorage = $window.localStorage;

    var dummyWorkouts = [
      {
        date: '2015-06-30T02:18:02.000Z',
        description: 'Skills: Back lever practice with knees tucked in, and german hangs. Handstand practice. WOD: 10! HSPUs, German Hangs/Back Lever practice for ~5 seconds',
        exercises: [
          {
            WorkoutId: 24,
            createdAt: '2015-06-30T02:18:02.000Z',
            exerciseName: null,
            id: 25,
            quantity: '[]',
            result: null
          }
        ],
        finalResult: {
          type: 'time',
          value: null
        },
        title: 'Workout 1',
        type: 'metcon',
        completed: false
      }
    ]

    var getWorkouts = function (username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/all',
        headers: { 'x-access-username': username}
      })
      .then(function (resp) {
        console.log('getWorkouts factory resp:', resp);
        parseWorkouts(resp.data);
        return resp.data; //sends back data to controller
      });
    };

    var getMyWorkouts = function(username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/individual',
        headers: { 'x-access-username': username }
      })
      .then(function (resp) {
        console.log('getMyWorkout factory resp:', resp);
        parseWorkouts(resp.data);
        // return resp.data;
        //temp use dummy data
        return dummyWorkouts;
      });
    };

    //saves to local storage
    var sendWorkout = function(selection, isNew) {
      workout = selection;
      isNewWorkout = isNew;
      localStorage.setItem(this.selection, JSON.stringify(workout));
      console.log('WorkoutFactory\tsendWorkout: ', workout);
    };

    var postWorkout = function(workout) {
      return $http({
        method: 'POST',
        url: '/api/workouts',
        data: workout
      })
        .then(function(response){
          console.log('Workout added', response);
          return response.data;
        });
      };

    var getWorkout = function() {
      if (workout === undefined) {
        workout = JSON.parse(localStorage.getItem(this.selection));
      }
      console.log('getWorkout retrieved', workout);
      return workout;
    };

    var isCreatingWorkout = function() {
      return isNewWorkout;
    };

    var parseWorkouts = function(resp) {
      resp.forEach(function(workout){
        if(workout.type === 'lift') {
          workout.exercises.forEach(function(ex){
            ex.quantity = JSON.parse(ex.quantity);
          });
        } else {
          workout.finalResult = JSON.parse(workout.finalResult);
        }
      });
    };

    return {
      getWorkouts: getWorkouts,
      getMyWorkouts: getMyWorkouts,
      sendWorkout: sendWorkout,
      postWorkout: postWorkout,
      getWorkout: getWorkout,
      selection: workoutSelectionStore,
      isCreatingWorkout: isCreatingWorkout,
      parseWorkouts: parseWorkouts
    };
  };

angular

  .module('trybe-app.common')

  .factory('ProgramFactory', ProgramFactory);

})(angular, _);

