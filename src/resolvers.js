import User from './models/User';
import bcrypt from 'bcrypt';

export default {
  Query: {
    async currentUser(root, { input }) {
      console.log(input);
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
  },
};
