import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ThreadChannel } from 'discord.js';
import { requireBotThread } from '../../lib/functions/channels';
import { CommandHandler } from "../../lib/classes/CommandHandler";

const reason = 'Exchange ended.';

const data = new SlashCommandSubcommandBuilder()
	.setName('end')
	.setDescription('End an exchange thread by locking and unpinning');

async function execute(interaction: CommandInteraction) {
	requireBotThread(interaction);

	const thread = interaction.channel as ThreadChannel;

	const starter = await thread.fetchStarterMessage({ force: true });
	await starter.unpin();
	await thread.setLocked(true, reason);
}

export default new CommandHandler(data, execute);
