require('dotenv').config();
const request = require('supertest');
const { app, connectToDataSources } = require('./app');
const { Connection } = require('./mongo-connection');
let client, people;

const baseUrl = "http://localhost:3000/people";
const seed = [
  { firstName: "Bob", lastName: "Bobbs", age: 39 },
  { firstName: "Tee", lastName: "Bone", age: 45 }
];

const establishConnection = async (collection) => {
  client = await Connection.connectToMongo();
  return client.db('training-simon').collection(collection);
}

const resetDb = async (people) => {
  await people.deleteMany({});
  await people.insertMany(seed);
};

describe("POST to /people", () => {
  beforeAll(async () => {
    await connectToDataSources();
    people = await establishConnection('people');
  })
  
  beforeEach(async function() {
    await resetDb(people);
  });

  test("A valid person results is saved and can be retrieved", async () => {
    const data = { firstName: "Simon", lastName: "Thomas", age: 39 };
    const postResponse = await request(app)
      .post('/people')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

      expect(postResponse.status).toBe(201);
      const { _id, ...body } = postResponse.body;
      expect(body).toEqual(data);
      expect(_id.length).toBe(24);

      const getResponse = await request(app)
        .get(`/people/${_id}`)
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(getResponse.status).toBe(200);  
      expect(getResponse.body).toEqual(postResponse.body);
  });

  test("Results can retrieved and the first one deleted", async () => {
    
    const getResponse = await request(app)
      .get(`/people`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(getResponse.status).toBe(200);
    getResponse.body.forEach(obj => { 
      expect(seed.some(r => r._id == obj._id)).toBe(true);
    });

    const deleteResponse = await request(app)
      .delete(`/people/${getResponse.body[0]._id}`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ deletedCount: 1 });
  });

  afterAll(async () => {
    people = null;
    await client.close();
  })
});  