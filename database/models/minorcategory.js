'use strict';
module.exports = (sequelize, DataTypes) => {
  const minorcategory = sequelize.define('minorcategory', {
    categoryName:DataTypes.STRING,
    name: DataTypes.STRING,
    isworking: DataTypes.BOOLEAN
  }, {});
  minorcategory.associate = function(models) {
    // minorcategory.hasOne(models.majorcatetory, {
    //   foreignKey : 'categoryName',
    //   as:'category',
    //   onDelete:'CASCADE'
    // })
    //minorcategory.hasOne(models.majorcategory, {foreignKey:'categoryName', as :'categorysort'})
  };
  return minorcategory;
};