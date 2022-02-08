const { requireBotThread } = require('../common/channels');
const format = require('../common/format');
const { matchLines, splitAndTrim } = require('../common/munge');
const { DiscordEvent } = require('../models/events');
/** @typedef {import('discord.js').Message} Message */

/** @param {Message} message */
const updatePins = async message => {
	try {
		requireBotThread(message);
	} catch (err) {
		return;
	}

	const matches =  matchLines(message.content);
	if (!matches) return;
	
	await message.channel.messages.fetchPinned(false)
		.then(pins => Promise.all(pins.map(async pin => {
			const pinLines = splitAndTrim(pin.content, '\n');
			if (!pinLines[0].includes(format.group(matches.group))) return;

			for (let i = 1; i < pinLines.length; i++) {
				if (pinLines[i].toLowerCase() == format.unchecked(matches.anime).toLowerCase()) {

					const completed = format.completed(matches.anime, matches.score);
					pinLines[i] = `${completed}  ${message.member}`;
					console.log(`New completion in ${message.guild.name}: ${completed} by ${message.author.tag}`);

					return pin.edit(pinLines.reduce(
						(post, line) => post + line + '\n', ''
					));
				}
			}
		})));
};

module.exports = new DiscordEvent('messageCreate', false, updatePins);
