const {
  generateToken
} = require("connect-sammple-signup/src/services/security");

test("Should return a valid SHA256", () => {
  const result = generateToken("This is a random string.");
  expect(result).toBe(
    "212598fd0a7ca2699df96aca0170180baab747783c1620984d8d90c51f4f4e1d"
  );
});
