/*
* @Author: nimi
* @Date:   2015-05-05 13:31:44
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 14:46:07
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Trybes', {
    name: DataTypes.STRING,
    weeks: DataTypes.INTEGER,
    days: DataTypes.INTEGER
  })
}