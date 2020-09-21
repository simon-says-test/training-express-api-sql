const express = require('express');
const RecipeConnector = require('../connectors/recipe.connector');
const { NotFoundException } = require('../utils/errors');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await RecipeConnector.createRecipe(req.body);
  // eslint-disable-next-line no-underscore-dangle
  res.setHeader('Location', `/${result.recipe_id}`);
  res.status(201);
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await RecipeConnector.deleteRecipe(req.params.id);
  res.status(200);
  res.send(result);
});

router.get('/', async (req, res) => {
  const searchTerm = req.query.search;
  const result = await RecipeConnector.getRecipes(searchTerm);
  res.status(200);
  res.send(result);
});

router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await RecipeConnector.getRecipe(req.params.id);
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    res.send(recipe);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res) => {
  res.send(await RecipeConnector.updateRecipe(req.params.id, req.body));
});

module.exports = router;
