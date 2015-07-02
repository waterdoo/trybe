'use strict';

module.exports = {
  up: function (migration, DataTypes) {
   migration.addColumn(
     'Trybes',
     'days',
     DataTypes.INTEGER
   )
  },

  down: function (migration, DataTypes) {
   migration.removeColumn('Trybes', 'days')
  }

};
