'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_AD_CARD = sequelize.define('DT_AD_CARD', {
    majorName: DataTypes.STRING,
    minorName: DataTypes.STRING,
    username: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {});
  DT_AD_CARD.associate = function(models) {
    // associations can be defined here
  };
  return DT_AD_CARD;
};