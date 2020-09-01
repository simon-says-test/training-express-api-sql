// Get dependencies
const express = require('express');
const logger = require('./logger');
const errorHandler = require('./error-handler');
const peopleConnector = require('./people-connector');
const app = express();
const port = 3000;

app.use(express.json());                         // support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // support URL-encoded bodies
app.use(logger.logger);

app.post('/people', (req, res) => {
  res.send(peopleConnector.createPerson(req.body));
});

app.delete('/people/:id', (req, res) => {
  res.send(peopleConnector.deletePerson(req.params.id));
});

app.get('/people', (req, res) => {
  const searchTerm = req.query.search;
  res.send(peopleConnector.getPeople(searchTerm));
});

app.get('/people/:id', (req, res) => {
  res.send(peopleConnector.getPerson(req.params.id));
});

app.put('/people/:id', (req, res) => {
  res.send(peopleConnector.updatePerson(req.params.id, req.body));
});

app.get('/', (req, res) => {
  res.send("Please navigate to a valid operation");
});

app.use(errorHandler.handler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});