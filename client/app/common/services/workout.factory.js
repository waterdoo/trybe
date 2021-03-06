/*
* @Author: vincetam
* @Date:   2015-05-06 18:01:45
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-11 10:31:07
*/

'use strict';
(function (angular, _) {

  /**
   * Handles auth services for login view
   * @param {[angular]} $http
   * @param {[angular]} $location
   * @param {[angular]} $window
   */
  var WorkoutFactory = function ($http, $location, $window) {
    var workout;
    var isNewWorkout;
    var isForProgram;
    var workoutSelectionStore = 'com.trybe.selectedWorkout';
    var localStorage = $window.localStorage;

    var getWorkouts = function (username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/all', //change to all
        headers: { 'x-access-username': username}
      })
      .then(function (resp) {
        console.log('getWorkouts factory resp:', resp);
        parseWorkouts(resp.data);
        return resp.data; //sends back data to controller
      });
    };

    var getLogWorkouts = function(username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/individual',
        headers: { 'x-access-username': username }
      })
      .then(function (resp) {
        console.log('getLogWorkouts factory resp:', resp);
        parseWorkouts(resp.data);
        var logWorkouts = resp.data.filter(function(element, index, array) {
          if(element.trybe === username + 'log') {
            return true;
          } else {
            return false;
          }
        });

        //return only workouts from user's log
        return logWorkouts; //sends back data to controller
      });
    };

    //saves to local storage and designates purpose of workout--
    //either new workout, redo previous, or for program
    var sendWorkout = function(selection, isNew, forProgram) {
      workout = selection;
      isNewWorkout = isNew;
      isForProgram = forProgram;
      localStorage.setItem(this.selection, JSON.stringify(workout));
      console.log('WorkoutFactory sendWorkout: ', workout);
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

    var isCreatingForProgram = function() {
      return isForProgram;
    }

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
      getLogWorkouts: getLogWorkouts,
      sendWorkout: sendWorkout,
      postWorkout: postWorkout,
      getWorkout: getWorkout,
      selection: workoutSelectionStore,
      isCreatingWorkout: isCreatingWorkout,
      isCreatingForProgram: isCreatingForProgram,
      parseWorkouts: parseWorkouts
    };
  };

angular

  .module('trybe-app.common')

  .factory('WorkoutFactory', WorkoutFactory);

})(angular, _);

