import { GraphQLClient } from 'graphql-request';

// Create a GraphQL client instance
export const graphqlClient = new GraphQLClient('/graphql', {
  headers: {
    // You can add any headers needed for authentication here
  },
});
