import User from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const DBCache = require('./db/dbcache');

const SUPER_SECRET = 'supersecret';

export default {
  Query: {
    async currentUser(root, { input }, context) {
      const token = context.token;

      if (!token) {
        throw new Error('You need to login first.');
      }

      await verifyToken(token);
      const user = await User.findOne({ input });
      return toUserReswithNotSign(user);
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

      const user = await User.findOne({ username });
      return toUserRes(user);
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

      return toUserReswithSign(user);
    },
  },
};

async function toUserReswithSign(user) {
  const data = user.toObject();
  const userRes = {
    ...data,
    token: jwt.sign({ _id: data._id.toString() }, SUPER_SECRET),
  };

  await DBCache.DBCache.redisClient.SetDataFromKey(
    data._id.toString(),
    userRes.token
  );
  return userRes;
}

async function toUserReswithNotSign(user) {
  const data = user.toObject();
  const token = await DBCache.DBCache.redisClient.GetDataFromKey(
    data._id.toString()
  );
  const userRes = { ...data, token: token[0], SUPER_SECRET };
  return userRes;
}

async function verifyToken(token) {
  await jwt.verify(token.split(' ')[1], SUPER_SECRET, (err, res) => {
    if (err) {
      throw new Error(err);
    }
  });
}
