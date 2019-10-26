'use strict';
module.exports = (sequelize, DataTypes) => {
  const STP_ISMN = sequelize.define('STP_ISMN', {
    ISMN_NO: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ISMJ_NO: {
      type: DataTypes.INTEGER
    },
    ISMN_NM: DataTypes.STRING,
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
  STP_ISMN.associate = function(models) {
    STP_ISMN.belongsTo(models.STP_ISMJ, {foreignKey: 'ISMJ_NO'})
  };
  return STP_ISMN;
};