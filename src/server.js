import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
