const jwt = require('jsonwebtoken');
const { dateNow } = require('../Helper/response');
const key = 'yeahthisisyourkey';
module.exports = {
  doSignToken: (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          _id: id,
          createdAt: dateNow()
        },
        key,
        (error, token) => {
          resolve(token);
          reject(error);
        }
      );
    });
  },
  doAuthToken: (req, res, next) => {
    const headertoken = req.headers.authorization;
    const token = headertoken ? headertoken.split(' ')[1] : undefined;
    try {
      if (token) {
        jwt.verify(token, key, (err, decode) => {
          if (err) {
            throw new Error(err);
          } else {
            req.payload = decode;
            next();
          }
        });
      } else {
        throw new Error('Invalid Token Key :(');
      }
    } catch (error) {
      next(error);
    }
  }
};
