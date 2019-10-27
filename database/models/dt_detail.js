'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_DETAIL = sequelize.define('DT_DETAIL', {
    DT_NO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey : true,
    },
    SRC_NO: {
      type: DataTypes.INTEGER,
    },
    MONEY : {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    DT_PLACE : DataTypes.STRING,
    USER_NO : DataTypes.INTEGER,
    INPUT_USER : DataTypes.INTEGER,
    COMMNET : DataTypes.TEXT,
  }, {});
  DT_DETAIL.associate = function(models) {
    DT_DETAIL.hasMany(models.DT_FILE, {foreignKey: 'DT_NO'})
    DT_DETAIL.belongsTo(models.SDT_USER, {foreignKey: 'USER_NO'})
    DT_DETAIL.belongsTo(models.DT_SRC, {foreignKey: 'SRC_NO'})
  };
  return DT_DETAIL;
};