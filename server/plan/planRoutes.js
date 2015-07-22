/*
* @Author: VINCE
* @Date:   2015-07-09 11:33:51
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-16 17:49:46
*/

'use strict';

var planController = require('./planController.js');

module.exports = function(app){
  app.get('/', planController.getPlan);
  app.post('/', planController.setPlan);
};
