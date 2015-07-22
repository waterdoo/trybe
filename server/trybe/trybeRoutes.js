/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:23
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-16 17:50:41
*/

'use strict';

var trybeController = require('./trybeController.js');

module.exports = function(app){
  app.get('/schedule', trybeController.getSchedule);
  app.get('/schedules', trybeController.getSchedules);
  app.post('/schedule', trybeController.setSchedule);
};