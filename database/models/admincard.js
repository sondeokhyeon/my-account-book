'use strict';
module.exports = (sequelize, DataTypes) => {
  const adminCard = sequelize.define('adminCard', {
    majorName: DataTypes.STRING,
    minorName: DataTypes.STRING,
    username: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {});
  adminCard.associate = function(models) {
    // associations can be defined here
  };
  return adminCard;
};