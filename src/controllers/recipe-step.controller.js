const recipeStepConnector = require('../connectors/recipe-step.connector');
const { BadRequestException } = require('../utils/errors');

const createRecipeStep = async (recipeStep) => recipeStepConnector.createRecipeStep(recipeStep);

const deleteRecipeStep = async (id) => recipeStepConnector.deleteRecipeStep(id);

const getRecipeSteps = async (recipeId) => recipeStepConnector.getRecipeSteps(recipeId);

const updateRecipeStep = async (id, recipeStep) =>
  recipeStepConnector.updateRecipeStep(id, recipeStep);

const updateRecipeStepCollection = async (recipeId, currentSteps) => {
  const deletedSteps = (await recipeStepConnector.getRecipeSteps(recipeId)).filter(
    (step) => !currentSteps.some((item) => item.recipe_step_id === step.recipe_step_id)
  );

  const promises = deletedSteps.map((step) =>
    recipeStepConnector.deleteRecipeStep(step.recipe_step_id)
  );

  currentSteps.forEach((step) => {
    if (step.recipe_step_id) {
      promises.push(recipeStepConnector.updateRecipeStep(step.recipe_step_id, step));
    } else {
      promises.push(recipeStepConnector.createRecipeStep(step));
    }
  });

  const changes = (await Promise.all(promises)).reduce((prev, curr) => prev + curr.changes, 0);
  return { changes };
};

module.exports = {
  createRecipeStep,
  deleteRecipeStep,
  getRecipeSteps,
  updateRecipeStep,
  updateRecipeStepCollection,
};
