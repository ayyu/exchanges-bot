import { Message } from "discord.js";
import { isBotThread } from "../lib/functions/channels";
import { parseReviews } from "../lib/functions/reviews";
import DiscordEvent from "../lib/classes/DiscordEvent";
import { GroupPost } from "../lib/classes/GroupPost";
import { editGroupPost } from "../lib/functions/posts";

async function updatePins(message: Message) {
	if (!isBotThread(message)) return;

	const reviews = parseReviews(message.content);
	if (!reviews) return;

	const pins = await message.channel.messages.fetchPinned(false);

	for (const review of reviews) {
		for (const [, pin] of pins) {
			const groupPost = GroupPost.fromString(pin.content);
			if (!groupPost) continue;
			if (groupPost.group != review.group) continue;
			const updated = groupPost.updateEntry(
				review.name,
				review.score,
				message.author.id);
			if (updated) {
				await editGroupPost(groupPost, pin);
				break;
			}
		}
	}
}

const event: DiscordEvent = {
	name: "messageCreate",
	execute: updatePins,
}

export default event;
