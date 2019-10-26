'use strict';
module.exports = (sequelize, DataTypes) => {
  const SDT_USER = sequelize.define('SDT_USER', {
    USER_ID:  {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey : true
    },
    USER_PW: DataTypes.STRING,
    USER_LV: DataTypes.INTEGER
  }, {});
  SDT_USER.associate = function(models) {
    // associations can be defined here
  };
  return SDT_USER;
};