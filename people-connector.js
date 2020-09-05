const { ObjectID } = require('mongodb')
const { Connection } = require('./mongo-connection');
const { BadRequestException } = require("./errors");
let people;

const establishConnection = async () => {
    const client = await Connection.connectToMongo();
    people = client.db('training-simon').collection('people');
}

const createPerson = async (person) => {
    const result = await people.insertOne(person);
    return result.ops[0];
}

const deletePerson = async (id) => {
    const result = await people.deleteOne({ "_id": getMongoDbId(id) });
    return "Deletion successful";
}

const getPeople = async (searchTerm) => {
    let criteria = {}; 
    if (searchTerm) {
        criteria = { $or: [{ 'firstName': searchTerm }, { 'lastName': searchTerm }] };
    }
    return await people.find(criteria).toArray();
}

const getPerson = async (id) => {
    return await people.findOne({ "_id": getMongoDbId(id)});
}

const updatePerson = async (id, person) => {
    const { _id, ...newPerson } = person; 
    const result = await people.replaceOne({ "_id": getMongoDbId(id)}, newPerson );
    return "Update successful";
}

const getMongoDbId = (id) => {
    try {
        return new ObjectID(id);
    } catch (e) {
        throw new BadRequestException('Invalid ID supplied', e)
    }
}
module.exports = { createPerson, establishConnection, deletePerson, getPeople, getPerson, updatePerson };