const client = require('../services/discord-client');
const { registerCommands } = require('../utilities/register-commands');

client.login()
	.then(() => registerCommands(client))
	.then(() => client.destroy());
