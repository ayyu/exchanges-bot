const { countFinishedLines, countTotalLines } = require('./count');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const format = require('./format');
/** @typedef {import('discord.js').Message} Message */

const regexes = {
	group: new RegExp(`^${format.config.groupPrefix}\\s*([0-9]+)`, 'i'),
	entry: new RegExp(`^${format.config.entryPrefix}\\s*(.+)`, 'i'),
	score: new RegExp(`^${format.config.scorePrefix}\\s*\\(?([\\d\\.]+/\\d+)\\)?`, 'i'),
};

const reEntry = new RegExp(`\\s+\\([0-9]+/[0-9]+\\)$`, 'i');

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
			return lines.reduce((content, line) => content + line + '\n', '');
		}
	}
	return;
};

/**
 * @param {string} input
 * @param {string} delim
 * @returns {string[]}
 */
const splitAndTrim = (input, delim = '\n') => input.split(delim).map(line => line.trim());

/**
 * @param {string} content
 * @returns {string|null}
 */
const parseHost = line => line.match(USERS_PATTERN)[0] || '';

/**
 * @param {Message} message
 */
const updateListTitle = (content, group) => {
	const lines = splitAndTrim(content, '\n');
	const finished = countFinishedLines(lines);
	const total = countTotalLines(lines);
	const host = parseHost(lines[0]) ?? '';
	lines[0] = format.listTitle(group, host, total, finished);
	return lines.reduce((content, line) => content + line + '\n', '');
}

module.exports = {
	regexes,
	splitAndTrim,
	matchLines, updateMatchedLine,
	parseHost, updateListTitle,
};
