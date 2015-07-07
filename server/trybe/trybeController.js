/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-07 15:30:33
*/

'use strict';

var Trybe = require('../models').trybe;
var User = require('../models').user;

module.exports = {
  getSchedule: function(req, res, next) {
    var username = req.headers['x-access-username'];
    var userTrybe = username + 'trybe';
    var schedule = {};

    Trybe.find({where: {name: userTrybe}})
    .then(function(trybe){
      schedule.weeks = trybe.get('weeks');
      schedule.days = trybe.get('days');
      res.send(schedule);
    })
  },

  setSchedule: function(req, res, next) {
    var username = req.body.username;

    //Give unique name so users can have overlapping
    //trybe names
    var trybeName = username + req.body.name;
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
