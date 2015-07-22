/*
* @Author: VINCE
* @Date:   2015-07-09 11:34:08
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-16 17:49:27
*/

'use strict';

var User = require('../models').user;
var Trybe = require('../models').trybe;
var Day = require('../models').day;
var Plan = require('../models').plan;
var async = require('async');

module.exports = {
  getPlan: function(req, res, next) {
    var username = req.headers['x-access-username'];
    var planResponse = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: []
    };

    //Find user
    User.find({where: {username: username}})
    .then(function(user){
      //Get user's plan
      Plan.find({where: {UserId: user.get('id')}})
      .then(function(plan){
        //Find all 7 days of plan
        Day.findAll({where: {PlanId: plan.get('id')}})
        .then(function(days){
          //Loop through each day to find associated trybes
          async.eachSeries(days, function(day, outerNext){
            day.getTrybes().then(function(trybes){
              //Add each trybe's name to plan
              async.eachSeries(trybes, function(trybe, innerNext){
                var trybeName = trybe.get('name');
                var dayNum = day.get('val');
                console.log('trybeName:', trybeName);
                console.log('dayNum:', dayNum);

                planResponse[dayNum].push(trybeName);
                innerNext(); // callback tells async each to move on to next trybe
              }, function(err){ //function called when async each is done going through all trybes
                if(err) {
                  console.error(err);
                }
                outerNext(err); //tells async each going through each day to move to next day
              });
            })
          }, function(err){ //this gets called when there are no more days to go through
            if(err){
              console.error(err);
            }
            // once the each function is done doing through every day and all the trybes have been pushed, we send back the planResponse to the client
            res.send(planResponse);
          })
        })
      })
    })
  },

  setPlan: function(req, res, next) {
    var planReq = req.body;

    User.find({where: {username: planReq.username}})
    .then(function(user){
      Plan.find({where: {UserId: user.get('id')}})
      .then(function(plan){
        Day.findAll({where: {PlanId: plan.get('id')}})
        .then(function(days){ //returns array of days
          async.eachSeries(days, function(day, innerNext){
            //update all relationships with DayTrybes
              //delete all associations of this user's day
              day.setTrybes([])
              .then(function(){
                //retrieve trybe objs for each day
                var dayVal = day.get('val');
                var numTrybesForThisDay = planReq.plan['day' + dayVal].length;

                //for each day, find and add trybe association
                for(var i = 0; i < numTrybesForThisDay; i++) {
                  var trybeName = planReq.plan['day' + dayVal][i];
                  Trybe.find({where: {name: trybeName}})
                  .then(function(trybe){
                    day.addTrybes(trybe);
                  })
                }
            })
            innerNext(); //this callback lets async know to move on to next value
          })
        })

      })
    })
    .then(function() {
      res.send(200);
    })
    .catch(function(error){
      console.error(error);
      res.send(500);
    });
  }
};
