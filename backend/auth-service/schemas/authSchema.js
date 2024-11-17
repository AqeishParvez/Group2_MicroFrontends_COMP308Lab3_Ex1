const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');
const { signup, login } = require('../services/authService');

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

// Auth Payload Type
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: {
    token: { type: GraphQLString },
    user: { type: UserType },
  },
});

// Mutation Root
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (_, args) => signup(args),
    },
    login: {
      type: AuthPayloadType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (_, args) => login(args),
    },
  },
});

// Empty Query Root
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    placeholder: {
      type: GraphQLString,
      resolve: () => 'This is a placeholder query.',
    },
  },
});

// Export Schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});