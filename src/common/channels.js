const messages = require('../config/messages');
/**
 * @typedef {import('discord.js').Interaction} Interaction
 * @typedef {import('discord.js').Message} Message
 */

/** @param {Message|Interaction} model */
const requireNotThread = model => {
	if (model.channel.isThread()) throw new Error(messages.inThreadError);
};

/** @param {Message|Interaction} model */
const isBotThread = model => {
	return model.channel.isThread() && model.channel.ownerId == model.client.user.id;
};

/** @param {Message|Interaction} model */
const requireBotThread = model => {
	if (!isBotThread(model)) throw new Error(messages.outThreadError);
};

module.exports = {
	isBotThread,
	requireNotThread,
	requireBotThread,
};
