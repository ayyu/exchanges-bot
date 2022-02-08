const format = require('./format');

const regexes = {
	group: /^Group:\s*([0-9]+)/i,
	entry: /^Anime Given:\s*(.+)/i,
	score: /^Score:\s*\(?(\d{1,3}\/\d{1,3})\)?/i,
};

const reEntry = /\s+\([0-9/]+\)$/i;

/**
 * @typedef {Object} Match
 * @property {string|number} group
 * @property {string} entry
 * @property {string} score
 */

/**
 * @param {string} content
 * @returns {Match[]|null}
 */
const matchLines = content => {
	const lines = splitAndTrim(content, '\n');
	/** @type {{group: string[], entry: string[], score: string[]}} */
	let values = {};
	for (const property in regexes) {
		values[property] = lines
			.map(format.stripMarkdown)
			.map(line => line.match(regexes[property]))
			.filter(match => match != null)
			.map(match => match[1])
			.map(match => (property == 'entry') ? match.replace(reEntry, '') : match);
		if (!values[property].length) return null;
	}

	/** @type {Match[]} */
	let matches = [];
	for (let i = 0; i < values.entry.length; i++) {
		matches.push({
			group: (values.group[i] ?? matches[i - 1].group).trim(),
			entry: values.entry[i].trim(),
			score: (values.score[i] ?? matches[i - 1].score).trim(),
		});
	}

	return matches;
};

/**
 * @param {string} post
 * @param {Match} match
 * @param {Message} trigger
 * @returns {string|null}
 */
const updateMatchedLine = (message, match, trigger) => {
	const lines = splitAndTrim(message.content, '\n');

	if (!lines[0].includes(format.group(match.group))) return;

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].toLowerCase() == format.unchecked(match.entry).toLowerCase()) {
			const completed = format.completed(match.entry, match.score);
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
