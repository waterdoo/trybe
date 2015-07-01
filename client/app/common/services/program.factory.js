/*
* @Author: VINCE
* @Date:   2015-06-29 19:54:34
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-30 18:17:54
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

    var getTrybeWorkouts = function(username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/individual',
        headers: { 'x-access-username': username }
      })
      .then(function (resp) {
        console.log('getMyWorkout factory resp:', resp);
        parseWorkouts(resp.data);
        var trybeWorkouts = resp.data.filter(function(element, index, array) {
          if(element.trybe === username + 'trybe') {
            return true;
          } else {
            return false;
          }
        });

        //return only workouts from user's log
        return trybeWorkouts; //sends back data to controller
      });
    };

    var removeAcceptedWorkout = function(workout) {
      return $http({
        method: 'POST',
        url: '/api/workouts/remove',
        data: workout
      })
        .then(function(response){
          console.log('Workout added', response);
          return response.data;
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
      getTrybeWorkouts: getTrybeWorkouts,
      removeAcceptedWorkout: removeAcceptedWorkout,
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

