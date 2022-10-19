import bcryptjs from 'bcryptjs';
import { User } from '../models';
import { Response } from '../utils';

const read = {
  all: (req, res) => {
    User.find({})
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
  single: (req, res) => {
    User.findById(req.params.id)
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

const create = {
  single: async ({ body }, res) => {
    User.findOne({ username: body.username })
      .then((data) => {
        if (data) {
          Response.error(res, 'Username must be unique', 'Username must be unique');
        } else if (body.password?.length < 3) {
          const err = 'User validation failed. name: Path `password` is shorter than the minimum allowed length (3)';
          Response.error(res, err, err);
        } else {
          bcryptjs.hash(body.password, 4).then((pass) => {
            User.create({ ...body, password: pass })
              .then((d) => Response.success(res, d, 'Can'))
              .catch((err) => Response.error(res, err, "Can't"));
          });
        }
      })
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

const del = {
  single: (req, res) => {
    User.deleteOne({ _id: req.params.id })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((error) => Response.error(res, error, "Can't"));
  },
};

const update = {
  single: ({ body, params }, res) => {
    if (body.password?.length < 3) {
      const err = 'User validation failed. name: Path `password` is shorter than the minimum allowed length (3)';
      Response.error(res, err, err);
    }
    if (body.password) {
      bcryptjs.hash(body.password, 4).then((pass) => {
        User.findOneAndUpdate(
          { _id: params.id },
          { ...body, password: pass },
          { upsert: true },
        )
          .then((data) => Response.success(res, data, 'Can'))
          .catch((err) => Response.error(res, err, "Can't"));
      });
    } else {
      User.findOneAndUpdate({ _id: params.id }, body, { upsert: true })
        .then((data) => Response.success(res, data, 'Can'))
        .catch((err) => Response.error(res, err, "Can't"));
    }
  },
};

export default {
  read, create, del, update,
};
