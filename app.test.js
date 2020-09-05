require('dotenv').config();
const request = require('supertest');
const { app, connectToDataSources } = require('./app');
const { Connection } = require('./mongo-connection');
let client;
let people;

const baseUrl = "http://localhost:3000/people";

const establishConnection = async (collection) => {
  client = await Connection.connectToMongo();
  return client.db('training-simon').collection(collection);
}

const resetDb = async (people) => {
  await people.deleteMany({});
  await people.insertMany([
    { id: 1, firstName: "Bob", lastName: "Bobbs", age: 39 },
    { id: 2, firstName: "Tee", lastName: "Bone", age: 45 }
  ]);
};

describe("POST to /people", () => {
  beforeAll(async () => {
    await connectToDataSources();
    people = await establishConnection('people');
  })
  
  beforeEach(async function() {
    await resetDb(people);
  });

  test("A valid person results in success", async () => {
    const data = { firstName: "Simon", lastName: "Thomas", age: 39 };
    const response = await request(app)
      .post('/people')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      const { _id, ...body } = response.body;
      expect(body).toEqual(data);
      expect(_id.length).toBe(24);
  });

  afterAll(async () => {
    people = null;
    await client.close();
  })
});  