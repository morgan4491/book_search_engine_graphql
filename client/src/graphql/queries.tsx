import { gql } from "@apollo/client"


// Auth queries
export const GET_USER = gql`
    query GetUser {
        getUser {
            user {
                _id
                username
            }
        }
    }
`;


// User queries
export const GET_USER_BOOKS = gql`
    query GetUserBooks {
        getUserBooks {
            googleBookId
            authors
            description
            image
        }
    }
`;

