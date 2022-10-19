import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, JWT_SECRET } = process.env;

export default {
  MONGO_URI, JWT_SECRET,
};
