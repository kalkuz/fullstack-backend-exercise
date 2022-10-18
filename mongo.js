/* eslint-disable import/extensions */
import db from './db.js';

// eslint-disable-next-line no-unused-vars
const password = process.argv[2];

const argName = process.argv[3];
const argNumber = process.argv[4];

db.connect()
  .then(({ connection }) => {
    if (argName) {
      db.PersonModel.create({ name: argName, number: argNumber })
        .then((data) => {
          console.log(`Added ${data.name} phone ${data.number} to phonebook`);
          connection.close();
        }).catch((err) => console.log(err));
    } else {
      db.PersonModel.find({}).then((data) => {
        console.log(`phonebook:\n${data.map((d) => `${d.name} ${d.number}\n`).join('')}`);
        connection.close();
      }).catch((err) => console.log(err));
    }
  })
  .catch((err) => console.log(`Can't connect to database\n${err}`));
