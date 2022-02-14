const config = require('../config/format');

/** @param {string} line */
const unchecked = line => `${config.uncheckSymbol} ${line}`;

/** @param {string} line */
const checked = line => `${config.checkSymbol} ${line}`;

/**
 * @param {string} line
 * @param {string} score
 * @returns {string}
 */
const scored = (line, score) => {
	return `${line} ${config.scoreFormat.replace(config.scoreToken, score)}`;
};

/**
 * @param {string} line
 * @param {string} score
 * @returns {string}
 */
const completed = (line, score) => scored(checked(line), score);

/**
 * @param {string|number} number
 * @returns {string}
 */
const group = number => config.groupFormat.replace(config.groupToken, number);

/**
 * 
 * @param {string|number} groupNumber
 * @param {string} member
 * @param {string|number} total
 * @param {string|number} completed
 * @returns {string}
 */
const listTitle = (groupNumber, member, total, finished = 0) => {
	return [group(groupNumber), member, `**(${finished}/${total})**`].join(' ');
};

const markdownTokens = [
	'||',
	'__',
	'~~',
	'***',
	'**',
	'`',
];

/** @param {string} line */
const stripMarkdown = line => {
	return markdownTokens.reduce((line, token) => line.replaceAll(token, ''), line);
}

/** @param {string} content */
const formatMessageUnchecked = content => {
	return content.split('\n')
		.map(unchecked)
		.reduce((post, line) => post + line + '\n', '');
};

module.exports = {
	group, listTitle,
	completed, scored, checked, unchecked,
	stripMarkdown, formatMessageUnchecked,
	config,
};
