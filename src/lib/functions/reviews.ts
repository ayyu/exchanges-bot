import { splitAndTrim, stripMarkdown } from "./format";

const reGroup = /^Group:?\s*(\d+)/i;
const reEntry = /^Anime(?: Given)?:\s*(.+?)(?:\s+\(\d+\/\d+\))$/i;
const reScore = /^Score:\s*\(?([\d.]+\/\d+)\)?/i;

interface Review {
	name: string,
	score: string,
	group: string,
}

export function parseReviews(input: string): Review[] {
	const lines = splitAndTrim(stripMarkdown(input));
	const names = matchLines(lines, reEntry);
	const groups = matchLines(lines, reGroup);
	const scores = matchLines(lines, reScore);

	console.log(names, groups, scores);

	if (!names || !groups || !scores) return [];

	return names.map((name, i) => ({
		name: name.trim(),
		group: (groups[i] ?? groups.slice(-1)[0]).trim(),
		score: (scores[i] ?? scores.slice(-1)[0]).trim(),
	}));
}

function matchLines(lines: string[], matcher: RegExp): string[] {
	return lines
		.map(line => line.match(matcher))
		.filter(match => match != null)
		.map(match => (match) ? match[1] : "");
}