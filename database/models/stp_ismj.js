'use strict';
module.exports = (sequelize, DataTypes) => {
  const STP_ISMJ = sequelize.define('STP_ISMJ', {
    ISMJ_NO: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ISMJ_MJ_NM: DataTypes.STRING, // major
    ISMJ_MN_NM: DataTypes.STRING, // minor
    ISMJ_MS_NM: DataTypes.STRING, // minorsub
    ISMJ_TYPE: DataTypes.CHAR,    // 타입분류
    ISMJ_RANK: DataTypes.INTEGER, // 우선순위
    IS_USE : DataTypes.BOOLEAN,
    createdAt: {
      type: DataTypes.DATE,
      get() {
       return moment.utc(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss')
     }
     },
     updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment.utc(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss')
      }
     }
  }, {});
  STP_ISMJ.associate = function(models) {

  };
  return STP_ISMJ;
};