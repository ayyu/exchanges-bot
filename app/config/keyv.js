const dotenv = require('dotenv');
const KeyvStore = require('@keyv/sqlite');

dotenv.config();

const uri = process.env.DATABASE_URL;
const ssl = {
	require: true,
	rejectUnauthorized: false,
};

const store = new KeyvStore({ uri, ssl });

module.exports = { store };
