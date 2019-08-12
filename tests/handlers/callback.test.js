const db = require("connect-sammple-signup/src/models");
const callbackHandler = require("connect-sammple-signup/src/handlers/callback");
const {
  generateToken
} = require("connect-sammple-signup/src/services/security");

beforeEach(() => db.sequelize.sync({ force: true }));
afterAll(() => db.sequelize.connectionManager.close());

const transaction_id = "25d99d76-87d6-4402-a7ec-92ecf6ec9462";
const connect_user_id = "c98f2553-5911-4b55-b6d3-7f46940272cc";

function bodyData(overrides = {}) {
  return Object.assign(
    {},
    {
      token: generateToken(connect_user_id),
      transaction_id: transaction_id,
      user_id: connect_user_id
    },
    overrides
  );
}

test("should return a 400 if the token is wrong", () => {
  expect.assertions(2);
  const sendMock = jest.fn();
  const statusMock = jest.fn();
  callbackHandler(
    {
      body: bodyData({
        token: "not a valid token"
      })
    },
    { send: sendMock, status: statusMock }
  );
  expect(sendMock).toHaveBeenCalledWith("Bad Request");
  expect(statusMock).toHaveBeenCalledWith(400);
});

test("should return a 500 if the user does not exist in DB", () => {
  expect.assertions(2);
  const sendMock = jest.fn();
  const statusMock = jest.fn();
  return callbackHandler(
    { body: bodyData() },
    { send: sendMock, status: statusMock }
  ).then(() => {
    expect(sendMock).toHaveBeenCalledWith("An error occured");
    expect(statusMock).toHaveBeenCalledWith(500);
  });
});

test("should save the new user_id when all is properly set", () => {
  expect.assertions(3);
  const sendMock = jest.fn();
  const statusMock = jest.fn();

  return db.sequelize.queryInterface
    .bulkInsert(
      "users",
      [
        {
          created_at: new Date(),
          first_name: "Waiting for Callback",
          last_name: "Test",
          transaction_id: transaction_id,
          updated_at: new Date()
        }
      ],
      {}
    )
    .then(() =>
      callbackHandler(
        { body: bodyData() },
        { send: sendMock, status: statusMock }
      )
    )
    .then(() => db.user.findOne({ where: { transaction_id } }))
    .then(user => {
      expect(sendMock).toHaveBeenCalledWith("Ok");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(user.connect_user_id).toBe(connect_user_id);
    });
});
