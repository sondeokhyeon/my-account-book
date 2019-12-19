'use strict';
module.exports = (sequelize, DataTypes) => {
  const DT_FILE = sequelize.define('DT_FILE', {
    FILE_NO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey : true,
    },
    DT_NO : DataTypes.INTEGER,
    FILE_ORINM: DataTypes.STRING,
    FILE_LOGNM:DataTypes.STRING,
    FILE_PATH:DataTypes.STRING
  }, {});
  DT_FILE.associate = function(models) {
    DT_FILE.belongsTo(models.DT_DETAIL, {foreignKey: 'DT_NO'})
  };
  return DT_FILE;
};