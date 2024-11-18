// config/db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionString = process.env.MONGO_URI;

if (!connectionString) {
  throw new Error("MongoDB connection string is undefined. Please check your .env file.");
}

const client = new MongoClient(connectionString);

const database = "VITAL_SIGNS";

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}






module.exports = { client, database, connectDB };
