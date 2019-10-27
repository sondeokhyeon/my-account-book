'use strict';
module.exports = (sequelize, DataTypes) => {
  const SDT_USER = sequelize.define('SDT_USER', {
    USER_NO:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey : true,
    },
    USER_NM:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true
    },
    USER_PW: DataTypes.STRING,
    USER_LV: DataTypes.INTEGER,
    HOME_NUMS: DataTypes.INTEGER
  }, {});
  SDT_USER.associate = function(models) {
    SDT_USER.hasMany(models.DT_DETAIL, {foreignKey:'USER_NO'})
    SDT_USER.hasMany(models.DT_SRC, {foreignKey:'USER_NO'})
  };
  return SDT_USER;
};