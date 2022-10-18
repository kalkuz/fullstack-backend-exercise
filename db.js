import mongoose, { Schema } from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const Person = mongoose.model('Persons', new Schema({
  name: String,
  number: {
    type: String,
    validate: {
      validator(v) {
        return v.length > 8 && /\d{2,3}-\d*/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
}));

Person.createCollection();

const CreatePerson = (req, res, next) => {
  Person.create(req.body)
    .then((data) => res.status(200).json({ data }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
      } else {
        next(err);
      }
    });
};

const GetPerson = (req, res, next) => {
  Person.findById(req.params.id)
    .then((data) => res.status(200).json({ data }))
    .catch((err) => next(err));
};

const GetAllPerson = (req, res, next) => {
  Person.find({})
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};

const DeletePerson = (req, res, next) => {
  Person.deleteOne({ _id: req.params.id })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};

const UpdatePerson = (req, res, next) => {
  Person.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => next(error));
};

const connect = async () => mongoose.connect(
  process.env.MONGO_URI,
  {
    useUnifiedTopology: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    // useCreateIndex: true,
  },
);

export default {
  connect,
  Person: {
    all: GetAllPerson,
    get: GetPerson,
    create: CreatePerson,
    delete: DeletePerson,
    update: UpdatePerson,
  },
  PersonModel: Person,
};
