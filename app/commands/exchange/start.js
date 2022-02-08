const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { requireNotThread } = require('../../common/channels');
const messages = require('../../config/messages');
const { DiscordCommand } = require('../../models/commands')(Collection);
/** @typedef {import('discord.js').CommandInteraction} CommandInteraction */

module.exports = keyvs => {
	const optionName = 'name';

	const data = new SlashCommandSubcommandBuilder()
		.setName('start')
		.setDescription('Start a new exchange')
		.addStringOption(option => option
			.setName(optionName)
			.setDescription('Name of the exchange')
			.setRequired(true));

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		requireNotThread(interaction);

		await keyvs.channel.get(interaction.guild.id).then(channel => {
			if (!channel || channel == interaction.channelId) return;
			throw new Error(messages.wrongChannelError);
		});

		const exchangeName = interaction.options.getString(optionName);
		return interaction.reply({
			content: `**${exchangeName}**`,
			fetchReply: true,
		})
			.then(reply => reply.pin())
			.then(reply => reply.startThread({
				name: exchangeName,
				autoArchiveDuration: 'MAX',
				reason: 'New exchange started'
			}));
	};

	return new DiscordCommand(data, execute);
};
