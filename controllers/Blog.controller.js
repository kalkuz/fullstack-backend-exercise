import { Blog, User } from '../models';
import { Response } from '../utils';

const read = {
  all: (req, res) => {
    Blog.find({})
      .populate('user')
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
  single: (req, res) => {
    Blog.findById({ _id: req.params.id })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

const create = {
  single: (req, res) => {
    User.findOne({})
      .then(({ _id }) => Blog.create({ ...req.body, user: _id })
        .then((data) => Response.success(res, data, 'Can'))
        .catch((err) => Response.error(res, err, "Can't")))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

const del = {
  single: (req, res) => {
    Blog.deleteOne({ _id: req.params.id })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((error) => Response.error(res, error, "Can't"));
  },
};

const update = {
  single: (req, res) => {
    Blog.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
      .then((data) => Response.success(res, data, 'Can'))
      .catch((err) => Response.error(res, err, "Can't"));
  },
};

export default {
  read, create, del, update,
};
