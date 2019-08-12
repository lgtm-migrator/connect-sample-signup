const db = require("../models");
const { generateToken } = require("../services/security");

module.exports = function post(request, result) {
  const { token, transaction_id, user_id } = request.body;
  if (token !== generateToken(user_id)) {
    result.status(400);
    result.send("Bad Request");
  } else {
    return db.user
      .update({ connect_user_id: user_id }, { where: { transaction_id } })
      .then(([rowCount]) => {
        if (rowCount === 0) {
          throw "User not found";
        }
        result.status(200);
        result.send("Ok");
      })
      .catch(() => {
        result.status(500);
        result.send("An error occured");
      });
  }
};
