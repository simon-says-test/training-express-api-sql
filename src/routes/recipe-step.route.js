const express = require('express');
const RecipeStepConnector = require('../connectors/recipe-step.connector');
const { NotFoundException } = require('../utils/errors');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await RecipeStepConnector.createRecipe(req.body);
  // eslint-disable-next-line no-underscore-dangle
  res.setHeader('Location', `/${result.recipe_id}`);
  res.status(201);
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await RecipeStepConnector.deleteRecipe(req.params.id);
  res.status(200);
  res.send(result);
});

router.get('/', async (req, res) => {
  const searchTerm = req.query.search;
  const result = await RecipeStepConnector.getRecipes(searchTerm);
  res.status(200);
  res.send(result);
});

router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await RecipeStepConnector.getRecipe(req.params.id);
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    res.send(recipe);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res) => {
  res.send(await RecipeStepConnector.updateRecipe(req.params.id, req.body));
});

router.patch('/:id/steps', async (req, res) => {
  res.send(await RecipeStepConnector.updateRecipeSteps(req.params.id, req.body));
});

module.exports = router;
