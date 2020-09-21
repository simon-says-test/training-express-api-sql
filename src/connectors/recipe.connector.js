const { Connection } = require('./connection');
const { BadRequestException } = require('../utils/errors');

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

module.exports = {
  createRecipe,
  deleteRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
};
