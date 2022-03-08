import { complete, incomplete } from "../functions/format";
import { formatScore, stripMarkdown } from "../functions/format";

const reEntry = /^(.)\s+(.+?)(?:\s+\(([0-9.]+\/[0-9.]+)\))?(?:\s+<@(\d+)>)?$/;

export class Entry {
	name: string;
	score?: string;
	recipient?: string;

	constructor(name: string, score?: string, recipient?: string) {
		this.name = name;
		this.score = score;
		this.recipient = recipient;
	}

	static fromString(input: string): Entry | null {
		input = stripMarkdown(input);
		const matches = input.match(reEntry);
		if (!matches) return null;
		// const completed = matches[1];
		const name = matches[2];
		const score = matches[3] ?? null;
		const recipient = matches[4] ?? null;
		return new Entry(name, score, recipient);
	}

	toString(): string {
		const symbol = (this.score) ? complete : incomplete;
		let line = `${symbol} ${this.name}`;
		if (this.score) line = `${line} ${formatScore(this.score)}`;
		//if (this.recipient) line = `${line} <@${this.recipient}>`;
		return line;
	}
}
