import { GroupPost } from "../classes/GroupPost";

export const incomplete = '☐';
export const complete = '☒';

export function formatScore(score: string): string {
	return `**(${score})**`;
}

export function formatTitle(post: GroupPost): string {
	return `**Group ${post.group}** <@${post.owner}> **(${post.countCompleted()}/${post.entries.length})**`;
}

const markdownRegExps = [
	/\*\*\*(.+?)\*\*\*/g,
	/\*\*(.+?)\*\*/g,
	/\*(.+?)\*/g,
	/__(.+?)__/g,
	/_(.+?)_/g,
	/`(.+?)`/g,
	/~~(.+?)~~/g,
	/\|\|(.+?)\|\|/g,
];

export function stripMarkdown(input: string): string {
	markdownRegExps.forEach((re) => {
		input = input.replace(re, "$1");
	});
	return input;
}

export function splitAndTrim(input: string, delim = "\n") {
	return input.split(delim).map(line => line.trim());
}
