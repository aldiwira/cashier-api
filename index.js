const Express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const App = Express();
const { db } = require('./Db');
const { doFormat } = require('./Helper/response');
const {
  UsersRoute,
  ProductsRoute,
  OrdersRoute,
  RecipesRoute
} = require('./Routes');
let port = process.env.PORT || 2000;
const nodenv = process.env.NODE_ENV === 'development';
console.log(nodenv ? 'Development' : 'Production');

App.use(helmet());
App.use(cors());
App.use(nodenv ? morgan('dev') : morgan('tiny'));
App.use(Express.json());

//testing route and testing server
App.get('/', (req, res) => {
  res.json(doFormat(200, 'Connected to cashierAPI', true));
});

//route
App.use('/', UsersRoute);
App.use('/products', ProductsRoute);
App.use('/orders', OrdersRoute);
App.use('/recipe', RecipesRoute);

//error handling middleware
// eslint-disable-next-line no-unused-vars
App.use((error, req, res, next) => {
  let status = error.status ? error.status : 500;
  res.status(status).json(doFormat(status, error.message, false));
});

//db status
db.then(() => {
  console.log('Connected');
});
//server status
App.listen(port, () => {
  console.log(`run at ${port}`);
});
