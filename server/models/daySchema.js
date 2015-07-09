/*
* @Author: VINCE
* @Date:   2015-07-09 12:54:16
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 13:09:52
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Days', {
    val: DataTypes.INTEGER
  })
};