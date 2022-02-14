import "reflect-metadata";

import { config } from "dotenv";
import { container } from "tsyringe";

import { Collection, Intents } from "discord.js";
import keyvs, { Keyv } from "./keyvs";
import BotClient from "./client";

if (process.env.NODE_ENV != "production") config();
const token = process.env.DISCORD_TOKEN as string;
const guildId = process.env.GUILD_ID as string;

const client = new BotClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	],
}, token);

container.registerInstance(BotClient, client);
container.registerInstance<string>("guildId", guildId);
container.registerInstance<Collection<string, Keyv>>("keyvs", keyvs);

export {
	container,
	BotClient
};
