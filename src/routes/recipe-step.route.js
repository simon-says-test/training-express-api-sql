const express = require('express');
const recipeStepConnector = require('../controllers/recipe-step.controller');
const { NotFoundException } = require('../utils/errors');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await recipeStepConnector.createRecipeStep(req.body);
  res.setHeader('Location', `/${result.recipe_step_id}`);
  res.status(201).send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await recipeStepConnector.deleteRecipeStep(req.params.id);
  res.status(200).send(result);
});

router.get('/', async (req, res) => {
  const { recipeId } = req.query;
  const result = await recipeStepConnector.getRecipeSteps(recipeId);
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const result = await recipeStepConnector.getRecipeStep(req.params.id);
  res.status(200).send(result);
});

router.put('/:id', async (req, res, next) => {
  try {
    res.send(await recipeStepConnector.updateRecipeStep(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/steps', async (req, res) => {
  const { recipeId } = req.query;
  res.send(await recipeStepConnector.updateRecipeSteps(recipeId, req.body));
});

module.exports = router;
