const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repository ID'})
  }

}

app.use('/repositories/:id', validateRepositoryId)

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs}  = request.body

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepository);

  return response.json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send() // 204 on empty response
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories[repositoryIndex].likes += 1

  return response.status(200).json(repositories[repositoryIndex]) 
});

module.exports = app;
