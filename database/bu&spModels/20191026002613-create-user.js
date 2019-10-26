'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SDT_USERs', {
      USER_ID:  {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey : true
      },
      USER_PW: {
        type : Sequelize.STRING
      },
      USER_LV: {
        type: Sequelize.INTEGER,
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
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SDT_USERs');
  }
};