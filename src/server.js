const { ApolloServer } = require('apollo-server');
import mongoose from 'mongoose';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
const DBCache = require('./db/dbcache');

mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb+srv://root:root@cluster0.kl2hn.mongodb.net/ginraidee?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log('DB Connected!'))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    // console.log(token);
    return { token };
  },
});

server.listen().then(({ url }) => {
  new DBCache.DBCache();
  console.log(`🚀  Server ready at ${url}`);
});
