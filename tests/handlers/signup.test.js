const db = require("connect-sammple-signup/src/models");
const getAllCountries = require("connect-sammple-signup/src/services/countries");
const signupHandler = require("connect-sammple-signup/src/handlers/signup");
const { validationResult } = require("express-validator/check");
const {
  generateToken
} = require("connect-sammple-signup/src/services/security");
const {
  getRedirectURL
} = require("connect-sammple-signup/src/services/redirection");

beforeEach(() => db.sequelize.sync({ force: true }));
afterAll(() => db.sequelize.connectionManager.close());

const transaction_id = "9875b453-aa29-4aaf-b9ea-709f8b4852ce";
const nonce = "nonce_12345";
const redirect_uri = "http://redirect.uri";

function queryData(overrides = {}) {
  return Object.assign(
    {},
    {
      nonce,
      redirect_uri,
      token: generateToken(transaction_id),
      transaction_id
    },
    overrides
  );
}

test("get: Should return an error when params are missing", () => {
  expect.assertions(2);
  const sendMock = jest.fn();
  const statusMock = jest.fn();
  signupHandler.get(
    {
      query: {}
    },
    { send: sendMock, status: statusMock }
  );
  expect(sendMock).toHaveBeenCalledWith(
    "Bad Request: nonce, redirect_uri, token, transaction_id missing"
  );
  expect(statusMock).toHaveBeenCalledWith(400);
});

test("get: Should return an error if the token is not valid", () => {
  expect.assertions(2);
  const sendMock = jest.fn();
  const statusMock = jest.fn();
  signupHandler.get(
    {
      query: queryData({
        token: "not a valid token"
      })
    },
    { send: sendMock, status: statusMock }
  );
  expect(sendMock).toHaveBeenCalledWith("Bad Request: invalid token");
  expect(statusMock).toHaveBeenCalledWith(400);
});

test("get: Should render signup if the token is valid", () => {
  expect.assertions(4);
  const renderMock = jest.fn();
  return signupHandler
    .get(
      {
        query: queryData(),
        csrfToken: () => "csrf_token"
      },
      { render: renderMock }
    )
    .then(() => db.user.findOne({ where: { transaction_id } }))
    .then(user => {
      const [template, templateArgs] = renderMock.mock.calls[0];

      expect(user.transaction_id).toBe(transaction_id);
      expect(renderMock).toHaveBeenCalled();
      expect(template).toBe("signup");
      expect(templateArgs).toEqual({
        country_code: null,
        countries: getAllCountries(),
        csrfToken: "csrf_token",
        errors: {},
        first_name: "",
        last_name: "",
        nonce,
        redirect_uri,
        transaction_id
      });
    });
});

test("post: should render an error if called with no user in db", () => {
  expect.assertions(1);
  const renderMock = jest.fn();
  return signupHandler.post[signupHandler.post.length - 1](
    {
      body: {
        first_name: "Firstname",
        last_name: "Lastname",
        nonce,
        redirect_uri,
        transaction_id
      },
      csrfToken: () => "csrf_token"
    },
    { render: renderMock }
  ).then(() => {
    expect(renderMock).toHaveBeenCalledWith("error");
  });
});

test("post: should render the signup page if the validations raise an error", () => {
  expect.assertions(3);
  const renderMock = jest.fn();
  let request = {
    body: {
      first_name: "",
      last_name: "",
      nonce,
      redirect_uri,
      transaction_id
    },
    csrfToken: () => "csrf_token"
  };
  const expressResult = { render: renderMock };
  return expressPipelineSimulator(
    signupHandler.post,
    request,
    expressResult
  ).then(() => {
    const [template, templateArgs] = renderMock.mock.calls[0];

    expect(renderMock).toHaveBeenCalled();
    expect(template).toBe("signup");
    expect(templateArgs.errors).toEqual({
      country_code: {
        location: "body",
        msg: "Country is required",
        param: "country_code",
        value: undefined
      },
      first_name: {
        location: "body",
        msg: "First name is required",
        param: "first_name",
        value: ""
      },
      last_name: {
        location: "body",
        msg: "Last name is required",
        param: "last_name",
        value: ""
      }
    });
  });
});

test("post: should redirect when all is good", () => {
  expect.assertions(3);
  const redirectMock = jest.fn();
  return db.sequelize.queryInterface
    .bulkInsert(
      "users",
      [
        {
          created_at: new Date(),
          transaction_id: transaction_id,
          updated_at: new Date()
        }
      ],
      {}
    )
    .then(() =>
      signupHandler.post[signupHandler.post.length - 1](
        {
          body: {
            first_name: "Firstname",
            last_name: "Lastname",
            nonce,
            redirect_uri,
            transaction_id
          },
          csrfToken: () => "csrf_token"
        },
        { redirect: redirectMock }
      )
    )
    .then(() => db.user.findOne({ where: { transaction_id } }))
    .then(user => {
      expect(user.first_name).toBe("Firstname");
      expect(user.last_name).toBe("Lastname");
      expect(redirectMock).toHaveBeenCalledWith(
        getRedirectURL(redirect_uri, transaction_id, nonce)
      );
    });
});

function expressPipelineSimulator(pipeline, request, result) {
  return pipeline.reduce(
    (chain, func) =>
      chain.then(
        () =>
          new Promise(resolve => {
            if (func.length > 2) {
              return func(request, result, resolve);
            } else {
              func(request, result);
              resolve();
            }
          })
      ),
    Promise.resolve()
  );
}
