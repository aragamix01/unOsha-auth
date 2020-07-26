import User from './models/User';

export default {
  Query: {
    async currentUser(root, { input }) {
      console.log(input);
      return await User.findOne(input);
    },
  },

  Mutation: {
    async signup(root, { input: { username, password } }) {
      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        throw new Error('Email already used');
      }
      return await User.create(input);
    },
  },
};
