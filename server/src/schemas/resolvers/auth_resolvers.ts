import { getErrorMessage } from "../../controllers/index.js";
import User from "../../models/User.js";
import { signToken } from "../../services/auth.js";
import { Types } from "mongoose";
import { GraphQLError } from 'graphql';


import Context from "../../interfaces/Context.js";


const auth_resolvers = {
    Query: {
        async getUser(_: any, __: any, context: Context) {
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
        async registerUser(_: any, args: { username: string; email: string; password: string }, context: Context) {
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
            } catch (error: any) {
                const errorMessage = getErrorMessage(error);


                throw new GraphQLError(errorMessage);
            }
        },

        async loginUser(_: any, args: { email: string; password: string }, context: Context) {
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
            const token = signToken(user._id as Types.ObjectId);

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

        logoutUser(_: any, __: any, context: Context) {
            context.res.clearCookie('book_app_token');

            return {
                user: null,
                message: 'Logged out successfully!'
            };
        }

    }

};

export default auth_resolvers;