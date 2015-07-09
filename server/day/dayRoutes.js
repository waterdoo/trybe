/*
* @Author: VINCE
* @Date:   2015-07-09 13:12:24
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 13:13:43
*/

'use strict';

var dayController = require('./dayController.js');

module.exports = function(app){
  app.get('/', dayController.getDays);
  app.post('/', dayController.setDays);
};
