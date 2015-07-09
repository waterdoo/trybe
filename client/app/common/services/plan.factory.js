/*
* @Author: VINCE
* @Date:   2015-07-09 16:51:31
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 16:53:55
*/

'use strict';
(function (angular, _) {

  /**
   * Handles auth services for login view
   * @param {[angular]} $http
   * @param {[angular]} $location
   * @param {[angular]} $window
   */
  var PlanFactory = function ($http, $location, $window) {
    var getTrybeSchedule = function(trybeName) {
      return $http({
        method: 'GET',
        url: '/api/trybes/schedule',
        headers: { 'x-access-trybe': trybeName }
      })
      .then(function(resp) {
        console.log('in getTrybeSchedule, resp:', resp);
        return resp.data;
      });
    };

    var getAllWorkouts = function(username) {
      return $http({
        method: 'GET',
        url: '/api/workouts/all',
        headers: { 'x-access-username': username }
      })
      .then(function (resp) {
        console.log('in plan factory, getAllWorkouts:', resp);
        parseWorkouts(resp.data);
        return resp.data; //sends back data to controller
      });
    };


    var saveTrybeSettings = function(settings) {
      console.log('plan factory, saveTrybeSettings');
      return $http({
        method: 'POST',
        url: '/api/trybes/schedule',
        data: settings
      })
        .then(function(response){
          console.log('Workout added', response);
          return response.data;
        });
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
      saveTrybeSettings: saveTrybeSettings,
      parseWorkouts: parseWorkouts
    };
  };

angular

  .module('trybe-app.common')

  .factory('PlanFactory', PlanFactory);

})(angular, _);
