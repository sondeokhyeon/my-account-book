'use strict';
module.exports = (sequelize, DataTypes) => {
  const ISMN = sequelize.define('ISMN', {
    majorName: DataTypes.STRING,
    minorName: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN,
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
  ISMN.associate = function(models) {
    // associations can be defined here
  };
  return ISMN;
};