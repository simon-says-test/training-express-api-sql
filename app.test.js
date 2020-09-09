/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const request = require('supertest');
const { app, connectToDataSources } = require('./app');
const { Connection } = require('./mongo-connection');

let client;
let recipeCollection;

const seed = [
  {
    title: 'Banoffee Pie',
    shortDescription: 'An English dessert pie made from bananas, cream and caramel.',
    preparationTime: 25,
  },
  {
    title: 'Pizza Margherita',
    shortDescription:
      'Pizza Margherita is a typical Neapolitan pizza, made with tomatoes, mozzarella cheese, fresh basil and olive oil.',
    preparationTime: 30,
  },
];

const establishConnection = async (collection) => {
  client = await Connection.connectToMongo();
  return client.db('training-simon').collection(collection);
};

const resetDb = async () => {
  await recipeCollection.deleteMany({});
  await recipeCollection.insertMany(seed);
};

describe('POST to /recipes', () => {
  beforeAll(async () => {
    await connectToDataSources();
    recipeCollection = await establishConnection('recipes');
  });

  beforeEach(async () => {
    await resetDb();
  });

  test('A valid recipe results is saved and can be retrieved', async () => {
    const data = {
      title: 'Beans on toast',
      shortDescription:
        'Traditional English fare, much beloved of children, students and the lazy.',
      preparationTime: 5,
    };
    const postResponse = await request(app)
      .post('/recipes')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(postResponse.status).toEqual(201);
    const { _id, ...body } = postResponse.body;
    expect(body).toEqual(data);
    expect(_id.length).toEqual(24);

    const getResponse = await request(app)
      .get(`/recipes/${_id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    expect(getResponse.body).toEqual(postResponse.body);
  });

  test('Results can retrieved and the first one deleted', async () => {
    const getResponse = await request(app)
      .get('/recipes')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toEqual(200);
    getResponse.body.forEach((obj) => {
      expect(seed.some((r) => r._id.toString() === obj._id.toString())).toBe(true);
    });

    const deleteResponse = await request(app)
      .delete(`/recipes/${getResponse.body[0]._id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body).toEqual({ deletedCount: 1 });

    const getResponse2 = await request(app)
      .get('/recipes')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toEqual(200);
    expect(getResponse2.body.length).toEqual(1);
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
      shortDescription: 'Very tasty.',
      preparationTime: 35,
    };

    const patchResponse = await request(app)
      .patch(`/recipes/${getResponse.body[0]._id}`)
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(patchResponse.status).toEqual(200);
    expect(patchResponse.body).toEqual({ modifiedCount: 1 });

    const getResponse2 = await request(app)
      .get('/recipes?search=made')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.length).toBe(1);
  });

  afterAll(async () => {
    recipeCollection = null;
    await client.close();
  });
});
