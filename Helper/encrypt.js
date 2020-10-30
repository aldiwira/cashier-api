const bcrypt = require('bcrypt');

module.exports = {
  encrypt: async (password) => {
    return await bcrypt.hash(password, 10);
  },
  decrypt: async (password, encrypted) => {
    return await bcrypt.compare(password, encrypted);
  }
};
