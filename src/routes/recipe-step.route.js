const express = require('express');
const recipeStepController = require('../controllers/recipe-step.controller');
const { CustomException } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  const result = await recipeStepController.createRecipeStep(req.params.recipeId, req.body);
  res.setHeader('Location', `/${result.recipe_step_id}`);
  res.status(201).send(result);
});

router.delete('/:id', async (req, res) => {
  const result = await recipeStepController.deleteRecipeStep(req.params.id);
  res.send(result);
});

router.get('/', async (req, res) => {
  const { recipeId } = req.params;
  const result = await recipeStepController.getRecipeSteps(recipeId);
  res.send(result);
});

router.get('/:id', async (req, res) => {
  const result = await recipeStepController.getRecipeStep(req.params.id);
  res.send(result);
});

router.put('/:id', async (req, res, next) => {
  try {
    res.send(await recipeStepController.updateRecipeStep(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    res.send(await recipeStepController.updateRecipeSteps(recipeId, req.body));
  } catch (err) {
    next(new CustomException('Unable to create recipe step', err));
  }
});

module.exports = router;
