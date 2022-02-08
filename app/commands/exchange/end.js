const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { requireBotThread } = require('../../common/channels');
const { DiscordCommand } = require('../../models/commands')(Collection);
/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').ThreadChannel} ThreadChannel
 */

module.exports = () => {
	const reason = 'Exchange ended.';
	
	const data = new SlashCommandSubcommandBuilder()
		.setName('end')
		.setDescription('End an exchange thread by archiving, locking, and unpinning');

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		requireBotThread(interaction);

		/** @type {ThreadChannel} */
		const thread = interaction.channel;

		return thread.fetchStarterMessage({ force: true })
			.then(starter => starter.unpin())
			.then(() => interaction.reply(reason))
			.then(() => thread.setLocked(true, reason))
			.then(() => thread.setArchived(true, reason));
	};

	return new DiscordCommand(data, execute);
};
