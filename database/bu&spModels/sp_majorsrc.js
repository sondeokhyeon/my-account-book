'use strict';
module.exports = (sequelize, DataTypes) => {
  const majorSrc = sequelize.define('majorSrc', {
    majorName: {
      type:DataTypes.STRING,
      primaryKey: true
    } 
  }, {});
  majorSrc.associate = function(models) {
    // associations can be defined here
  };
  return majorSrc;
};