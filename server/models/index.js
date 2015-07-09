/*
* @Author: nimi
* @Date:   2015-05-05 13:33:15
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 11:42:18
*/

//This file is used to coordinate all the schemas
'use strict';

var Sequelize = require('sequelize');

//initialize database connection
var database = process.env.DATABASE_NAME || 'trybe';
var username = process.env.DATABASE_USERNAME || 'root';
var password = process.env.DATABASE_PASSWORD || null;
var host = process.env.DATABASE_HOST || 'localhost';

//change null to password if using deployed db
var sequelize = new Sequelize(database, username , password, {
  host: host
});

// load models
var models = ['user', 'workout', 'trybe', 'exercise', 'plan'];
models.forEach(function(model){
  // sequelize.import will load models that have been defined in other files
  module.exports[model] = sequelize.import(__dirname + '/' + model + 'Schema');
});

// this immediately invoked function will define relationships between models
(function(module){
  module.user.hasMany(module.workout);
  module.workout.belongsTo(module.user);

  module.workout.hasMany(module.exercise);
  module.exercise.belongsTo(module.workout);

  module.trybe.hasMany(module.workout);
  module.workout.belongsTo(module.trybe);

  module.trybe.belongsToMany(module.user, {through : 'UserTrybe'});
  module.user.belongsToMany(module.trybe, {through : 'UserTrybe'});

  module.user.hasOne(module.plan);
  module.plan.belongsTo(module.user);

}(module.exports));

// export connection
module.exports.sequelize = sequelize;
