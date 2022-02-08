const munge = require('../app/common/munge');

const standardPost =
`Group: 1
Anime Given: Sen to Chihiro no Kamikakushi
Score: 5/10
Review: multiline review`;

const weirdPost =
`Group: 1
Anime Given: Sen to Chihiro no Kamikakushi (1/2)
Score: 69/100`;

test('munges a post', () => {
	expect(munge.matchLines(standardPost)).toStrictEqual({
		group: '1',
		anime: 'Sen to Chihiro no Kamikakushi',
		score: '5/10'
	});
});

test('munge with (x/y) entries', () => {
	expect(munge.matchLines(weirdPost)).toStrictEqual({
		group: '1',
		anime: 'Sen to Chihiro no Kamikakushi',
		score: '69/100'
	});
});