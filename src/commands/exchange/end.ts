import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ThreadChannel } from 'discord.js';
import { requireBotThread } from '../../lib/functions/channels';
import { CommandHandler } from "../../lib/classes/CommandHandler";

const data = new SlashCommandSubcommandBuilder()
	.setName('end')
	.setDescription('End an exchange thread by locking and unpinning');

async function execute(interaction: CommandInteraction) {
	requireBotThread(interaction);

	const thread = interaction.channel as ThreadChannel;

	const starter = await thread.fetchStarterMessage({ force: true });
	const reason = 'Exchange ended.';
	await thread.setLocked(true, reason);
	await starter.unpin();
	await interaction.reply({
		content: "Exchange ended. Thread locked and starter message unpinned.",
		ephemeral: true,
	});
}

export default new CommandHandler(data, execute);
