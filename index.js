/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(morgan(':method :url :status - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response, next) => {
  db.PersonModel.countDocuments()
    .then((data) => response.send(`Phonebook has info for ${data} people`))
    .catch((err) => next(err));
});

app.get('/api/persons', (request, response, next) => {
  db.Person.all(request, response, next);
});

app.get('/api/persons/:id', (request, response, next) => {
  db.Person.get(request, response, next);
});

app.post('/api/persons', async (request, response, next) => {
  const { body } = request;

  if (!body.name) {
    response.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    response.status(400).json({
      error: 'number missing',
    });
  } else if (await db.PersonModel.findOne({ name: body.name })) {
    response.status(400).json({
      error: 'name must be unique',
    });
  } else if (body.name?.length < 3) {
    response.status(400).json({
      error: `Person validation failed. name: Path \`name\` (\`${body.name}\`) is shorter than the minimum allowed length (3)`,
    });
  } else {
    db.Person.create(request, response, next);
  }
});

app.put('/api/persons/:id', (request, response, next) => {
  db.Person.update(request, response, next);
});

app.delete('/api/persons/:id', (request, response, next) => {
  db.Person.delete(request, response, next);
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.connect()
  .then(({ connection }) => console.log(`Connected to database ${connection.name}`))
  .catch((err) => console.log(`Can't connect to database\n${err}`));
