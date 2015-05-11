/*
* @Author: justinwebb
* @Date:   2015-05-04 15:54:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-05-11 17:57:38
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
      if(AuthFactory.isAuth()) {
        console.log('auth found user');
        $scope.data = {};
        $scope.username = AuthFactory.getUsername();
        console.log('Feed username:', $scope.username);
        $scope.getAllWorkouts();
      } else {
        $state.go('login');
      }
    };

    $scope.getAllWorkouts = function() {
      // $scope.data.workouts = dummyData;
      WorkoutFactory.getWorkouts($scope.username)
        .then(function(data) {
          $scope.data.workouts = data.workouts;
          console.log('FeedCtrl\tgetWorkouts: ', $scope.data.workouts);
        })
        .catch(function(error) {
          console.error(error);
        });
    };

    $scope.getMyWorkouts = function() {
      WorkoutFactory.getMyWorkouts($scope.username) //change to $scope.userID
        .then(function(data){
          $scope.data.workouts = data;
          console.log('workouts after viewMe called:', $scope.data);
        })
        .catch(function(error){
          console.error(error);
        });
      // $scope.apply();
    };

    //Sends workout data from user's selection to workout
    //module so user can log workout
    $scope.log = function(index) {
      var selection = $scope.data.workouts[index];
      console.log('selected workout:', selection);
      WorkoutFactory.sendWorkout(selection);
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
