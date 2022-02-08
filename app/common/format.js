/** @param {string} line */
const unchecked = line => `☐ ${line}`;

/** @param {string} line */
const checked = line => `☒ ${line}`;

/**
 * @param {string} line
 * @param {string} score
 */
const scored = (line, score) => `${line} **(${score})**`;

/**
 * @param {string} line
 * @param {string} score
 */
const completed = (line, score) => scored(checked(line), score);

/** @param {string|number} number */
const group = number => `**Group ${number}**`;

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
};
