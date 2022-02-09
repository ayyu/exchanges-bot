const { isBotThread } = require('../common/channels');
const { matchLines, updateMatchedLine, updateListTitle } = require('../common/munge');
const { DiscordEvent } = require('../models/events');
/** @typedef {import('discord.js').Message} Message */

/** @param {Message} message */
const updatePins = async message => {
	if (!isBotThread(message)) return;

	const matches =  matchLines(message.content);
	if (!matches) return;

	return message.channel.messages.fetchPinned(false)
		.then(async pins => Promise.all(pins.map(async pin => {
			for (const match of matches) {
				const updatedContents = updateMatchedLine(pin, match, message);
				if (updatedContents) await pin.edit(
					updateListTitle(updatedContents, match.group))
					.then(edited => pin = edited)
					.then(() => console.log(`New completion in ${pin.guild.name} by ${message.member.user.tag}`));
			}
		})));
};

module.exports = new DiscordEvent('messageCreate', false, updatePins);
