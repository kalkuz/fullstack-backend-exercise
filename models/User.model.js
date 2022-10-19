/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    validate: {
      validator(v) {
        return v.length > 2;
      },
      message: (props) => `${props.value} must be at least 3 characters long!`,
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  },
});

const User = mongoose.model('Users', UserSchema);

User.createCollection();

export default User;
