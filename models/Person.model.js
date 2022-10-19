import mongoose, { Schema } from 'mongoose';

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

export default Person;
