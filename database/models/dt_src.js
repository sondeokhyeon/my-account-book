'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_SRC = sequelize.define('DT_SRC', {
    SRC_NO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    SRC_BANK: DataTypes.STRING,
    SRC_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    SRC_CNAME: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SRC_MJCG: DataTypes.CHAR,
    SRC_MONEY: DataTypes.INTEGER,
    USER_NO: DataTypes.INTEGER,
    IS_CREDIT: DataTypes.CHAR,
    IS_USE: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    COMMNET: DataTypes.STRING
  }, {});
  DT_SRC.associate = function (models) {
    DT_SRC.hasMany(models.DT_DETAIL, { foreignKey: 'SRC_NO' })
    DT_SRC.belongsTo(models.SDT_USER, { foreignKey: 'USER_NO' })
  };
  return DT_SRC;
};