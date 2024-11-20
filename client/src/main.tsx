import { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { StoreProvider } from './store/index.tsx';
import { BrowserRouter} from 'react-router-dom';

// import SearchBooks from './pages/SearchBooks.tsx';
// import SavedBooks from './pages/SavedBooks.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.tsx';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
    )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: '/graphql' })
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache
});

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <h1 className='display-2'>Wrong page!</h1>,
//     children: [
//       {
//         index: true,
//         element: <SearchBooks />
//       }, {
//         path: '/saved',
//         element: <SavedBooks />
//       }
//     ],

//   }
// ], {
//   future: {
//     // Router optional flags to get rid of future update warnings
//     v7_relativeSplatPath: true,
//     v7_fetcherPersist: true,
//     v7_normalizeFormMethod: true,
//     v7_partialHydration: true,
//     v7_skipActionErrorRevalidation: true
//   },
// })

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <StoreProvider>
//     <RouterProvider router={router} future={{
//       // Router optional flag to get rid of future update warnings
//       v7_startTransition: true
//     }} />
//   </StoreProvider>
// )

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <StoreProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StoreProvider>
    </ApolloProvider>
  </StrictMode>
)