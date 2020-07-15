const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository)

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
 
  const index = repositories.findIndex(repository => repository.id === id)
  if (index < 0) {
    return response.status(400).json({ error: 'Not Found Repository' })
  }
  const { title, url, techs } = request.body;
  repositories[index] = {
    id,
    title,
    url,
    techs,
    likes: 0,
  }
  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  const index = repositories.findIndex(repository => repository.id === id)

  if (index < 0) {
    return response.status(404).json({ error: 'Not Found Repository' });
  }

  repositories.splice(index, 1);
  return response.status(204).send('No Content');

});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id)

  if (index < 0) {
    return response.status(400).send()
  } else {
    repositories[index].likes += 1;
    return response.status(200).json(repositories[index]);
  }
});

module.exports = app;
