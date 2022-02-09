const config = require('../config/format');

/** @param {string} line */
const unchecked = line => `${config.uncheckSymbol} ${line}`;

/** @param {string} line */
const checked = line => `${config.checkSymbol} ${line}`;

/**
 * @param {string} line
 * @param {string} score
 */
const scored = (line, score) => {
	return `${line} ${config.scoreFormat.replace(config.scoreToken, score)}`;
};

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

/** @param {string} content */
const formatMessageUnchecked = content => {
	return content.split('\n')
		.map(unchecked)
		.reduce((post, line) => post + line + '\n', '');
};

module.exports = {
	group,
	completed, scored, checked, unchecked,
	stripMarkdown, formatMessageUnchecked,
	config,
};
