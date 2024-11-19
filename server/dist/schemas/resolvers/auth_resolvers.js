import { getErrorMessage } from "../../controllers/index.js";
import User from "../../models/User.js";
import { signToken } from "../../services/auth.js";
import { GraphQLError } from 'graphql';
const auth_resolvers = {
    Query: {
        async getUser(_, __, context) {
            // Retrieves the user_id from the request object - Check out services/auth.ts->getUserId
            const user_id = context.user_id;
            if (!user_id) {
                return {
                    user: null
                };
            }
            const user = await User.findById(user_id).select('_id username savedBooks');
            if (!user) {
                return {
                    user: null
                };
            }
            return {
                user: user
            };
        }
    },
    Mutation: {
        async registerUser(_, args, context) {
            try {
                const user = await User.create(args);
                // Create a JWT token
                const token = signToken(user._id);
                // Send a cookie back with the JWT attached
                context.res.cookie('book_app_token', token, {
                    httpOnly: true,
                    secure: process.env.PORT ? true : false,
                    sameSite: true
                });
                return {
                    user: user
                };
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                throw new GraphQLError(errorMessage);
            }
        },
        async loginUser(_, args, context) {
            // Find their user object by the email address provided in the client form
            const user = await User.findOne({
                email: args.email
            });
            if (!user) {
                throw new GraphQLError('No user found with that email address');
            }
            // Check if their password matches the encrypted password stored on their user object
            const valid_pass = await user.validatePassword(args.password);
            if (!valid_pass) {
                throw new GraphQLError('Password is incorrect');
            }
            // Create a JWT token
            const token = signToken(user._id);
            // Send a cookie back with the JWT attached
            context.res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });
            return {
                user: user
            };
        },
        logoutUser(_, __, context) {
            context.res.clearCookie('book_app_token');
            return {
                user: null,
                message: 'Logged out successfully!'
            };
        }
    }
};
export default auth_resolvers;
