import { formatTitle, splitAndTrim, stripMarkdown } from "../functions/format";
import { Entry } from "./Entry";

const rePostTitle = /^Group (\d+)\s+<@(\d+)>/;

export class GroupPost {
	entries: Entry[];
	group: string;
	owner: string;
	
	constructor(group: string, owner: string, entriesString?: string) {
		this.group = group;
		this.owner = owner;
		if (entriesString) {
			this.entries = splitAndTrim(entriesString)
				.map((name) => new Entry(name));
		} else {
			this.entries = [];
		}
	}

	static fromString(input: string): GroupPost | null {
		const lines = splitAndTrim(stripMarkdown(input));

		const title = lines.shift();
		if (!title) return null;
		const matches = title.match(rePostTitle);
		if (!matches) return null;
		const group = matches[1];
		const owner = matches[2];
		const post = new GroupPost(group, owner);
		
		lines.forEach(line => {
			const entry = Entry.fromString(line);
			if (entry) post.entries.push(entry);
		});

		return post;
	}

	countCompleted(): number {
		return this.entries.filter(entry => entry.score).length;
	}

	updateEntry(name: string, score: string, recipient: string): boolean {
		for (const entry of this.entries) {
			if (name.toLowerCase() == entry.name.toLowerCase()) {
				entry.score = score;
				entry.recipient = recipient;
				return true;
			}
		}
		return false;
	}

	toString(): string {
		const titleString = formatTitle(this);
		const entriesString = this.entries
			.map((entry) => entry.toString())
			.reduce((postString, entryString) => postString + entryString + "\n", "");
		return titleString + "\n" + entriesString;
	}

	split(): GroupPost[] {
		const half = Math.ceil(this.entries.length / 2);
		const post1 = new GroupPost(this.group, this.owner);
		const post2 = new GroupPost(this.group, this.owner);
		post1.entries = this.entries.slice(0, half);
		post2.entries = this.entries.slice(-half);
		return [post1, post2];
	}
}