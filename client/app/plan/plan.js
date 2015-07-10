/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-10 12:33:28
*/

'use strict';

(function (angular, _) {

  /**
   * Sets viewstate for workout module
   * @param {[type]} $stateProvider [description]
   */
  var PlanStateConfig = function ($stateProvider) {
    $stateProvider
      .state('plan', {
        url: '/plan',
        templateUrl: 'plan/plan.tpl.html',
        controller: PlanCtrl
      })
  };

  /**
   * controls feed state from client side
   * @param {angular} $scope
   */
  var PlanCtrl = function ($scope, $location, $state, $window, ProgramFactory, PlanFactory, AuthFactory, NavFactory) {

    $scope.init = function() {
      if(!AuthFactory.isAuth()) {
        $state.go('login');
      } else {
        console.log('in PlanCtrl');
        $scope.data = {};
        $scope.data.workouts = [];
        $scope.data.uniqTrybes = {};
        $scope.data.trybes = [];
        $scope.data.trybe;
        $scope.data.editMode = false;
        $scope.checkboxModel = {};
        $scope.username = AuthFactory.getUsername();
        $scope.getAllWorkoutsAndTrybes();
        $scope.getPlan();
      }
    };

    $scope.initializeTrybes = function(trybe) {
      if(!$scope.data.uniqTrybes.hasOwnProperty(trybe)) {
        $scope.data.uniqTrybes[trybe] = 1;
        $scope.data.trybes.push(trybe);
      } else {
        $scope.data.uniqTrybes[trybe]++;
      }
    };

    $scope.getAllWorkoutsAndTrybes = function(trybe) {
      ProgramFactory.getAllWorkouts($scope.username)
        .then(function(allWorkouts){

          //Sort workouts by order prop
          allWorkouts.sort(function(a,b){
            if(a.order > b.order) {
              return 1;
            }
            if(a.order < b.order) {
              return -1;
            }
            return 0;
          });

          // Traverse workouts to init trybes,
          allWorkouts.forEach(function(workout){
            $scope.initializeTrybes(workout.trybe);
          });

          $scope.data.allWorkouts = allWorkouts;
          console.log('plan module workouts:', allWorkouts);

          //After retrieving all trybes' workouts, organize
          $scope.organizeByDay();
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.toggleEdit = function() {
      $scope.editMode = !$scope.editMode;
    };

    $scope.viewTrybes = function() {
      NavFactory.navigateTo('program');
    };

    $scope.savePlan = function() {
      $scope.editMode = false;

      var planReq = {
        username: $scope.username,
        plan: {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        }
      };

      //Populate plan by traversing checkboxModel
      //Loop through checkboxModel for i = number of trybes
      for(var i = 0; i < $scope.data.trybes.length; i++) {
        //Loop through 7 days, looking for true values
        for(var dayNum = 1; dayNum <= 7; dayNum++) {
          //If find true vals, push trybe to corresponding day
          if($scope.checkboxModel[i] !== undefined &&
            $scope.checkboxModel[i]['day' + dayNum]) {
            planReq['plan']['day' + dayNum].push($scope.data.trybes[i]);
          }
        }
      }

      PlanFactory.savePlanSettings(planReq);
    };

    //Enable later
    $scope.setCheckBoxModel = function() {
      var mapTrybeIndexVals = {};

      for(var index = 0; index < $scope.data.trybes.length; index++) {
        mapTrybeIndexVals[$scope.data.trybes[index]] = index;
      }

      //Run through each day
      for(var i = 1; i <= 7; i++) {
        //Find trybes of each day,
        //and corresponding arr val of it
        for(var n = 0; n < $scope.data.plan[i].length; n++) {
          //set index val === dayVal to true
          var trybe = $scope.data.plan[i][n];
          var trybeCheckBoxIndex = mapTrybeIndexVals[trybe];
          console.log('checkBoxModel trybe found:', trybe, 'for day:', i);
          console.log('trybeCheckBoxIndex:', trybeCheckBoxIndex);
          console.log('scopeCheckBoxModel', $scope.checkboxModel);
          //index vals not yet defined
          $scope.checkboxModel[trybeCheckBoxIndex]['day' + i] = true;
        }
      }
    };

    $scope.organizeByDay = function() {
      $scope.data.workouts = $scope.data.allWorkouts;

      // //Only show uncompleted workouts
      // $scope.data.workouts = $scope.data.allWorkouts.filter(function(element, index, array) {
      //   if(element.trybe === $scope.data.trybe && element.completed !== true) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // });
    };

    $scope.getPlan = function() {
      PlanFactory.getPlan($scope.username)
        .then(function(plan){
          console.log('in plan module, plan:', plan);
          $scope.data.plan = plan;
          // $scope.setCheckBoxModel(); enable later
        })
        .catch(function(error){
          console.error(error);
        });

    };

    $scope.renderWeekAndDay = function(workoutNum) {
      var html = '';
      var weeks = $scope.data.weeks;
      var days = $scope.data.days;


      var weekNum = Math.floor(workoutNum/days) + 1;
      var dayNum = workoutNum % days;

      //Account for last day of week
      if(workoutNum%days === 0) {
        dayNum = days;
        weekNum = weekNum - 1;
      }

      html = 'Week ' + weekNum + ', Day ' + dayNum;

      return html;
    },

    $scope.init();
  };

  // Entry point for module
  angular

    .module('trybe-app.plan', ['trybe-app.common'])

    .config(PlanStateConfig)

    .controller('PlanCtrl', PlanCtrl);

})(angular, _);
