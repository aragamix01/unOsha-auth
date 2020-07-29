import jwt from 'jsonwebtoken';
const DBCache = require('./db/dbcache');

const  verifyToken = (token) => {
  await jwt.verify(token.split(' ')[1], SUPER_SECRET, (err, res) => {
    let a = DBCache.DBCache.redisClient
      .GetDataFromKey(res._id)
      .then(console.log);
  });
};