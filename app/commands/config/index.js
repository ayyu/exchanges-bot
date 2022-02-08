module.exports = keyvs => [
	require('./channel')(keyvs),
	require('./role')(),
];
