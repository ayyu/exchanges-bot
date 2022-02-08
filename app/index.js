const { Collection } = require('discord.js');
const { requireCommands } = require('./models/commands')(Collection);
const keyvs = require('./services/keyv');
const { client, token } = require('./services/discord-client');

client.commands = requireCommands(require('./commands')(keyvs));

const events = require('./events');
for (const event of events) {
	const callback = (event.once ? client.once : client.on).bind(client);
	callback(event.name, (...args) => event.execute(...args));
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	return command.run(interaction);
});

client.login(token);
