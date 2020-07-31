const monk = require("monk");
require("dotenv").config();

const db = monk(process.env.db);

const getCollection = (name) => {
  return db.get(name);
};

module.exports = { db, getCollection };
