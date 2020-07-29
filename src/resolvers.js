import User from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const DBCache = require('./db/dbcache');

const SUPER_SECRET = 'supersecret';

export default {
  Query: {
    async currentUser(root, { input }, context) {
      const token = context.token;
      console.log(token);

      if (!token) {
        throw new Error('You need to login first.');
      }

      return await User.findOne(input);
    },
  },

  Mutation: {
    async signup(root, { input: { username, password } }) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already used');
      }

      const hash = await bcrypt.hash(password, 4);
      await User.create({
        username,
        password: hash,
      });
      return await User.findOne({ username });
    },
    async login(root, { input: { username, password } }) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Username not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Password is incorrect');
      }

      return toUserRes(user);
    },
  },
};

const toUserRes = (user) => {
  const data = user.toObject();
  const userRes = { ...data, token: jwt.sign({ ...data }, SUPER_SECRET) };

  DBCache.DBCache.redisClient.SetDataFromKey(
    data._id.toString(),
    userRes.token
  );
  return userRes;
};
