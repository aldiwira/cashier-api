const env = process.env.NODE_ENV;
const cdb = require('./config.db.json')[env];
const monk = require('monk');

const db = monk(cdb.url + '/' + cdb.database);

const getCollection = (collection) => {
  return db.get(collection);
};

const listCollection = {
  users: 'users',
  products: 'products',
  orders: 'orders',
  recipes: 'recipes'
};

module.exports = { db, getCollection, listCollection };
