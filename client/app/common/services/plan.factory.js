/*
* @Author: VINCE
* @Date:   2015-07-09 16:51:31
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-16 17:50:10
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
        return resp.data;
      });
    };

    var getTrybeSchedules = function(trybes) {
      return $http({
        method: 'GET',
        url: '/api/trybes/schedules',
        headers: { 'x-access-trybes': trybes}
      })
      .then(function(resp) {
        return resp.data;
      });
    };

    var savePlanSettings = function(plan) {
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

    return {
      getPlan: getPlan,
      getTrybeSchedules: getTrybeSchedules,
      savePlanSettings: savePlanSettings,
    };
  };

angular

  .module('trybe-app.common')

  .factory('PlanFactory', PlanFactory);

})(angular, _);
