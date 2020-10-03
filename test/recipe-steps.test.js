/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const request = require('supertest');
const winston = require('winston');
const { app } = require('../src/app');
const { Connection } = require('../src/connectors/connection');

const resetDb = async () => {
  await Connection.run('DELETE FROM recipe_steps', []);
  await Connection.run('DELETE FROM recipes', []);
  const sqlInsertRecipes = `INSERT INTO recipes (title, short_description, preparation_time) VALUES
        ('Banoffee Pie', 'An English dessert pie made from bananas, cream and caramel.', 25),
        ('Pizza Margherita', 'Pizza Margherita is a typical Neapolitan pizza, made with tomatoes, mozzarella cheese, fresh basil and olive oil.', 30);`;
  await Connection.run(sqlInsertRecipes, []);
  const sqlInsertRecipeSteps = `INSERT INTO recipe_steps (recipe_id, step_number, step_text) VALUES
        (1, 1, 'Crush biscuits.'),
        (1, 2, 'Boil milk.'),
        (2, 1, 'Argue over whether to add pineapple.');`;
  await Connection.run(sqlInsertRecipeSteps, []);
};

describe('HTTP requests to /recipe-steps', () => {
  beforeAll(async () => {
    winston.level = 'warning';
    await Connection.connect();
    await Connection.resetDb();
  });

  beforeEach(async () => {
    await resetDb();
  });

  test('A valid recipe step can be saved and then retrieved and updated', async () => {
    const data = {
      recipe_id: 1,
      step_number: 3,
      step_text: 'Chop bananas.',
    };
    const postResponse = await request(app)
      .post('/recipes/1/recipe-steps')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(postResponse.status).toEqual(201);
    const { lastID, changes } = postResponse.body;
    expect(lastID).toBeGreaterThan(0);
    expect(changes).toEqual(1);

    const getResponse = await request(app)
      .get(`/recipes/1/recipe-steps/${lastID}/`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.step_text).toEqual('Chop bananas.');

    const newData = {
      step_number: 3,
      step_text: 'Cut bananas.',
    };

    const putResponse = await request(app)
      .put(`/recipes/1/recipe-steps/${getResponse.body.recipe_step_id}`)
      .send(newData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(putResponse.status).toEqual(200);
    expect(putResponse.body.changes).toEqual(1);

    const getResponse2 = await request(app)
      .get(`/recipes/1/recipe-steps/${getResponse.body.recipe_step_id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.step_text).toEqual('Cut bananas.');
  });

  test('Recipe steps for a recipe can retrieved and deleted', async () => {
    const getResponse = await request(app)
      .get(`/recipes/1/recipe-steps`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.length).toEqual(2);

    const deleteResponse = await request(app)
      .delete(`/recipes/1/recipe-steps/${getResponse.body[0].recipe_step_id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.changes).toEqual(1);

    const getResponse2 = await request(app)
      .get('/recipes/1/recipe-steps')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toEqual(200);
    expect(getResponse2.body.length).toEqual(1);
    expect(getResponse2.body[0].step_text).toEqual('Boil milk.');
  });

  test('Exceptions are reported correctly', async () => {
    const newData = {
      recipe_id: 99,
      step_number: 3,
      step_text: 'Cut bananas.',
    };

    const putResponse = await request(app)
      .put(`/recipes/1/recipe-steps/1`)
      .send(newData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(putResponse.status).toEqual(400);

    const getResponse2 = await request(app)
      .get('/recipes/1/recipe-step/wrong')
      .send()
      .set('Accept', 'application/json');

    expect(getResponse2.status).toEqual(404);
  });

  afterAll(async () => {
    await Connection.db.close();
  });
});
