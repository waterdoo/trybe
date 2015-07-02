'use strict';

module.exports = {
  up: function (migration, DataTypes) {
   migration.addColumn(
     'Trybes',
     'weeks',
     DataTypes.INTEGER
   )
  },

  down: function (migration, DataTypes) {
   migration.removeColumn('Trybes', 'weeks')
  }

};
