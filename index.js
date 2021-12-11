const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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
app.use(cors());

/* app.use(morgan("tiny")); */
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
morgan.token("body", function (req, res) {
  return [JSON.stringify(req.body)];
});

// GET /api/persons
app.get("/api/persons", async (request, response) => {
  try {
    const persons = await personas;
    return response.json(persons);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// GET /info
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

// GET /api/persons/:id
app.get("/api/persons/:id", async (request, response) => {
  try {
    const id = Number(request.params.id);
    const person = await personas.find((person) => person.id === id);
    if (!person) {
      return response
        .status(404)
        .json({ error: `Person with id ${id} not found` });
    }
    return response.json(person);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personRemaning = personas.filter((person) => person.id !== id);
  const personToRemove = personas.find((person) => person.id === id);
  if (!personToRemove) {
    return response
      .status(404)
      .json({ error: `Person with id ${id} not found` });
  }
  personas.splice(personas.indexOf(personToRemove), 1);
  response.json(personToRemove);

  return response.status(204).end();
});

// POST
app.post("/api/persons", async (request, response) => {
  const body = request.body;
  if (!body.number || !body.name) {
    return response.status(400).json({ error: "name or number missing" });
  }
  try {
    const inExistence = await personas.find(
      (person) => person.name === body.name
    );
    if (inExistence != null) {
      return response
        .status(400)
        .json({ error: `Person with name ${body.name} already exists` });
    }
    const toPush = {
      id: Number((Math.random() * ((2 ^ 52000) - 1) + 1).toFixed(0)),
      ...body,
    };
    personas.push(toPush);
    return response.status(201).json(toPush);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});


const PORT = 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
