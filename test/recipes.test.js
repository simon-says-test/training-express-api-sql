/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const request = require('supertest');
const winston = require('winston');
const { app } = require('../src/app');
const { Connection } = require('../src/connectors/connection');

const resetDb = async () => {
  await Connection.run('DELETE FROM recipes', []);
  const sqlInsert = `INSERT INTO recipes (title, short_description, preparation_time) VALUES
        ('Banoffee Pie', 'An English dessert pie made from bananas, cream and caramel.', 25),
        ('Pizza Margherita', 'Pizza Margherita is a typical Neapolitan pizza, made with tomatoes, mozzarella cheese, fresh basil and olive oil.', 30);`;
  await Connection.run(sqlInsert, []);
};

describe('HTTP requests to /recipes', () => {
  beforeAll(async () => {
    winston.level = 'warning';
    await Connection.connect();
    await Connection.resetDb();
  });

  beforeEach(async () => {
    await resetDb();
  });

  test('A valid recipe can be saved and then retrieved', async () => {
    const data = {
      title: 'Beans on toast',
      short_description:
        'Traditional English fare, much beloved of children, students and the lazy.',
      preparation_time: 5,
    };
    const postResponse = await request(app)
      .post('/recipes')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(postResponse.status).toEqual(201);
    const { lastID, changes } = postResponse.body;
    expect(lastID).toBeGreaterThan(0);
    expect(changes).toEqual(1);

    const getResponse = await request(app)
      .get(`/recipes/${lastID}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.title).toEqual('Beans on toast');
  });

  test('Recipes can retrieved and deleted', async () => {
    const getResponse = await request(app)
      .get('/recipes')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.length).toEqual(2);

    const deleteResponse = await request(app)
      .delete(`/recipes/${getResponse.body[0].recipe_id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.changes).toEqual(1);

    const getResponse2 = await request(app)
      .get('/recipes')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toEqual(200);
    expect(getResponse2.body.length).toEqual(1);
    expect(getResponse2.body[0].title).toEqual('Pizza Margherita');
  });

  test('Results can be retrieved using a search term and then replaced', async () => {
    const getResponse = await request(app)
      .get('/recipes?search=Ban')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body.length).toEqual(1);
    expect(getResponse.body[0].title).toEqual('Banoffee Pie');

    const data = {
      title: 'Banoffee Pie',
      short_description: 'Very tasty.',
      preparation_time: 35,
    };

    const putResponse = await request(app)
      .put(`/recipes/${getResponse.body[0].recipe_id}`)
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(putResponse.status).toEqual(200);
    expect(putResponse.body.changes).toEqual(1);

    const getResponse2 = await request(app)
      .get('/recipes?search=made')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.length).toBe(1);
  });

  test('Exceptions are reported correctly', async () => {
    const getResponse = await request(app)
      .get('/recipes/wrong')
      .send()
      .set('Accept', 'application/json');

    expect(getResponse.status).toEqual(404);
  });

  afterAll(async () => {
    await Connection.db.close();
  });
});
