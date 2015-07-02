/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:33
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 15:25:09
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
  }

  setSchedule: function(req, res, next) {
    var username = req.headers['x-access-username'];
    var userTrybe = username + 'trybe';
    var schedule = {};

    Trybe.find({where: {name: userTrybe}})
    .then(function(trybe){
      trybe.updateAttributes({
        weeks: req.body.weeks,
        days: req.body.days
      })
    })
    .then(function() {});
  }
};
