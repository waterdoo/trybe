/*
* @Author: VINCE
* @Date:   2015-07-09 11:34:08
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 18:02:46
*/

'use strict';

var User = require('../models').user;
var Trybe = require('../models').trybe;
var Day = require('../models').day;
var Plan = require('../models').plan;
var async = require('async');

module.exports = {
  getPlan: function(req, res, next) {
    // var trybeName = req.headers['x-access-trybe'];
    // console.log('trybeController trybeName:', trybeName);
    // var schedule = {};

    // Trybe.find({where: {name: trybeName}})
    // .then(function(trybe){
    //   schedule.weeks = trybe.get('weeks');
    //   schedule.days = trybe.get('days');
    //   res.send(schedule);
    // })
  },

  setPlan: function(req, res, next) {
    var planReq = req.body;
    // {
    //     username: 'example',
    //     plan: {
    //         day1: ['HR 26/27', 'Parkour'],
    //         day2: ['HR 26/27', 'Parkour'],
    //         day3: ['HR 26/27', 'Parkour']
    //     }
    // }

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
