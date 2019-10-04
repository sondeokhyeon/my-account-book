'use strict';
const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  const ISMJ = sequelize.define('ISMJ', {
    mjnm: {
      type : DataTypes.STRING,
      primaryKey: true,
    },
    mjuse: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
     type: Sequelize.DATE,
     get() {
      return moment.utc(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss')
    }
    },
    updatedAt: {
     type: Sequelize.DATE,
     get() {
       return moment.utc(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss')
     }
    }
  }, {});
  ISMJ.associate = function(models) {
    // associations can be defined here
  };
  return ISMJ;
};