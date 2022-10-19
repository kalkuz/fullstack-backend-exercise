import mongoose from 'mongoose';

import { Config } from './utils';

const connect = async () => mongoose.connect(
  Config.MONGO_URI,
  {
    useUnifiedTopology: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    // useCreateIndex: true,
  },
);

export default {
  connect,
};
