const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
/**
 * @typedef {import('discord.js').Client} Client
 * @typedef {import('discord.js').OAuth2Guild} Guild
 */

/**
 * @param {Client} client
 * @param {string} token
 */
const registerCommands = async (client, token = null) => {
	token = token ?? client.token;
	const commands = require('../commands')().map(command => command.data.toJSON());
	const rest = new REST({ version: '9' }).setToken(token);

	return rest.put(Routes.applicationCommands(client.user.id), { body: commands })
		.then(() => console.log('Successfully registered global application commands.'))
		.catch(console.error);
};

module.exports = registerCommands;
