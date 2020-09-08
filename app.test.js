require('dotenv').config();
const request = require('supertest');
const { app, connectToDataSources } = require('./app');
const { Connection } = require('./mongo-connection');
let client, recipes;

const baseUrl = "http://localhost:3000/recipes";
const seed = [
  { title: "Banoffee Pie", 
    shortDescription: "An English dessert pie made from bananas, cream and caramel.", 
    preparationTime: 25 },
  { title: "Pizza Marghrita", 
  shortDescription: "Pizza Margherita is a typical Neapolitan pizza, made with tomatoes, mozzarella cheese, fresh basil and olive oil.", 
  preparationTime: 30 }
];

const establishConnection = async (collection) => {
  client = await Connection.connectToMongo();
  return client.db('training-simon').collection(collection);
}

const resetDb = async (recipes) => {
  await recipes.deleteMany({});
  await recipes.insertMany(seed);
};

describe("POST to /recipes", () => {
  beforeAll(async () => {
    await connectToDataSources();
    recipes = await establishConnection('recipes');
  })
  
  beforeEach(async function() {
    await resetDb(recipes);
  });

  test("A valid recipe results is saved and can be retrieved", async () => {
    const data = { title: "Beans on toast", 
    shortDescription: "Traditional English fare, much beloved of children, students and the lazy.", 
    preparationTime: 5 };
    const postResponse = await request(app)
      .post('/recipes')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

      expect(postResponse.status).toBe(201);
      const { _id, ...body } = postResponse.body;
      expect(body).toEqual(data);
      expect(_id.length).toBe(24);

      const getResponse = await request(app)
        .get(`/recipes/${_id}`)
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(getResponse.status).toBe(200);  
      expect(getResponse.body).toEqual(postResponse.body);
  });

  test("Results can retrieved and the first one deleted", async () => {
    
    const getResponse = await request(app)
      .get(`/recipes`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toBe(200);
    getResponse.body.forEach(obj => { 
      expect(seed.some(r => r._id == obj._id)).toBe(true);
    });

    const deleteResponse = await request(app)
      .delete(`/recipes/${getResponse.body[0]._id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ deletedCount: 1 });
  });

  afterAll(async () => {
    recipes = null;
    await client.close();
  })
});  