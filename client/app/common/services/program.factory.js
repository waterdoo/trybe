/*
* @Author: VINCE
* @Date:   2015-06-29 19:54:34
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-06 18:47:44
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

    var getTrybeSchedule = function(username) {
      return $http({
        method: 'GET',
        url: '/api/trybes/schedule',
        headers: { 'x-access-username': username }
      })
      .then(function(resp) {
        console.log('in getTrybeSchedule, resp:', resp);
        return resp.data;
      });
    };

    var getAllWorkouts = function(username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/individual',
        headers: { 'x-access-username': username }
      })
      .then(function (resp) {
        console.log('in program factory, getAllWorkouts:', resp);
        parseWorkouts(resp.data);

        return resp.data; //sends back data to controller
      });
    };

    var completeWorkout = function(workout) {
      return $http({
        method: 'POST',
        url: '/api/workouts/complete',
        data: workout
      })
        .then(function(response){
          console.log('Workout added', response);
          return response.data;
        });
    };

    //Saves to local storage. Used for selecting workout from program
    //to send to createProgram module
    var sendWorkout = function(selection, isNew) {
      workout = selection;
      isNewWorkout = isNew;
      localStorage.setItem(this.selection, JSON.stringify(workout));
      console.log('WorkoutFactory\tsendWorkout: ', workout);
    };

    var postWorkout = function(workout) {
      console.log('program factory, post workout, workout:', workout);
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

    var isCreatingProgram = function() {
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
      getTrybeSchedule: getTrybeSchedule,
      getAllWorkouts: getAllWorkouts,
      completeWorkout: completeWorkout,
      sendWorkout: sendWorkout,
      postWorkout: postWorkout,
      getWorkout: getWorkout,
      selection: workoutSelectionStore,
      isCreatingProgram: isCreatingProgram,
      parseWorkouts: parseWorkouts
    };
  };

angular

  .module('trybe-app.common')

  .factory('ProgramFactory', ProgramFactory);

})(angular, _);

