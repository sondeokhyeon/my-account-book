'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('STP_ISMNs', {
      ISMN_NO: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ISMJ_NO: {
        type: Sequelize.INTEGER
      },
      ISMN_NM: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('STP_ISMNs');
  }
};