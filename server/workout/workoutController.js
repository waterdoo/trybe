/*
* @Author: nimi
* @Date:   2015-05-04 16:41:47
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-06 19:54:56
*/
'use strict';

var Workout = require('../models').workout;
var Trybe = require('../models').trybe;
var Exercise = require('../models').exercise;
var User = require('../models').user;
var async = require('async');

module.exports = {

  saveWorkout: function(req, res, next){
    // Write the workout information to the sql tables
    var userID;
    var trybeID;
    var workoutID;
    //Acquire userID from User table

    User.find({where: {username: req.body.username}}).then(function(user){
      userID = user.get('id');
      //Acquire trybeID from Trybe table
      console.log('in workout controller - req.body.trybe', req.body.trybe);
      Trybe.find({where: {name: req.body.trybe}}).then(function(trybe){

        //if trybe doesn't yet exist, create
        if(trybe === null) {
          Trybe.build({
            name: req.body.trybe
          })
          .save()
          .then(function(newTrybe){
            trybeID = newTrybe.get('id');

            //add entry to UserTrybe join table
            User.addTrybe(newTrybe)
            .then(function(){
              newTrybe.addUser(user)
            });

            //Insert data into Workout table - refactor repeat of below later
            Workout.build({ // create table entry
              UserId: userID,
              type: req.body.type,
              title: req.body.title,
              description: req.body.description,
              order: req.body.order,
              finalResult: JSON.stringify(req.body.finalResult),
              TrybeId: trybeID
            })
            .save() //save the table we just created into the database
            .then(function(workout){

              //Acquire the workoutID from Workout table
              workoutID = workout.get('id');

              //Insert all exercises into Exercises table
              req.body.exercises.forEach(function(exercise){
                Exercise.build({ // create table entry
                  exerciseName: exercise.exerciseName,
                  quantity: JSON.stringify(exercise.quantity),
                  result: exercise.result,
                  WorkoutId: workoutID
                })
                .save() // save table entry into the database
                .then(function(newExercise){ // after the exercise is successfully saved, we send back a 200
                  res.send(200);
                })
                .catch(function(error){ //if there is an error,  send back a 500 and console log the error
                  console.error(error);
                  res.send(500);
                });
              });
            })
            .catch(function(error){
              console.error(error);
              res.send(500);
            });
          })
        } else {
          trybeID = trybe.get('id');
          //Insert data into Workout table
          Workout.build({ // create table entry
            UserId: userID,
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
            order: req.body.order,
            finalResult: JSON.stringify(req.body.finalResult),
            TrybeId: trybeID
          })
          .save() //save the table we just created into the database
          .then(function(workout){

            //Acquire the workoutID from Workout table
            workoutID = workout.get('id');

            //Insert all exercises into Exercises table
            req.body.exercises.forEach(function(exercise){
              Exercise.build({ // create table entry
                exerciseName: exercise.exerciseName,
                quantity: JSON.stringify(exercise.quantity),
                result: exercise.result,
                WorkoutId: workoutID
              })
              .save() // save table entry into the database
              .then(function(newExercise){ // after the exercise is successfully saved, we send back a 200
                res.send(200);
              })
              .catch(function(error){ //if there is an error,  send back a 500 and console log the error
                console.error(error);
                res.send(500);
              });
            });
          })
          .catch(function(error){
            console.error(error);
            res.send(500);
          });
          }
      });
    });
  },

  completeWorkout: function(req, res, next){
    //delete workouts where id = req.body.id
    Workout.find({where: {id: req.body.id}})
    .then(function(workout){
      workout.updateAttributes({
        completed: true
      })
    })
    .then(function() {});

  },

// This function will go into the database and find all workouts from all of the trybes that the user is a part of and return that
// as an object following the format stated in dataObjects.js
  getAllWorkouts: function(req, res, next){
    var workoutsArray = [];
    var user = req.headers['x-access-username'];
    console.log(user);
    User.find ({where: {username: user}}).then(function(user){ // find the user
      user.getTrybes().then(function(trybes){ //will return an array of trybe objects
        console.log('workoutController getAllWorkouts trybe objs',trybes);
        async.eachSeries(trybes, function(trybe, outerNext){ // go through each trybe
          trybe.getWorkouts().then(function(workouts){ // get all workouts associated with the trybe
            async.eachSeries(workouts, function(workout, innerNext){ // go through each workout in each trybe
              Exercise.findAll({where: {workoutID: workout.get('id')}}).then(function(exercises){ // finds all exercises for each workout
                User.find({where: {id: workout.get('UserId')}}).then(function(workoutUser){
                  var workoutObj = { // create the workout object in the proper format
                    id: workout.get('id'),
                    order: workout.get('order'),
                    username: workoutUser.get('username'),
                    date: workout.get('createdAt'),
                    trybe: trybe.get('name'),
                    type: workout.get('type'),
                    title: workout.get('title'),
                    description: workout.get('description'),
                    exercises: exercises,
                    finalResult: workout.get('finalResult'),
                    completed: workout.get('completed')
                  };
                  workoutsArray.push(workoutObj);
                  innerNext();// this callback lets the async each know to move on to the next value
                });
              });
            }, function(err){ // this function gets called when the async each is done going through all the workouts
              if(err){
                console.error(err);
              }
              outerNext(err); //this lets the async each that's going through each trybe know to move to the next trybe
            });
          });
        }, function(err){ // this function gets called when there are no more trybes to go through
          if(err){
            console.error(err);
          }
          // once the each function is done doing through every trybe and all the workouts have been pushed, we send back
          // the workoutsArray to the client
          res.send(workoutsArray) ;
        });
      });
    });
  },

  //getIndividualWorkouts sends back response consisting of just the user's workouts
  getIndividualWorkout: function(req, res, next){
    var workoutsArray = [];
    var username = req.headers['x-access-username'];

    User.find({where: {username: username}}).then(function(user){ // find the user
      user.getWorkouts().then(function(workouts){ // get all workouts associated with the user
        async.eachSeries(workouts, function(workout, innerNext){ // go through each workout
          Exercise.findAll({where: {workoutID: workout.get('id')}}).then(function(exercises){ // finds all exercises for each workout
            Trybe.find({where: {id: workout.TrybeId}}).done(function(trybe){ // used to get trybe name
              var workoutObj = { // create the workout object in the proper format
                id: workout.get('id'),
                order: workout.get('order'),
                username: user.get('username'),
                trybe: trybe.get('name'),
                type: workout.get('type'),
                title: workout.get('title'),
                date: workout.get('createdAt'),
                description: workout.get('description'),
                exercises: exercises,
                finalResult: workout.get('finalResult'),
                completed: workout.get('completed')
              };
              workoutsArray.push(workoutObj);
              innerNext();// this callback lets the async each know to move on to the next value
            });
          });
        }, function(err){ // this function gets called when the async each is done going through all the workouts
          if(err){
            console.error(err);
          }
          res.send(workoutsArray) ;
        }) ;
      });
    });
  }
};
