module.exports = keyvs => [
	require('./exchange')(keyvs),
	require('./config')(keyvs),
];
