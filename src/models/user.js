"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      transaction_id: DataTypes.STRING,
      country_code: DataTypes.STRING,
      connect_user_id: DataTypes.UUID,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING
    },
    { underscored: true }
  );
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
