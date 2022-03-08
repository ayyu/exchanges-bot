import { Interaction, Message } from "discord.js";

import { inThreadError, outThreadError } from "../../config/messages";

type Model = Message | Interaction;

export function isBotThread(model: Model) {
	return model.channel && model.channel?.isThread() && model.channel.ownerId == model.client.user?.id;
}

export function requireNotThread(model: Model) {
	if (model.channel?.isThread()) throw new Error(inThreadError);
}

export function requireBotThread(model: Model) {
	if (!isBotThread(model)) throw new Error(outThreadError);
}
