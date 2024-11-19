import dotenv from 'dotenv';
dotenv.config();
import auth_resolvers from './resolvers/auth_resolvers.js';
import user_resolvers from './resolvers/user_resolvers.js';
const resolvers = {
    Query: {
        ...auth_resolvers.Query,
        ...user_resolvers.Query
    },
    Mutation: {
        ...auth_resolvers.Mutation,
        ...user_resolvers.Mutation
    }
};
export default resolvers;
