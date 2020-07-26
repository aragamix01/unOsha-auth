const { ApolloServer } = require('apollo-server-express');
import express from 'express';
import mongoose from 'mongoose';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const redis = require('redis');
const client = redis.createClient();
const app = express();

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

server.applyMiddleware({ app });

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.use('/graphql', myLogger);

app.get('/hello', (req, res) => {
  res.send('hello');
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
