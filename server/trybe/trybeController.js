/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-21 12:53:11
*/

'use strict';

var Sequelize = require('sequelize');
var Trybe = require('../models').trybe;
var User = require('../models').user;
var async = require('async');

module.exports = {
  getSchedule: function(req, res, next) {
    var trybeName = req.headers['x-access-trybe'];
    console.log('trybeController getSchedule trybeName:', trybeName);
    var schedule = {};

    Trybe.find({where: {name: trybeName}})
    .then(function(trybe){
      schedule.weeks = trybe.get('weeks');
      schedule.days = trybe.get('days');
      res.send(schedule);
    })
  },

  //Currently not working - findAll query not finding any trybes
  getSchedules: function(req, res, next) {
    var trybes = req.headers['x-access-trybes'];
    console.log('trybeController getSchedules trybes:', trybes);
    var schedules = {};

    Trybe.findAll({
      //not working, no trybeEntries are found
      where: Sequelize.or(
        {name: trybes}
      )
    })
    .then(function(trybeEntries){
      async.eachSeries(trybeEntries, function(trybeEntry, innerNext){
        console.log('in getSchedules, each trybeEntry:', trybeEntry);
        schedules[trybeEntry] = trybeEntry.get('days');
        innerNext();
      }, function(err){
        //function called when async each is done going through all trybes
        if(err) {
          console.error(err);
        }

        //when each function has run through every trybe,
        //send back schedules
        console.log('getSchedules sends back:', schedules);
        res.send(schedules);
      });
    })
  },

  setSchedule: function(req, res, next) {
    var username = req.body.username;
    var trybeName = req.body.name;
    var days = req.body.days;
    var weeks = req.body.weeks;

    Trybe.findOrCreate({where: {name: trybeName}})
    .spread(function(trybe, created){
      trybe.updateAttributes({
        weeks: weeks,
        days: days
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
