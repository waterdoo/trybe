'use strict';

module.exports = {
  up: function (migration, DataTypes) {
   migration.addColumn(
     'Workouts',
     'completed',
     DataTypes.BOOLEAN
   )
  },

  down: function (migration, DataTypes) {
   migration.removeColumn('Workouts', 'completed')
  }

};
