import axios from 'axios';
// import { FormData, Book } from '../interfaces/index.d';

// // Get logged in user's info (The browser/client will automatically send the book_app_token cookie)
// export const getUser = async () => {
//   return await axios.get('/auth/user');
// };

// // Get's logged in user's books
// export const getUserBooks = async () => {
//   return await axios.get('/api/books');
// };

// // Registers a user
// export const registerUser = async (userData: FormData) => {
//   return await axios.post('/auth/register', userData);
// };

// // Logs a user in
// export const loginUser = async (userData: FormData) => {
//   return await axios.post('/auth/login', userData);
// };

// // Logs a user out
// export const logoutUser = async ()=> {
//   return await axios.get('/auth/logout');
// };

// // save book data for a logged in user
// // The browser/client will automatically send the book_app_token cookie
// export const saveBook = async (bookData: Book) => {
//   return await axios.put('/api/books', bookData);
// };

// // remove saved book data for a logged in user
// // The browser/client will automatically send the book_app_token cookie
// export const deleteBook = async (bookId: string) => {
//   return await axios.delete(`/api/book/${bookId}`);
// };

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = async (query: string) => {
  try {
    return await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  } catch (error) {
    // Return dummy data if Google Books rate limited is exceeded
    return {
      data: {
        items: [
          {
            id: 'asdfasdflkj',
            volumeInfo: {
              authors: ['Michael Crichton'],
              title: 'Jurassic Park',
              description: 'Amazing story of dinosaurs being resurrected from the past',
              imageLinks: {
                thumbnail: 'https://wallpaperdelight.com/wp-content/uploads/2023/06/dinosaur-thumbnail.webp'
              }
            }
          },
          {
            id: 'oqoieuroqwiure',
            volumeInfo: {
              authors: ['Michael Crichton'],
              title: 'Jurassic Park 2',
              description: 'Amazing story of dinosaurs being resurrected from the past again',
              imageLinks: {
                thumbnail: 'https://wallpaperdelight.com/wp-content/uploads/2023/06/dinosaur-thumbnail.webp'
              }
            }
          }
        ]
      }
    }
  }
};
