/*
* @Author: VINCE
* @Date:   2015-06-29 19:49:20
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-16 17:43:04
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
        $scope.data.trybeSchedules = {};
        $scope.data.editMode = false;
        $scope.checkboxModel = {};
        $scope.username = AuthFactory.getUsername();
        $scope.getAllWorkoutsAndTrybes();
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
          $scope.getTrybeSchedules();
          $scope.getPlan();
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.initializeTrybes = function(trybe) {
      if(!$scope.data.uniqTrybes.hasOwnProperty(trybe)) {
        $scope.data.uniqTrybes[trybe] = 1;
        $scope.data.trybes.push(trybe);
      } else {
        $scope.data.uniqTrybes[trybe]++;
      }
    };

    //Get trybe schedules by sending array of trybes
    //Save days/wk into $scope.data.trybeSchedules obj
    $scope.getTrybeSchedules = function() {
      PlanFactory.getTrybeSchedules($scope.data.trybes)
        .then(function(schedules){
          $scope.data.trybeSchedules = schedules;
          console.log('in plan module, schedules recvd:', schedules);
        })
        .catch(function(error){
          console.error(error);
        });
    };

    $scope.getPlan = function() {
      PlanFactory.getPlan($scope.username)
        .then(function(plan){
          console.log('in plan module, plan:', plan);
          $scope.data.plan = plan;
          $scope.assignTrybesToDays();
        })
        .catch(function(error){
          console.error(error);
        });
    };


    $scope.assignTrybesToDays = function() {
      //Initialize trybeDays object to store each trybe's index and days
      var trybeDays = {};
      for(var j = 0; j < $scope.data.trybes.length; j++) {
        var trybe = $scope.data.trybes[j];
        trybeDays[$scope.data.trybes[j]] = {
          index: j,
          days: []
        };
      }

      //Run through each day, assign days to trybe
      for(var day = 1; day <= 7; day++) {
        //Find trybes assigned to each day,
        //and corresponding arr val of it
        for(var trybeIndex = 0; trybeIndex < $scope.data.plan[day].length; trybeIndex++) {
          //Add day val to trybeDay's day prop
          var trybe = $scope.data.plan[day][trybeIndex];
          trybeDays[trybe]['days'].push(day);
        }
      }

      $scope.data.trybeDays = trybeDays;
      console.log('trybeDays', trybeDays);

      //After retrieving workouts, user plan, and assigning days, organize.
      $scope.organizeByDay();
    };

    $scope.renderDaysAssigned = function(index) {
      var trybe = $scope.data.trybes[index];
      var daysOfTrybe;
      var html = '';

      //Load trybeDays from $scope, or if not existing yet,
      //create object structure
      if($scope.data.trybeDays) {
        daysOfTrybe = $scope.data.trybeDays[trybe].days;
      } else {
        $scope.data.trybeDays = {};
        for(var j = 0; j < $scope.data.trybes.length; j++) {
          var trybeInstance = $scope.data.trybes[j];
          $scope.data.trybeDays[trybeInstance] = {
            index: j,
            days: []
          };
        }
        daysOfTrybe = $scope.data.trybeDays[trybe].days;
      }

      //Run through trybe's assigned days and add to html
      for(var i = 0; i < daysOfTrybe.length; i++) {
        var dayVal = daysOfTrybe[i];
        if (i === 0) {
          html += dayVal;
        } else if (i === daysOfTrybe.length) {
          html += dayVal;
        } else {
          html += ', ' + dayVal;
        }
      }

      return html;
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

    $scope.renderWeekAndDay = function(order) {
      var html = '';
      // var weeks = $scope.data.weeks;

      //Pull days/wk from trybe
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
