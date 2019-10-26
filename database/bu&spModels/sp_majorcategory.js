'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const majorcategory = sequelize.define('majorcategory', {
    categoryName: {
      type: DataTypes.STRING,
      primaryKey : true
    }
  }, {});
  majorcategory.associate = function(models) {
    // majorcategory.hasOne(models.minorcategory, {foreignKey:'categoryName', as :'categorysort'})
  };
  return majorcategory;
};