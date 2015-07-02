/*
* @Author: vokoshyv
* @Date:   2015-05-05 09:56:42
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 14:19:22
*/
'use strict';
var workoutController = require('./workoutController.js');

module.exports = function(app){
  // this app was injected from the middleware line 34
  console.log('here');
  app.post('/', workoutController.saveWorkout);
  app.post('/complete', workoutController.completeWorkout);
  app.get('/all', workoutController.getAllWorkouts);
  app.get('/individual', workoutController.getIndividualWorkout);

};
