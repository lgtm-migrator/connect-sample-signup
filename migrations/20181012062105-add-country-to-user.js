"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "country_code", {
      type: Sequelize.STRING
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "country_code");
  }
};
