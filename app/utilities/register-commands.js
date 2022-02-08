const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
/**
 * @typedef {import('discord.js').Client} Client
 * @typedef {import('discord.js').OAuth2Guild} Guild
 */

dotenv.config();

/** @param {Client} client */
const registerCommands = async client => {
	const token = client.token;
	const commands = require('../commands')().map(command => command.data.toJSON());
	const rest = new REST({ version: '9' }).setToken(token);

	return rest.put(Routes.applicationCommands(client.user.id), { body: commands })
		.then(() => console.log('Successfully registered global application commands.'))
		.catch(console.error);
};

module.exports = registerCommands;
