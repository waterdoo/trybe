/*
* @Author: justinwebb
* @Date:   2015-05-04 15:54:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-27 13:59:50
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
        $scope.getMyWorkouts();
      }
    };

    $scope.getAllWorkouts = function() {
      WorkoutFactory.getWorkouts($scope.username)
        .then(function(data) {
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
          console.log('FeedCtrl getWorkouts: ', $scope.data);
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getMyWorkouts = function() {
      WorkoutFactory.getMyWorkouts($scope.username)
        .then(function(data){
          //reverse workout data so it's ordered by recency
          $scope.data.workouts = data.reverse();
        })
        .catch(function(error){
          console.error(error);
        });
    };

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
