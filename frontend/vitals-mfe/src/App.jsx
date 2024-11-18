import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import VitalSignsForm from './components/VitalSignsForm';
import "bootstrap/dist/css/bootstrap.min.css";


const client = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  
  <ApolloProvider client={client}>
    <VitalSignsForm />
  </ApolloProvider>
);

export default App;
