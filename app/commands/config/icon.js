const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { DiscordCommand } = require('../../models/commands')(Collection);
/** @typedef {import('discord.js').CommandInteraction} CommandInteraction */

module.exports = () => {
	const optionName = 'url';

	const data = new SlashCommandSubcommandBuilder()
		.setName('icon')
		.setDescription('Set the icon for this bot')
		.addChannelOption(option => option
			.setName(optionName)
			.setDescription('URL of icon to be used')
			.setRequired(true));

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		const icon = interaction.options.getString(optionName);
		return interaction.client.user.setAvatar(icon)
			.then(user => interaction.reply({
				content: `Changed avatar to ${icon} for ${user}`,
				ephemeral: true,
			}));
	};

	return new DiscordCommand(data, execute);
};
