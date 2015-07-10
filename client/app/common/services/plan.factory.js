/*
* @Author: VINCE
* @Date:   2015-07-09 16:51:31
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-10 11:00:28
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
    var getPlan = function(username) {
      return $http({
        method: 'GET',
        url: '/api/plans',
        headers: { 'x-access-username': username}
      })
      .then(function(resp) {
        console.log('in PlanFactory getPlan, resp:', resp);
        return resp.data;
      });
    };

    var savePlanSettings = function(plan) {
      console.log('plan factory, savePlanSettings');
      return $http({
        method: 'POST',
        url: '/api/plans/',
        data: plan
      })
        .then(function(response){
          console.log('Plan set', response);
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
      getPlan: getPlan,
      savePlanSettings: savePlanSettings,
      parseWorkouts: parseWorkouts
    };
  };

angular

  .module('trybe-app.common')

  .factory('PlanFactory', PlanFactory);

})(angular, _);
