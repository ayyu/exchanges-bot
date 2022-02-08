const format = require('../app/common/format');
const config = format.config;

test('prepends empty ballot box emoji to string', () => {
	expect(format.unchecked('abc')).toBe(`${config.uncheckSymbol} abc`);
	expect(format.unchecked('abc')).not.toBe('abc');
	expect(format.unchecked('abc')).not.toBe(`${config.checkSymbol} abc`);
});

test('prepends checked ballot box emoji to string', () => {
	expect(format.checked('abc')).toBe(`${config.checkSymbol} abc`);
	expect(format.checked('abc')).not.toBe('abc');
	expect(format.checked('abc')).not.toBe(`${config.uncheckSymbol} abc`);
});

test('appends score in bolded markdown to string', () => {
	expect(format.scored('abc', '4/10')).toBe(
		`abc ${config.scoreFormat.replace(config.scoreToken, '4/10')}`);
})

test('applies both checked and scored', () => {
	expect(format.completed('abc', '4/10')).toBe(
		`${config.checkSymbol} abc ${config.scoreFormat.replace(config.scoreToken, '4/10')}`);
})

test('prepends "Group" and formats group in bolded markdown', () => {
	expect(format.group(4)).toBe(config.groupFormat.replace(config.groupToken, 4));
	expect(format.group('4')).toBe(config.groupFormat.replace(config.groupToken, 4));
	expect(format.group('4')).toBe(config.groupFormat.replace(config.groupToken, '4'));
	expect(format.group(4)).toBe(config.groupFormat.replace(config.groupToken, '4'));
})

test('strip various forms of discord markdown', () => {
	expect(format.stripMarkdown('||'))
		.toBe('');
	expect(format.stripMarkdown('Score: ||4/10||'))
		.toBe('Score: 4/10');
	expect(format.stripMarkdown('Score: **4/10**'))
		.toBe('Score: 4/10');
	expect(format.stripMarkdown('Anime Given: Guardian Hearts **(1/2)**'))
		.toBe('Anime Given: Guardian Hearts (1/2)');
})