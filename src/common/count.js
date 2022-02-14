const { uncheckSymbol, checkSymbol } = require("../config/format");

/** @param {string[]} lines */
const countUnfinishedLines = lines => lines
	.filter(line => line.includes(uncheckSymbol)).length;

/** @param {string[]} lines */
const countFinishedLines = lines => lines
	.filter(line => line.includes(checkSymbol)).length;

const countTotalLines = lines => countFinishedLines(lines) + countUnfinishedLines(lines);

module.exports = {
	countFinishedLines, countUnfinishedLines, countTotalLines,
}