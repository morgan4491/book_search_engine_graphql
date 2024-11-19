import { getUserId } from "../../services/auth.js";
import User from "../../models/User.js";
import { getErrorMessage } from "../../controllers/helpers/index.js";

const user_resolvers = {
  Query: {
    // Get User Books
    async getUserBooks(req: any) {
      const user_id = getUserId(req);

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
    async saveBook(req: any) {
      try {
        await User.findOneAndUpdate(
          { _id: req.user_id },
          { $addToSet: { savedBooks: req.body } },
          { new: true, runValidators: true }
        );

        // Return generic response - This is NOT used on the client-side, but we must return a response
        return {
          message: 'Book saved successfully!'
        };
      } catch (error) {
        console.log('SAVE BOOK ERROR', error);

        const errorMessage = getErrorMessage(error);

        return {
          message: errorMessage
        };
      }
    },

    async deleteBook (req: any) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { savedBooks: { googleBookId: req.params.bookId } } },
        { new: true }
      );
    
      if (!updatedUser) {
        return {
          message: "Couldn't find user with this id!"
        };
      }
    
      // Return generic response - This is NOT used on the client-side, but we must return a response
      return {
        message: 'Book deleted successfully!'
      };
    }
  }

};

export default user_resolvers;