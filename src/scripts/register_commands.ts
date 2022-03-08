import { container, BotClient } from "../services";
import { registerCommands } from "../lib/functions/register_commands";

const client = container.resolve(BotClient);

client.login()
	.then(() => registerCommands(client))
	.then(() => client.destroy());
