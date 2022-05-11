import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandHandler } from 'src/lib/classes/CommandHandler';
import { timeout } from '../config/timeout';

const data = new SlashCommandBuilder()
	.setName('post')
	.setDescription('Sends a post from the bot.');

async function execute(interaction: CommandInteraction): Promise<void> {
    const filter = (response: Message) => response.author.id == interaction.user.id;

	await interaction.reply({
		content: 'Paste the name of the entry to be added now. You have 60 seconds to do so.',
		ephemeral: true,
	});
	const collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: timeout, errors: ['time'] });
	if (!collected) {
		await interaction.followUp({
			content: `Command timed out. Please enter the entry within ${timeout/1000} seconds.`,
			ephemeral: true,
		});
		return;
	}
    const response = collected.first()?.content;
    await collected.first()?.delete();
    if (!response) return;
    await interaction.followUp(response);
}

export default new CommandHandler(data, execute);
