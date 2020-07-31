const Express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const App = Express();
require("dotenv").config();

let port = process.env.PORT || 2000;

App.use(helmet());
App.use(cors());

App.listen(port, () => {
  console.log(`run at ${port}`);
});
