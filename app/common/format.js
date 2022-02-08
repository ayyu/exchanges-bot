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

/** @param {string|number} line */
const group = number => `**Group ${number}**`;

module.exports = {
	group,
	completed,
	checked, unchecked,
	scored,
};
