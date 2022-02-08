const Keyv = require('keyv');

const channel = new Keyv({
	store: require('../config/keyv').store,
	namespace: 'channel',
});

module.exports = {
	channel,
};
