// Get dependencies
require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const recipeRouter = require('./routes/recipe.route');
const errorHandler = require('./utils/error-handler');
const { Connection } = require('./connectors/connection');

const app = express();

app.use(express.json()); // support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // support URL-encoded bodies
app.use(logger.logger);

app.use('/recipes', recipeRouter);
app.get('/', async (req, res) => {
  res.send('Please navigate to a valid operation');
});

app.use(logger.logger);
app.use(errorHandler.handler);

const connectToDataSources = async () => {
  await Connection.connect();
};

module.exports = { app, connectToDataSources };
