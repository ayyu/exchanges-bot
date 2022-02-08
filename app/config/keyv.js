const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.DATABASE_URL;
const ssl = {
	require: true,
	rejectUnauthorized: false,
};

module.exports = { uri, options: { ssl } };
