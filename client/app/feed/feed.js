/*
* @Author: justinwebb
* @Date:   2015-05-04 15:54:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-30 15:43:07
*/

'use strict';
(function (angular, _) {

  /**
   * Sets viewstate for workout module
   * @param {[type]} $stateProvider [description]
   */
  var FeedStateConfig = function ($stateProvider) {
    $stateProvider.state('feed', {
      url: '/feed',
      templateUrl: 'feed/feed.tpl.html',
      controller: FeedCtrl
    });
  };

  /**
   * controls feed state from client side
   * @param {angular} $scope
   */
  var FeedCtrl = function ($scope, $location, $state, $window, WorkoutFactory, AuthFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        $scope.data = {};
        $scope.username = AuthFactory.getUsername();
        $scope.getLogWorkouts();
      }
    };

    $scope.getAllWorkouts = function() {
      WorkoutFactory.getWorkouts($scope.username)
        .then(function(data) {
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
          console.log('FeedCtrl getAllWorkouts: ', $scope.data);
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getLogWorkouts = function() {
      WorkoutFactory.getLogWorkouts($scope.username)
        .then(function(data){
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
          console.log('FeedCtrl getLogWorkouts: ', $scope.data);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.renderDate = function(workout) {
      var html = '';
      var rawDate = workout.date;

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      var day = rawDate.slice(8,10);
      var monthNum = Number(rawDate.slice(5,7)) - 1;
      var month = months[monthNum];
      var year = rawDate.slice(0,4);

      html = month + ' ' + day + ', ' + year;

      return html;
    },

    //Sends workout data from user's selection to workout
    //module so user can log workout
    $scope.log = function(index) {
      var isNewWorkout;
      var selection;

      //If user selected a pre-existing workout,
      //save workout and send to workout factory
      if(index !== undefined) {
        selection = $scope.data.workouts[index];
        isNewWorkout = false;
      } else {
        selection = null;
        isNewWorkout = true;
      }
      console.log('selected workout:', selection);
      WorkoutFactory.sendWorkout(selection, isNewWorkout);
      $state.go('workout');
    };

    $scope.init();
  };

  // Entry point for module
  angular

    .module('trybe-app.feed', ['trybe-app.common'])

    .config(FeedStateConfig)

    .controller('FeedCtrl', FeedCtrl);

})(angular, _);
