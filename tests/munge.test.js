const munge = require('../app/common/munge');
const format = require('../app/common/format');

test('split a string along newlines and remove leading/trailing whitespace', () => {
	expect(munge.splitAndTrim(
		'\n	hello\n		world		  \n\n',
		'\n',
	)).toStrictEqual(['', 'hello', 'world', '', '']);
});

const standardPost =
`Group: 1
Anime Given: Kanon (2006)
Score: 5/10
Review: multiline review`;
const standardMatches = [{
	group: '1',
	entry: 'Kanon (2006)',
	score: '5/10'
}];
test('munge a normal single post', () => {
	expect(munge.matchLines(standardPost)).toStrictEqual(standardMatches);
});

const weirdPost =
`Group: 1
Anime Given: Sen to Chihiro no Kamikakushi (1/2)
Score: (69/100)`;
const weirdMatches = [{
	group: '1',
	entry: 'Sen to Chihiro no Kamikakushi',
	score: '69/100'
}];
test('munge a weird post with (x/y) entries', () => {
	expect(munge.matchLines(weirdPost)).toStrictEqual(weirdMatches);
});

const mixedPost =
`
anime given: bob the builder (94949/1205)

score: **6/7 not on mal**
group: 2

anime given: Sen to Chihiro no Kamikakushi (1/2)
Score: ||4.5/10||

group: 3
`;
const mixedMatches = [
	{
		group: '2',
		entry: 'bob the builder',
		score: '6/7'
	},
	{
		group: '3',
		entry: 'Sen to Chihiro no Kamikakushi',
		score: '4.5/10'
	},
];
test('munge a post with duplicates and wrong order', () => {
	expect(munge.matchLines(mixedPost)).toStrictEqual(mixedMatches);
});

const pinInput = { content:
`${format.group(2)}
${format.unchecked('bob the builder')}
${format.unchecked('snob the builder')}
${format.unchecked('bob the builder')}
${format.unchecked('bob the builder')}`,
	guild: { name: 'cool kids' }
}
const trigger = {
	member: {
		tag: 'me#4165',
		toString: () => '<@123>',
	}
}
const output =
`${format.group(2)}
${format.completed('bob the builder', '6/7')} ${trigger.member}
${format.unchecked('snob the builder')}
${format.unchecked('bob the builder')}
${format.unchecked('bob the builder')}
`;
test('update lines in a post after watching', () => {
	expect(munge.updateMatchedLine(pinInput, mixedMatches[0], trigger)).toBe(output);
});
