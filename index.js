import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import routes from './routes';
import { Config, Logger, Response } from './utils';
import { Person, User } from './models';
import { Auth, UnknownEndpoint } from './utils/Middleware.js';

const App = express();
App.use(json({ limit: '100kb' }))
  .use(cors())
  .use('/api', routes);

morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
App.use(morgan(':method :url :status - :response-time ms :body'));

App.get('/', (request, response) => {
  response.send('<h1>Exercise API</h1>');
});

App.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcryptjs.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    Response.error(res, 'invalid username or password', 'invalid username or password');
  }

  const userForToken = {
    usr: user._id,
    iat: new Date().getTime(),
    exp: new Date().getTime() + (60 * 60 * 24 * 365 * 1000),
  };

  const token = jwt.sign(userForToken, Config.JWT_SECRET);

  Response.success(res, { token, username: user.username, name: user.name }, 'Success');
});

App.use(Auth('all'));

App.get('/info', (request, response, next) => {
  Person.countDocuments()
    .then((data) => response.send(`Phonebook has info for ${data} people`))
    .catch((err) => next(err));
});

App.use(UnknownEndpoint);

const PORT = Config.PORT || 3001;
App.listen(PORT, () => Logger.info(`API running at PORT:${PORT}`));

db.connect()
  .then(({ connection }) => Logger.info(`Connected to database ${connection.name}`))
  .catch((err) => Logger.info(`Can't connect to database\n${err}`));

export default App;
