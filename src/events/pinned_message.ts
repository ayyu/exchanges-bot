import { Message } from "discord.js";
import DiscordEvent from "../lib/classes/DiscordEvent";

const event: DiscordEvent = {
	name: "messageCreate",
	execute: async (message: Message) => {
		if (message.author.id == message.client.user?.id
			&& message.type == 'CHANNEL_PINNED_MESSAGE') {
			await message.delete();
		}
	},
}

export default event;