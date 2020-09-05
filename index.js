const Express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const App = Express();
const { db } = require("./Helper/db");
const { doFormat } = require("./Helper/response");
const { UsersRoute, ProductsRoute } = require("./Routes");
let port = process.env.PORT || 2000;

App.use(helmet());
App.use(cors());
App.use(morgan("dev"));
App.use(Express.json());

//testing route
App.get("/", (req, res) => {
  res.json(doFormat(200, "Connected to cashierAPI", true));
});

//route
App.use("/", UsersRoute);
App.use("/products", ProductsRoute);

//error handling middleware
// eslint-disable-next-line no-unused-vars
App.use((error, req, res, next) => {
  let status = error.status ? error.status : 500;
  res.status(status).json(doFormat(status, error.message, false));
});

//db status
db.then(() => {
  console.log("Connected");
});
//server status
App.listen(port, () => {
  console.log(`run at ${port}`);
});
