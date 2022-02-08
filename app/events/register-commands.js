const { DiscordEvent } = require('../models/events');
const registerCommands = require('../utilities/register-commands');

module.exports = new DiscordEvent('ready', true, registerCommands);
