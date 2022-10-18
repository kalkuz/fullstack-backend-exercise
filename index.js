import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(morgan(':method :url :status - :response-time ms :body'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;

  const person = persons.find((p) => p.id === Number(id));

  response.json(person);
});

app.post('/api/persons', (request, response) => {
  const { body } = request;

  if (!body.name) {
    response.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    response.status(400).json({
      error: 'number missing',
    });
  } else if (persons.some((p) => p.name === body.name)) {
    response.status(400).json({
      error: 'name must be unique',
    });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 1e12),
    };

    persons = persons.concat(person);

    response.json(person);
  }
});

app.put('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  persons = persons.map((p) => (p.id === Number(id) ? request.body : p));
  response.send(`Updated person with id ${id}`);
});

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  persons = persons.filter((p) => p.id !== Number(id));
  response.send(`Deleted person with id ${id}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
