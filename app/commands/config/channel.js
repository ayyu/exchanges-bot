const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { DiscordCommand } = require('../../models/commands')(Collection);
/** @typedef {import('discord.js').CommandInteraction} CommandInteraction */

module.exports = keyvs => {
	const optionName = 'channel';

	const data = new SlashCommandSubcommandBuilder()
		.setName('channel')
		.setDescription('Set which channel to use for exchanges')
		.addChannelOption(option => option
			.setName(optionName)
			.setDescription('Which channel to post exchanges in')
			.setRequired(true));

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		const channel = interaction.options.getChannel(optionName);
		return keyvs.channel.set(interaction.guild.id, channel.id)
			.then(() => interaction.reply(`Set exchange channel to ${channel}`));
	};

	return new DiscordCommand(data, execute);
};
