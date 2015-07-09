/*
* @Author: VINCE
* @Date:   2015-07-09 11:29:39
* @Last Modified by:   VINCE
* @Last Modified time: 2015-07-09 11:52:50
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Plans', {
    name: DataTypes.STRING,
  })
};
