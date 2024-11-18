const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } = require("graphql");
const User = require("../models/user");
const VitalSigns = require("../models/vitalSigns");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Type Definition
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
  }),
});

// VitalSigns Type Definition
const VitalSignsType = new GraphQLObjectType({
  name: "VitalSigns",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    bloodPressure: { type: GraphQLString },
    heartRate: { type: GraphQLString },
    temperature: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  })
});

// RootQuery Definition
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    vitalSigns: {
      type: new GraphQLList(VitalSignsType),
      args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return VitalSigns.find({ userId: args.userId });
      },
    },
    vitalSign: {
      type: VitalSignsType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return VitalSigns.findById(args.id);
      },
    },
  },
});

// Mutations Definition
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const hashedPassword = await bcrypt.hash(args.password, 12);
        const user = new User({
          email: args.email,
          username: args.username,
          password: hashedPassword,
        });
        return user.save();
      },
    },
    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        return jwt.sign({ userId: user.id }, process.env.SECRET_KEY || "secret", {
          expiresIn: "1h",
        });
      },
    },
    addVitalSigns: {
      type: VitalSignsType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        bloodPressure: { type: GraphQLString },
        heartRate: { type: GraphQLString },
        temperature: { type: GraphQLString },
      },
      resolve(parent, args) {
        const vitalSigns = new VitalSigns({
          userId: args.userId,
          bloodPressure: args.bloodPressure,
          heartRate: args.heartRate,
          temperature: args.temperature,
        });
        return vitalSigns.save();
      },
    },


    updateVitalSigns: { 
      type: VitalSignsType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        bloodPressure: { type: GraphQLString },
        heartRate: { type: GraphQLString },
        temperature: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return await VitalSigns.findByIdAndUpdate(
          args.id,
          {
            bloodPressure: args.bloodPressure,
            heartRate: args.heartRate,
            temperature: args.temperature,
          },
          { new: true }
        );
      },
        },
        deleteVitalSign: {
          type: VitalSignsType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
          },
          async resolve(parent, args) {
            return await VitalSigns.findByIdAndDelete(args.id);
          },
        },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});