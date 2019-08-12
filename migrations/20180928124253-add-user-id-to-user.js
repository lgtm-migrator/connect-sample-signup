"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "connect_user_id", {
      type: Sequelize.UUID
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "connect_user_id");
  }
};
