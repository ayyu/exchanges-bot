const client = require('../services/discord-client');
const registerCommands = require('../utilities/register-commands');

registerCommands(client);

client.destroy();