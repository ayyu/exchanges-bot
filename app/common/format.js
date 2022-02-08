const config = require('../config/format');

/** @param {string} line */
const unchecked = line => `${config.uncheckSymbol} ${line}`;

/** @param {string} line */
const checked = line => `${config.checkSymbol} ${line}`;

/**
 * @param {string} line
 * @param {string} score
 */
const scored = (line, score) => `${line} ${config.scoreFormat.replace(config.scoreToken, score)}`;

/**
 * @param {string} line
 * @param {string} score
 */
const completed = (line, score) => scored(checked(line), score);

/** @param {string|number} number */
const group = number => config.groupFormat.replace(config.groupToken, number);

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

module.exports = {
	group,
	completed,
	checked, unchecked,
	scored,
	stripMarkdown,
	config,
};
