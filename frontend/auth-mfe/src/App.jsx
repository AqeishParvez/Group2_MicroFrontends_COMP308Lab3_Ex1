import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import AuthForm from './components/AuthForm';
import "bootstrap/dist/css/bootstrap.min.css";

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <AuthForm />
  </ApolloProvider>
);

export default App;