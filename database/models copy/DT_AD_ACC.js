'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_AD_ACC = sequelize.define('DT_AD_ACC', {
    majorName: DataTypes.STRING,
    minorName: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {});
  DT_AD_ACC.associate = function(models) {
    // associations can be defined here
  };
  return DT_AD_ACC;
};