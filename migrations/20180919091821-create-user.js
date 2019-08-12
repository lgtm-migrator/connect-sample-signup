"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
      .then(() =>
        queryInterface.createTable("users", {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()")
          },
          transaction_id: {
            allowNull: false,
            type: Sequelize.STRING
          },
          first_name: {
            type: Sequelize.STRING
          },
          last_name: {
            type: Sequelize.STRING
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE
          }
        })
      )
      .then(() =>
        queryInterface.addIndex("users", {
          fields: ["transaction_id"],
          unique: true
        })
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
