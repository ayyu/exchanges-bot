import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { CommandHandler } from "../../lib/classes/CommandHandler";

const optionName = 'url';

const data = new SlashCommandSubcommandBuilder()
	.setName('icon')
	.setDescription('Set the icon for this bot')
	.addStringOption(option => option
		.setName(optionName)
		.setDescription('URL of icon to be used')
		.setAutocomplete(false)
		.setRequired(true));

async function execute(interaction: CommandInteraction): Promise<void> {
	const icon = interaction.options.getString(optionName);
	if (!interaction.client.user) return;
	return interaction.client.user.setAvatar(icon)
		.then(user => interaction.reply({
			content: `Changed avatar to ${icon} for ${user}`,
			ephemeral: true,
		}));
}

export default new CommandHandler(data, execute);
