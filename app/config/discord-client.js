const { Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	options: { intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	] },
	token: process.env.DISCORD_TOKEN,
}
