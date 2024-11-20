import { gql } from "@apollo/client";

// Auth mutations
export const REGISTER_USER = gql`
    mutation RegisterUser($username: String, $email: String, $password: String) {
        registerUser(username: $username, email: $email, password: $password) {
            errors
            user {
            _id
            username
            }
        }
    }
`;


export const LOGIN_USER = gql`
    mutation LoginUser($email: String, $password: String) {
        loginUser(email: $email, password: $password) {
            errors
            user {
            _id
            username
            }
        }
    }
`;


export const LOGOUT_USER = gql`
    mutation LogoutUser {
        logoutUser {
            message
        }
    }
`;

// User Mutations
export const SAVE_BOOK = gql``;

export const DELETE_BOOK = gql``;
