const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const personas = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// POST
const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Person = mongoose.model("Note", NoteSchema);

app.post("/api/persons", async (request, response) => {
  const body = request.body;
  if (!body.number || !body.name) {
    return response.status(400).json({ error: "content missing" });
  }
  try {
    const newPerson = new Person({
      name: request.body.name,
      number: request.body.number,
    });

    const savedPerson = await newPerson.save();

    return response
      .status(201)
      .json({ ...savedPerson, id: Math.random() * (99999999999999999999 - 1) + 1 });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// GET /api/****/:id
// Get por id
app.get("/api/persons", async (request, response) => {
  try {
    const persons = await personas;
    return response.json(persons);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

app.get("/info", async (request, response) => {
  try {
    const info = `Phonebook has info of ${personas.length} people`;
    const date = new Date().toString();
    return response.send(`<hi>${info}</h1><br><br><hi>${date}</h1>`);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

app.get("/api/persons/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);
    const person = await personas.find((person) => person.id === id);
    if (!person) {
      response.status(404).json({ error: `Order with id ${id} not found` });
    }
    return response.json(person);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personRemaning = personas.filter((person) => person.id !== id);
  response.json(personRemaning);
  return response.status(204).end();
});

const PORT = 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// POST /api/services
/* app.post("/api/services", (request, response) => {
  const service = request.body;
  if (!service.title) {
    return response.status(400).json({ error: "content missing" });
  }
  response.status(201).json({ ...service, id: generateId(services) });
}); */
// POST /api/orders
/* app.post("/api/orders", (request, response) => {
  const order = request.body;
  if (!order.services) {
    return response.status(400).json({ error: "content missing" });
  }
  response.status(201).json({ ...order, id: generateId(orders) });
}); */

// GET /api/****/:id
// Get por id
/* app.get("/api/reviews/:id", (request, response) => {
  const id = Number(request.params.id);
  const review = reviews.find((review) => review.id === id);
  response.json(review);
  if (!note) {
    response.status(404).json({ error: `Review with id ${id} not found` });
  }
  response.json(review);
});
app.get("/api/services", (request, response) => {
  response.json(services);
});
app.get("/api/services/:id", (request, response) => {
  const id = Number(request.params.id);
  const service = services.find((service) => service.id === id);
  if (!service) {
    response.status(404).json({ error: `Service with id ${id} not found` });
  }
  response.json(service);
});
app.get("/api/orders", (request, response) => {
  response.json(orders);
});
app.get("/api/orders/:id", (request, response) => {
  const id = Number(request.params.id);
  const order = orders.find((order) => order.id === id);
  if (!order) {
    response.status(404).json({ error: `Order with id ${id} not found` });
  }
  response.json(order);
}); */

// DELETE /api/****/:id
// Eliminando por id
/* app.delete("/api/reviews/:id", (request, response) => {
  const id = Number(request.params.id);
  const reviewToRemove = reviews.filter((review) => review.id === id);
  return response.status(204).end();
});

app.delete("/api/services/:id", (request, response) => {
  const id = Number(request.params.id);
  const serviceToRemove = services.filter((service) => service.id === id);
  return response.status(204).end();
});

app.delete("/api/orders/:id", (request, response) => {
  const id = Number(request.params.id);
  const orderToRemove = orders.filter((order) => order.id === id);
  return response.status(204).end();
}); */
