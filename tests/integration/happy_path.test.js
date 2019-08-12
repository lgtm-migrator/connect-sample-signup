/* global page */
const {
  generateToken
} = require("connect-sammple-signup/src/services/security");
const { makeSignupUrl } = require("./utils");

const transaction_id = "5907363f-24a9-43c7-9a97-91db4e3ca5e2";

test("Should not submit the form and ask again when a field is empty", async () => {
  await page.goto(makeSignupUrl(transaction_id));
  await page.type("[name=first_name]", "First name");
  await page.type("[name=last_name]", "Last name");
  await page.select("[name=country_code]", "FR");
  const navigationPromise = page.waitForNavigation();
  await page.click("[type=submit]");
  await navigationPromise;
  return expect(page.url()).toBe(
    `http://localhost:4444/?transaction_id=${transaction_id}&security_key=baf1d2303d9ad444106f2d66b7067daed7de14de435e6a797f93099d3eadbde0`
  );
});
