module.exports = keyvs => [
	require('./start')(keyvs),
	require('./list')(),
	require('./end')(),
];
