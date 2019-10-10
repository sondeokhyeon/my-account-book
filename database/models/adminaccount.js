'use strict';
module.exports = (sequelize, DataTypes) => {
  const adminAccount = sequelize.define('adminAccount', {
    majorName: DataTypes.STRING,
    minorName: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {});
  adminAccount.associate = function(models) {
    // associations can be defined here
  };
  return adminAccount;
};