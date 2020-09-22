const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const { NotFoundException } = require('../utils/errors');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await recipeController.createRecipe(req.body);
  res.setHeader('Location', `/${result.recipe_id}`);
  res.status(201).send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await recipeController.deleteRecipe(req.params.id);
  res.status(200).send(result);
});

router.get('/', async (req, res) => {
  const searchTerm = req.query.search;
  const result = await recipeController.getRecipes(searchTerm);
  res.status(200).send(result);
});

router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await recipeController.getRecipe(req.params.id);
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    res.send(recipe);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res) => {
  res.send(await recipeController.updateRecipe(req.params.id, req.body));
});

module.exports = router;
