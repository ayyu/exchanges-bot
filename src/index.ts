import { container, BotClient } from "./services";
import commands from "./commands";
import events from "./events";

const client = container.resolve(BotClient);

client.commands = CommandHandler.collectCommands(commands);

for (const event of events) {
	const callback = (event.once ? client.once : client.on).bind(client);
	callback(event.name, (...args: any) => event.execute(...args));
}

client.login();
