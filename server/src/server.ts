import express from 'express';
import { ApolloServer } from '@apollo/server';
import path from 'node:path';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';

import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {context: authenticateToken})
);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

db.once('open', async () => {
  await server.start();
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
