import { stripMarkdown } from "../src/lib/functions/format";

test("Strip Markdown", () => {
	expect(stripMarkdown("**asdf**")).toBe("asdf");
	expect(stripMarkdown("**||asdf||**")).toBe("asdf");
});