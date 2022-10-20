import { decode } from 'jsonwebtoken';
import User from '../models/User.model.js';
// import { User } from '../models';
import Config from './Config.js';
import Response from './Response.js';

const UnknownEndpoint = (req, res) => {
  Response.error(res, 'Unknown endpoint.', 'Unknown endpoint.');
};

const Auth = (roles) => (req, res, next) => {
  try {
    const { usr, rol, exp } = decode(
      // token query can be used for web services to be hooked.
      (req.headers.authorization || req.query.token),
      Config.JWT_SECRET,
    );

    if (exp > new Date().getTime()) {
      if (roles === 'all' || roles.includes(rol)) {
        res.query = req.query;
        req.role = rol;
        User.findOne({ _id: usr })
          .then((data) => {
            req.user = data.toJSON();
            next();
          })
          .catch(() => res.status(401).json({ message: 'No such user registered.' }));
      } else {
        res.status(401).json({ message: 'Wrong user type.', expected: roles, given: rol });
      }
    } else res.status(401).send('Expired token');
  } catch (e) { res.status(401).send('You need a token.'); }
};

export {
  UnknownEndpoint, Auth,
};
