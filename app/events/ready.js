const { DiscordEvent } = require('../models/events');

module.exports = new DiscordEvent('ready', true, client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});