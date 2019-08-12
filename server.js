require("dotenv").config();
const app = require("./src/app");

const port = process.env.PORT || 4444;

app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
