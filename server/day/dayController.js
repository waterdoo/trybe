/*
* @Author: VINCE
* @Date:   2015-07-09 13:12:15
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 13:15:13
*/

'use strict';

var User = require('../models').user;
var Trybe = require('../models').trybe;
var Day = require('../models').day;
var Plan = require('../models').plan;

module.exports = {
  getDays: function(req, res, next) {
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

  setDays: function(req, res, next) {
    // var username = req.body.username;
    // var trybeName = req.body.name;
    // var days = req.body.days;
    // var weeks = req.body.weeks;

    // Trybe.findOrCreate({where: {name: trybeName}})
    // .spread(function(trybe, created){
    //   trybe.updateAttributes({
    //     weeks: weeks,
    //     days: days
    //   })
    // })
    // .then(function() {
    //   res.send(200);
    // })
    // .catch(function(error){
    //   console.error(error);
    //   res.send(500);
    // });
  }
};
