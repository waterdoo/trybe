/*
* @Author: nimi
* @Date:   2015-05-04 16:41:47
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-02 13:17:53
*/


'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Workouts', {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    order: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN,
    finalResult: DataTypes.STRING
  });
};