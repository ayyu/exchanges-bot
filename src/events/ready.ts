import { Client } from "discord.js";
import DiscordEvent from "../lib/classes/DiscordEvent";

const event: DiscordEvent = {
	name: "ready",
	execute: (client: Client) => console.log(`Ready! Logged in as ${client.user?.tag}`),
}

export default event;