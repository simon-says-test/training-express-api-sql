const { Connection } = require('./connection');
const { BadRequestException } = require('./errors');

const establishConnection = async () => Connection.connect();

const createRecipe = async (recipe) => {
  const sql = `INSERT INTO recipes (title, short_description, preparation_time) 
               VALUES ($1, $2, $3)`;
  const result = await Connection.run(sql, [
    recipe.title,
    recipe.short_description,
    recipe.preparation_time,
  ]);
  return result;
};

const deleteRecipe = async (id) => {
  const sql = `DELETE FROM recipes 
               WHERE recipe_id = $1`;
  const result = await Connection.run(sql, [id]);
  return result;
};

const getRecipes = async (searchTerm) => {
  if (!searchTerm) {
    return Connection.all(`SELECT recipe_id, title, short_description, preparation_time 
                           FROM recipes`);
  }
  const sql = `SELECT recipe_id, title, short_description, preparation_time 
               FROM recipes 
               WHERE title LIKE $1
               OR short_description LIKE $2`;
  const result = await Connection.all(sql, [`%${searchTerm}%`, `%${searchTerm}%`]);
  return result;
};

const getRecipe = async (id) => {
  const sql = `SELECT recipe_id, title, short_description, preparation_time 
               FROM recipes 
               WHERE recipe_id = $1`;
  const result = await Connection.get(sql, [id]);
  return result;
};

const updateRecipe = async (id, recipe) => {
  const sql = `UPDATE recipes
               SET title = $1, short_description = $2, preparation_time = $3
               WHERE recipe_id = $4`;
  const result = await Connection.run(sql, [
    recipe.title,
    recipe.short_description,
    recipe.preparation_time,
    id,
  ]);
  return result;
};

const getRecipeSteps = async (recipeId) => {
  const sql = `SELECT recipe_step_id, recipe_id, step_number, step_text 
               FROM recipe_steps 
               WHERE recipe_id = $1
               ORDER BY step_number`;
  const result = await Connection.all(sql, [recipeId]);
  return result;
};

const updateRecipeStep = async (id, recipeStep) => {
  const sql = `UPDATE recipe_steps
               SET step_number = $1, step_text = $2
               WHERE recipe_step_id = $3`;
  const result = await Connection.run(sql, [recipeStep.step_number, recipeStep.step_text, id]);
  return result;
};

const createRecipeStep = async (recipeStep) => {
  const sql = `INSERT INTO recipes (step_number, step_text) 
               VALUES ($1, $2)`;
  const result = await Connection.run(sql, [recipeStep.step_number, recipeStep.step_text]);
  return result;
};

const deleteRecipeStep = async (id) => {
  const sql = `DELETE FROM recipe_steps 
               WHERE recipe_step_id = $1`;
  const result = await Connection.run(sql, [id]);
  return result;
};

const updateRecipeSteps = async (recipeId, recipeSteps) => {
  const existingSteps = getRecipeSteps(recipeId);
  const deletedSteps = existingSteps.filter(
    (step) => !recipeSteps.some((item) => item.recipe_step_id === step.recipe_step_id),
  );
  deletedSteps.forEach((step) => {
    deleteRecipeStep(step.recipe_step_id);
  });

  recipeSteps.forEach((step) => {
    if (step.recipe_step_id) {
      updateRecipeStep(step.recipe_step_id, step);
    } else {
      createRecipeStep(step);
    }
  });
};

module.exports = {
  createRecipe,
  establishConnection,
  deleteRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  updateRecipeSteps,
};
