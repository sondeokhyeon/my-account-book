'use strict';
module.exports = (sequelize, DataTypes) => {
  const STP_ISMJ = sequelize.define('STP_ISMJ', {
    ISMJ_NO: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ISMJ_MJ_NM: DataTypes.STRING,
    ISMJ_MN_NM: DataTypes.STRING,
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
    STP_ISMJ.hasMany(models.STP_ISMN, {foreignKey:'ISMJ_NO'})
  };
  return STP_ISMJ;
};