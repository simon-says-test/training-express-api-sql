const { NotFoundException } = require("./errors");

const people = [
    { id: 1, firstName: 'Simon', lastName: 'Thomas', age: 41 },
    { id: 2, firstName: 'Warren', lastName: 'Jones', age: 38 },
];

const createPerson = (person) => {
    const id = people
        .map(person => person.id)
        .reduce((max, cur) => Math.max(max, cur), 0) + 1;
    people.push({ ...person, id });
    return "Creation successful";
}

const deletePerson = (id) => {
    const index = people.findIndex(p => p.id == id);
    people = people.splice(index, 1);
    return "Deletion successful";
}

const getPeople = (searchTerm) => {
    let criteria = p => !searchTerm || p.firstName === searchTerm || p.lastName === searchTerm; 
    return people.filter(criteria);
}

const getPerson = (id) => {
    const person = people.find(p => p.id == id);
    if (!person) {
        throw new NotFoundException('Person not found');
    }
}

const updatePerson = (id, person) => {
    const index = people.findIndex(p => p.id == id);
    people[index] = { ...person, id };
    return "Update successful";
}

module.exports = { createPerson, deletePerson, getPeople, getPerson, updatePerson };