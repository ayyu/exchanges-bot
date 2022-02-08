const { Client } = require('discord.js');
const { options, token } = require('../config/discord-client');

const client = new Client(options);
client.token = token;

module.exports = client;
