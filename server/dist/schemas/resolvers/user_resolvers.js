// import { getUserId } from "../../services/auth.js";
import User from "../../models/User.js";
import { getErrorMessage } from "../../controllers/index.js";
import { GraphQLError } from 'graphql';
const user_resolvers = {
    Query: {
        // Get User Books
        async getUserBooks(_, __, context) {
            const user_id = context.req.user_id;
            // If the client didn't send a cookie, we just send back an empty array
            if (!user_id) {
                return [];
            }
            const user = await User.findById(user_id);
            // Return just the user's books array, not the user object
            return user?.savedBooks;
        },
    },
    Mutation: {
        async saveBook(_, args, context) {
            if (!context.req.user_id) {
                return {
                    errors: ['You are not authorized to perform this action']
                };
            }
            try {
                await User.findOneAndUpdate({ _id: context.req.user_id }, { $addToSet: { savedBooks: args.book } }, { new: true, runValidators: true });
                // Return generic response - This is NOT used on the client-side, but we must return a response
                return {
                    message: 'Book saved successfully!'
                };
            }
            catch (error) {
                console.log('SAVE BOOK ERROR', error);
                const errorMessage = getErrorMessage(error);
                throw new GraphQLError(errorMessage);
            }
        },
        async deleteBook(_, args, context) {
            const updatedUser = await User.findOneAndUpdate({ _id: context.req.user_id }, { $pull: { savedBooks: { googleBookId: args.googleBookId } } }, { new: true });
            if (!updatedUser) {
                throw new GraphQLError("Couldn't find user with this id!");
            }
            // Return generic response - This is NOT used on the client-side, but we must return a response
            return {
                message: 'Book deleted successfully!'
            };
        }
    }
};
export default user_resolvers;
