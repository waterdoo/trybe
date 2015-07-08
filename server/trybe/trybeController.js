/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-08 16:01:59
*/

'use strict';

var Trybe = require('../models').trybe;
var User = require('../models').user;

module.exports = {
  getSchedule: function(req, res, next) {
    var trybeName = req.headers['x-access-trybe'];
    console.log('trybeController trybeName:', trybeName);
    var schedule = {};

    Trybe.find({where: {name: trybeName}})
    .then(function(trybe){
      schedule.weeks = trybe.get('weeks');
      schedule.days = trybe.get('days');
      res.send(schedule);
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
