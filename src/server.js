const { ApolloServer } = require('apollo-server-express');
import express from 'express';
import mongoose from 'mongoose';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
const DAL = require('./db/dal');

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
const app = express();
const path = '/graphql';

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.use(path, myLogger);

server.applyMiddleware({ app, path });

app.get('/hello', async (req, res) => {
  await DAL.DAL.redisClient.SetDataFromKey('James', 'Krub');
  let a = await DAL.DAL.redisClient.GetDataFromKey('James');
  console.log(a);
  res.send('hello');
});

app.listen(4000, async () => {
  new DAL.DAL();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
