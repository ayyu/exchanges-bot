const Keyv = require('keyv');
const { uri, options } = require('../config/keyv');

const channel = new Keyv(uri, { ...options, namespace: 'channel' });

module.exports = {
	channel,
};
