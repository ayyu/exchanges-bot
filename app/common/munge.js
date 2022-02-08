const regexes = {
	group: new RegExp('^Group: ([0-9])', 'i'),
	anime: new RegExp('^Anime Given: (.+)', 'i'),
	score: new RegExp('^Score: \\(?([0-9]{1,2}/10)\\)?', 'i'),
};

/**
 * @param {string} content
 * @returns {{group: string, anime: string, score: string}|null}
 */
const matchLines = content => {
	const lines = splitAndTrim(content, '\n');
	/** @type {{group: string[], anime: string[], score: string[]}} */
	let values = {};
	for (const property in regexes) {
		values[property] = lines
			.filter(line => line.match(regexes[property]))
			.map(line => line.replace(regexes[property], '$1'));
		if (!values[property].length) {
			return null;
		} else {
			values[property] = values[property][0];
		}
	}
	return values;
};

/**
 * @param {string} input
 * @param {string} delim
 * @returns {string[]}
 */
const splitAndTrim = (input, delim) => input.split(delim).map(line => line.trim());

module.exports = {
	regexes,
	matchLines,
	splitAndTrim,
};
