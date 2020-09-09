// Get dependencies
require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const { NotFoundException } = require('./errors');
const errorHandler = require('./error-handler');
const RecipesConnector = require('./recipes-connector');

const app = express();

app.use(express.json()); // support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // support URL-encoded bodies
app.use(logger.logger);

app.post('/recipes', async (req, res) => {
  const result = await RecipesConnector.createRecipe(req.body);
  // eslint-disable-next-line no-underscore-dangle
  res.setHeader('Location', `/${result._id}`);
  res.status(201);
  res.send(result);
});

app.delete('/recipes/:id', async (req, res) => {
  const result = await RecipesConnector.deleteRecipe(req.params.id);
  res.status(200);
  res.send(result);
});

app.get('/recipes', async (req, res) => {
  const searchTerm = req.query.search;
  const result = await RecipesConnector.getRecipes(searchTerm);
  res.status(200);
  res.send(result);
});

app.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await RecipesConnector.getRecipe(req.params.id);
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    res.send(recipe);
  } catch (e) {
    next(e);
  }
});

app.patch('/recipes/:id', async (req, res) => {
  res.send(await RecipesConnector.updateRecipe(req.params.id, req.body));
});

app.get('/', async (req, res) => {
  res.send('Please navigate to a valid operation');
});

app.use(logger.logger);
app.use(errorHandler.handler);

const connectToDataSources = async () => {
  await RecipesConnector.establishConnection();
};

module.exports = { app, connectToDataSources };
