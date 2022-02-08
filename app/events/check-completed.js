const { isBotThread } = require('../common/channels');
const { matchLines, updateMatchedLine } = require('../common/munge');
const { DiscordEvent } = require('../models/events');
/** @typedef {import('discord.js').Message} Message */

/** @param {Message} message */
const updatePins = async message => {
	if (!isBotThread(message)) return;

	const matches =  matchLines(message.content);
	if (!matches) return;
	
	await message.channel.messages.fetchPinned(false)
		.then(pins => Promise.all(
			pins.map(async pin => {
				const updatedPin = updateMatchedLine(pin, matches, message);
				if (updatedPin) return pin.edit(updatedPin);
			})
		));
};

module.exports = new DiscordEvent('messageCreate', false, updatePins);
