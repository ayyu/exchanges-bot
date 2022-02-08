const unchecked = line => `☐ ${line}`;
const checked = line => `☒ ${line}`;
const scored = (line, score) => `${line} **(${score})**`;
const completed = (line, score) => scored(checked(line), score);

const group = number => `**Group ${number}**`;

module.exports = {
	group,
	completed,
	unchecked,
};
