const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const authSchema = require('./schemas/authSchema');

dotenv.config();
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
app.use(cors());
app.use(express.json());

connectDB();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: authSchema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});