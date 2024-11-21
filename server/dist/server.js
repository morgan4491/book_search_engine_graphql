import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authenticate } from './services/auth.js';
dotenv.config();
import db from './config/connection.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // Give routes access to req.cookies
// app.use(cookieParser());
// app.use(routes);
// if we're in production, serve client/build as static assets and ensure the index.html file is served for the React Router to handle UI views
db.once('open', async () => {
    await server.start();
    app.use('/graphql', express.urlencoded({ extended: true }), express.json(), cookieParser(), expressMiddleware(server, {
        context: authenticate
    }));
    if (process.env.PORT) {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        app.use(express.static(path.join(__dirname, '../../client/dist')));
        app.get('*', (_, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
    });
});
