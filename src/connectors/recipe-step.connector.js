const { Connection } = require('./connection');

const createRecipeStep = async (recipeStep) => {
  const sql = `INSERT INTO recipes (step_number, step_text) 
               VALUES ($1, $2)`;
  return Connection.run(sql, [recipeStep.step_number, recipeStep.step_text]);
};

const deleteRecipeStep = async (id) => {
  const sql = `DELETE FROM recipe_steps 
               WHERE recipe_step_id = $1`;
  return Connection.run(sql, [id]);
};

const getRecipeSteps = async (recipeId) => {
  const sql = `SELECT recipe_step_id, recipe_id, step_number, step_text 
               FROM recipe_steps 
               WHERE recipe_id = $1
               ORDER BY step_number`;
  return Connection.all(sql, [recipeId]);
};

const updateRecipeStep = async (id, recipeStep) => {
  const sql = `UPDATE recipe_steps
               SET step_number = $1, step_text = $2
               WHERE recipe_step_id = $3`;
  return Connection.run(sql, [recipeStep.step_number, recipeStep.step_text, id]);
};

module.exports = {
  createRecipeStep,
  deleteRecipeStep,
  getRecipeSteps,
  updateRecipeStep,
};
