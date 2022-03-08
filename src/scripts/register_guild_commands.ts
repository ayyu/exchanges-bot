import { container, BotClient } from "../services";
import { registerCommands } from "../lib/functions/register_commands";
import dotenv from "dotenv";

if (process.env.NODE_ENV != 'production') dotenv.config();
const guildId = process.env.GUILD_ID;

const client = container.resolve(BotClient);

client.login()
	.then(() => registerCommands(client, guildId))
	.then(() => client.destroy());
