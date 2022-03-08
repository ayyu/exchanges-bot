import { container, BotClient } from "./services";
import commands from "./commands";
import events from "./events";
import { CommandHandler } from "./lib/classes/CommandHandler";

const client = container.resolve(BotClient);

client.commands = CommandHandler.collectCommands(commands);

for (const event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login();
