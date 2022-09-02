const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = { id: uuidv4(), name, username, todos: [] };

  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  request.user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const user = request.user;

  const taskExists = user.todos.find((todo) => todo.id === id);

  if (!taskExists) {
    return response.status(404).json({ error: "Task not found for this user" });
  }

  taskExists.title = title;

  taskExists.deadline = new Date(deadline);

  return response.status(201).json(taskExists);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const user = request.user;
  const taskExists = user.todos.find((todo) => todo.id === id);

  if (!taskExists) {
    return response.status(404).json({ error: "Task not found for this user" });
  }

  taskExists.done = true;

  return response.status(201).json(taskExists);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const user = request.user;

  const taskExists = user.todos.find((todo) => todo.id === id);

  if (!taskExists) {
    return response.status(404).json({ error: "Task not found for this user" });
  }

  const updatedTodo = user.todos.filter((todo) => id != todo.id);

  user.todos = updatedTodo;

  return response.status(204).json();
});

module.exports = app;
