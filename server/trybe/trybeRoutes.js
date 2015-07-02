/*
* @Author: VINCE
* @Date:   2015-07-02 14:50:23
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 14:51:27
*/

'use strict';

var trybeController = require('./trybeController.js');

module.exports = function(app){
  app.get('/schedule', trybeController.getSchedule);
};