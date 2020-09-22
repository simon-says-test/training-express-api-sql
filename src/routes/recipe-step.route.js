const express = require('express');
const recipeStepConnector = require('../connectors/recipe-step.connector');
const { NotFoundException } = require('../utils/errors');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await recipeStepConnector.createRecipe(req.body);
  res.setHeader('Location', `/${result.recipe_id}`);
  res.status(201).send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await recipeStepConnector.deleteRecipe(req.params.id);
  res.status(200).send(result);
});

router.get('/', async (req, res) => {
  const searchTerm = req.query.search;
  const result = await recipeStepConnector.getRecipes(searchTerm);
  res.status(200).send(result);
});

router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await recipeStepConnector.getRecipe(req.params.id);
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    res.send(recipe);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res) => {
  res.send(await recipeStepConnector.updateRecipe(req.params.id, req.body));
});

router.patch('/:id/steps', async (req, res) => {
  res.send(await recipeStepConnector.updateRecipeSteps(req.params.id, req.body));
});

module.exports = router;
