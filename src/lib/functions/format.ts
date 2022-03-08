import { GroupPost } from "../classes/GroupPost";

export const incomplete = '☐';
export const complete = '☒';

export function formatScore(score: string): string {
	return `**(${score})**`;
}

export function formatTitle(post: GroupPost): string {
	return `**Group ${post.group}** <@${post.owner}> **(${post.countCompleted()}/${post.entries.length})**`;
}

const reMarkdown = /\*\*\*([^\n]+)\*\*\*|\*\*([^\n]+)\*\*|\*([^\n]+)\*|__([^\n]+)__|_([^\n]+)_|`([^\n]+)`|~~([^\n]+)~~/g;

export function stripMarkdown(input: string): string {
	return input.replace(reMarkdown, "$1$2$3$4$5$6$7");
}

export function splitAndTrim(input: string, delim = "\n") {
	return input.split(delim).map(line => line.trim());
}
