'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_SRC = sequelize.define('DT_SRC', {
    SRC_NO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey : true,
    },
    SRC_NAME: DataTypes.STRING,
    SRC_BANK: DataTypes.STRING,
    SRC_CATEGORY : DataTypes.BOOLEAN,
    SRC_MONEY:DataTypes.INTEGER,
    USER_NO: DataTypes.INTEGER,
    IS_CREDIT : DataTypes.BOOLEAN,
    IS_USE: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    COMMNET:DataTypes.STRING
  }, {});
  DT_SRC.associate = function(models) {
    DT_SRC.hasMany(models.DT_DETAIL, {foreignKey:'SRC_NO'})
    DT_SRC.belongsTo(models.SDT_USER, {foreignKey: 'USER_NO'})
  };
  return DT_SRC;
};