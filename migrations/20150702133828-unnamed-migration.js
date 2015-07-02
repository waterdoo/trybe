'use strict';

module.exports = {
  up: function (migration, DataTypes) {
   migration.addColumn(
     'Workouts',
     'order',
     DataTypes.INTEGER
   )
  },

  down: function (migration, DataTypes) {
   migration.removeColumn('Workouts', 'order')
  }

};
