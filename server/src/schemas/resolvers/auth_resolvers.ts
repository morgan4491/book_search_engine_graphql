import { getErrorMessage } from "../../controllers/helpers";
import User from "../../models/User";
import { signToken } from "../../services/auth";


const auth_resolvers = {
    Query: {
        async getUser(req: any) {
            // Retrieves the user_id from the request object - Check out services/auth.ts->getUserId
            const user_id = this.getUserId(req);

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
        };

    },

    Mutation: {
        async registerUser(req: Request, res: Response) {
            try {
                const user = await User.create(req.body);
                // Create a JWT token
                const token = signToken(user._id as Types.ObjectId);

                // Send a cookie back with the JWT attached
                res.cookie('book_app_token', token, {
                    httpOnly: true,
                    secure: process.env.PORT ? true : false,
                    sameSite: true
                });

                return { user };
            } catch (error: any) {
                const errorMessage = getErrorMessage(error);


                return {
                    message: errorMessage
                };
            }
        },

        async loginUser(req: Request, res: Response) {
            // Find their user object by the email address provided in the client form
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return {
                    message: "No user found with that email address"
                };
            }

            // Check if their password matches the encrypted password stored on their user object
            const valid_pass = await user.validatePassword(req.body.password);

            if (!valid_pass) {
                return {
                    message: 'Wrong password!'
                };
            }

            // Create a JWT token
            const token = signToken(user._id as Types.ObjectId);

            // Send a cookie back with the JWT attached
            res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });

            return {
                user: user
            };
        },

    }

};

export default auth_resolvers;