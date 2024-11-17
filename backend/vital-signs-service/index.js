const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');
const vitalSignsSchema = require('./schemas/vitalSignsSchema');

dotenv.config();
const app = express();

connectDB();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: vitalSignsSchema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Vital Signs Service running on http://localhost:${PORT}/graphql`);
});