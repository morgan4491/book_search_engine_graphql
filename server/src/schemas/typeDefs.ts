const gql = String.raw;

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [BookDocument]
    }

    type Query {

    }

    type Mutation {
        
    }
`;

export default typeDefs;