import { Person } from '../models';
import { Response } from '../utils';

const read = {
  all: (req, res) => {
    Person.find({})
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
  single: (req, res) => {
    Person.findById(req.params.id)
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

const create = {
  single: ({ body }, res) => {
    if (!body.name) {
      const err = 'Name missing';
      Response.error(res, err, err);
    } else if (!body.number) {
      const err = 'Number missing';
      Response.error(res, err, err);
    } else {
      Person.findOne({ name: body.name })
        .then((data) => {
          if (data) {
            Response.error(res, 'Name must be unique', 'Name must be unique');
          } else if (body.name?.length < 3) {
            const err = `Person validation failed. name: Path \`name\` (\`${body.name}\`) is shorter than the minimum allowed length (3)`;
            Response.error(res, err, err);
          } else {
            Person.create(body)
              .then((d) => Response.success(res, d, 'Can'))
              .catch((err) => Response.error(res, err, "Can't"));
          }
        })
        .catch((err) => Response.error(res, err, "Can't"));
    }
  },
};

const del = {
  single: (req, res) => {
    Person.deleteOne({ _id: req.params.id })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((error) => Response.error(res, error, "Can't"));
  },
};

const update = {
  single: (req, res) => {
    Person.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

export default {
  read, create, del, update,
};
