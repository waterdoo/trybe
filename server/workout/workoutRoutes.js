/*
* @Author: vokoshyv
* @Date:   2015-05-05 09:56:42
* @Last Modified by:   VINCE
* @Last Modified time: 2015-06-30 18:16:40
*/
'use strict';
var workoutController = require('./workoutController.js');

module.exports = function(app){
  // this app was injected from the middleware line 34
  console.log('here');
  app.post('/', workoutController.saveWorkout);
  app.post('/remove', workoutController.removeWorkout);
  app.get('/all', workoutController.getAllWorkouts);
  app.get('/individual', workoutController.getIndividualWorkout);

};
