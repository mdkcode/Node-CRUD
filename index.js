const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");
const app = express();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url - :response-time ms :body"));
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      // console.log(error);
      // response.status(400).send({ error: "malformatted id" });
      (error) => next(error);
    });
});

app.get("/api/info", (request, response) => {
  Person.find({}).then((people) => {
    response.send(`<p>Phonebook has info for ${people.length} people</p>
      <p>${new Date()}</p>`);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const person = new Person({
    number: body.number,
    name: body.name,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const number = {
    number: body.number,
  };

  if (body.name) {
    return response.status(400).json({
      error: "Name can not be changed!",
    });
  }

  Person.findByIdAndUpdate(request.params.id, number, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);
