import User from './models/User';
import bcrypt from 'bcrypt';

export default {
  Query: {
    async currentUser(root, { input }) {
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
      // const conditions = Boolean(username) && Boolean(password);
      // if (conditions) {
      //   throw new Error('username or password is invalid');
      // }

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Email not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Password is incorrect');
      }

      return user;
    },
  },
};
