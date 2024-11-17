const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = require('graphql');
const { addVitalSign, updateVitalSign, getVitalSigns } = require('../services/vitalSignsService');
const VitalSign = require('../models/vitalSignsModel');

const VitalSignType = new GraphQLObjectType({
  name: 'VitalSign',
  fields: {
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    bloodPressure: { type: GraphQLString },
    heartRate: { type: GraphQLInt },
    temperature: { type: GraphQLInt },
    date: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    vitalSigns: {
      type: new GraphQLList(VitalSignType),
      args: { userId: { type: GraphQLString } },
      resolve: async (_, args) => getVitalSigns(args.userId),
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addVitalSign: {
      type: VitalSignType,
      args: {
        userId: { type: GraphQLString },
        bloodPressure: { type: GraphQLString },
        heartRate: { type: GraphQLInt },
        temperature: { type: GraphQLInt },
      },
      resolve: async (_, args) => addVitalSign(args),
    },
    updateVitalSign: {
      type: VitalSignType,
      args: {
        id: { type: GraphQLString },
        bloodPressure: { type: GraphQLString },
        heartRate: { type: GraphQLInt },
        temperature: { type: GraphQLInt },
      },
      resolve: async (_, args) => updateVitalSign(args.id, args),
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });