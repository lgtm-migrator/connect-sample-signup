/* global page */
const { makeSignupUrl } = require("./utils");

const transaction_id = "5907363f-24a9-43c7-9a97-91db4e3ca5e2";

test("Should not submit the form and ask again when a field is empty", async () => {
  await page.goto(makeSignupUrl(transaction_id));
  const navigationPromise = page.waitForNavigation();
  await page.click("[type=submit]");
  await navigationPromise;
  const errorInputs = await page.$$(".error");
  return expect(errorInputs.length).toBeGreaterThan(0);
});
