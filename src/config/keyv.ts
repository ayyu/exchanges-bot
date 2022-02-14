import dotenv from 'dotenv';
if (process.env.NODE_ENV != 'production') dotenv.config();

export const uri = process.env.DATABASE_URL;
const ssl = {
	require: true,
	rejectUnauthorized: false,
};

export const options = { ssl };
