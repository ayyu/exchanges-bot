const munge = require('../app/common/munge');
const format = require('../app/common/format');
const config = format.config;

test('split a string along newlines and remove leading/trailing whitespace', () => {
	expect(munge.splitAndTrim(
		'\n	hello\n		world		  \n\n',
		'\n',
	)).toStrictEqual(['', 'hello', 'world', '', '']);
});

const standardPost =
`${config.groupPrefix} 1
${config.entryPrefix} Kanon (2006)
${config.scorePrefix} 5/10
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
`${config.groupPrefix} 1
${config.entryPrefix} Sen to Chihiro no Kamikakushi (1/2)
${config.scorePrefix} **(69/100)**`;
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
${config.entryPrefix.toLowerCase()}bob the builder (94949/1205)

		${config.scorePrefix.toLowerCase()}                **6/7 not on mal**
      ${config.groupPrefix.toLowerCase()} 				2

${config.entryPrefix.toLowerCase()} 	Sen to ***Chihiro*** no Kamikakushi (1/2)
	${config.scorePrefix.toUpperCase()}||4.5/10||

${config.groupPrefix.toLowerCase()}**3**
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
${format.completed('bob the builder', '6/7')}
${format.unchecked('snob the builder')}
${format.unchecked('bob the builder')}
${format.unchecked('bob the builder')}
`;
test('update lines in a post after watching', () => {
	expect(munge.updateMatchedLine(pinInput, mixedMatches[0])).toBe(output);
});
