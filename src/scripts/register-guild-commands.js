const client = require('../services/discord-client');
const { registerGuildCommands } = require('../utilities/register-commands');
if (process.env.NODE_ENV != 'production') require('dotenv').config();

const guildId = process.env.GUILD_ID;

client.login()
	.then(() => registerGuildCommands(client, guildId))
	.then(() => client.destroy());
