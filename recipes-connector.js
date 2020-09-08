const { ObjectID } = require('mongodb')
const { Connection } = require('./mongo-connection');
const { BadRequestException } = require("./errors");
let recipes;

const establishConnection = async () => {
    const client = await Connection.connectToMongo();
    recipes = client.db('training-simon').collection('recipes');
}

const createPerson = async (recipe) => {
    const result = await recipes.insertOne(recipe);
    return result.ops[0];
}

const deletePerson = async (id) => {
    const result = await recipes.deleteOne({ "_id": getMongoDbId(id) });
    return { deletedCount: result.deletedCount };
}

const getPeople = async (searchTerm) => {
    let criteria = {}; 
    if (searchTerm) {
        criteria = { $or: [{ 'title': searchTerm }, { 'shortDescription': searchTerm }] };
    }
    return await recipes.find(criteria).toArray();
}

const getPerson = async (id) => {
    return await recipes.findOne({ "_id": getMongoDbId(id)});
}

const updatePerson = async (id, recipe) => {
    const { _id, ...newPerson } = recipe; 
    const result = await recipes.replaceOne({ "_id": getMongoDbId(id)}, newPerson );
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