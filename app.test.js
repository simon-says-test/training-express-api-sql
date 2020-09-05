require('dotenv').config();
const request = require("request-promise-native");
const { Connection } = require('./mongo-connection');
let client;
let people;

const establishConnection = async (collection) => {
  client = await Connection.connectToMongo();
  return client.db('training-simon').collection(collection);
}

const baseUrl = "http://localhost:3000/people";

const resetDb = async (people) => {
  await people.deleteMany({});
  await people.insertMany([
    { id: 1, firstName: "Bob", lastName: "Bobbs", age: 39 },
    { id: 2, firstName: "Tee", lastName: "Bone", age: 45 }
  ]);
};

describe("POST to /people", () => {
  beforeAll(async () => {
    people = await establishConnection('people');
  })
  
  beforeEach(async function() {
    await resetDb(people);
  });

  describe("Given a valid person", () => {
    const requestOptions = {
      uri: `${baseUrl}`,
      json: true,
      method: "POST",
      body: { firstName: "Simon", lastName: "Thomas", age: 39 }
    };
    it("should return a success status and message", async () => {
      const response = await request(requestOptions);
      console.log(response);
      //expect(response.statusCode).toBe(200);
      expect(response).toBe("Creation successful");
    });
  });

  afterAll(async () => {
    people = null;
    await client.close();
  })
});  