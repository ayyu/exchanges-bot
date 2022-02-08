const format = require('./format');

const regexes = {
	group: /^Group:\s*([0-9])/i,
	anime: /^Anime Given:\s*(.+)/i,
	score: /^Score:\s*\(?([0-9]+\/[0-9]+)\)?/i,
};

const reEntries = /\s+\([0-9/]+\)$/i;

/**
 * @typedef {Object} Matches
 * @property {string|number} group
 * @property {string} anime
 * @property {string} score
 */

/**
 * @param {string} content
 * @returns {Matches|null}
 */
const matchLines = content => {
	const lines = splitAndTrim(content, '\n');
	/** @type {{group: string[], anime: string[], score: string[]}} */
	let values = {};
	for (const property in regexes) {
		values[property] = lines
			.filter(line => line.match(regexes[property]))
			.map(line => {
				if (property == 'anime') line = line.replace(reEntries, '');
				return line.replace(regexes[property], '$1');
			})
		if (!values[property].length) return null;
		values[property] = values[property][0];
	}
	return values;
};

/**
 * @param {string} post
 * @param {Matches} matches
 * @param {Message} trigger
 * @returns {string|null}
 */
const updateMatchedLine = (message, matches, trigger) => {
	const lines = splitAndTrim(message.content, '\n');
	if (!lines[0].includes(format.group(matches.group))) return;

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].toLowerCase() == format.unchecked(matches.anime).toLowerCase()) {
			const completed = format.completed(matches.anime, matches.score);
			lines[i] = `${completed} ${trigger.member}`;
			console.log(`New completion in ${message.guild.name}: ${completed} by ${trigger.member.tag}`);
			return lines.reduce((edited, line) => edited + line + '\n', '');
		}
	}
	return;
};

/**
 * @param {string} input
 * @param {string} delim
 * @returns {string[]}
 */
const splitAndTrim = (input, delim) => input.split(delim).map(line => line.trim());

module.exports = {
	regexes,
	splitAndTrim,
	matchLines, updateMatchedLine,
};
