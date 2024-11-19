import { getUserId } from "../../services/auth.js";

const user_resolvers = {
    Query: {
        async getUserBooksoks = async (req: Request, res: Response) => {
            const user_id = getUserIdId(req);
          
            // If the client didn't send a cookie, we just send back an empty array
            if (!user_id) {
              return res.json([]);
            }
          
            const user = await User.findById(user_id);
          
            // Return just the user's books array, not the user object
            return res.json(user?.savedBooks);
          }
    }

};

export default user_resolvers;