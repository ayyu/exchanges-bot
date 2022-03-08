import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from 'discord.js';
import { requireBotThread } from '../../lib/functions/channels';
import { timeout } from '../../config/timeout';
import { CommandHandler } from "../../lib/classes/CommandHandler";
import { GroupPost } from '../../lib/classes/GroupPost';
import { makeGroupPost } from "../../lib/functions/posts";

const data = new SlashCommandSubcommandBuilder()
	.setName('list')
	.setDescription('Post a list of entries given')
	.addIntegerOption(option => option
		.setName('group')
		.setDescription('Group number of the list')
		.setRequired(true))
	.addUserOption(option => option
		.setName('host')
		.setDescription('Host for this group')
		.setRequired(true));

async function execute(interaction: CommandInteraction) {
	requireBotThread(interaction);

	const groupNumber = interaction.options.getInteger('group');
	const hostMember = interaction.options.getUser('host');
	if (!groupNumber || !hostMember) throw new Error(`Missing required option(s)`);
	if (!interaction.channel) throw new Error(`Command must be called in thread`);

	const filter = (response: Message) => response.author.id == interaction.user.id;

	await interaction.reply({
		content: 'Paste the list of entries given now as a message, using one line per entry. You have 60 seconds to do so.',
		ephemeral: true,
	});
	const collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: timeout, errors: ['time'] });
	if (!collected) {
		await interaction.followUp({
			content: `Command timed out. Please enter the list within ${timeout/1000} seconds.`,
			ephemeral: true,
		});
		return;
	}
	const groupPost = new GroupPost(
		groupNumber.toString(),
		hostMember.id,
		collected.first()?.content
	);
	await makeGroupPost(groupPost, interaction.channel);
	await collected.first()?.delete();
}

export default new CommandHandler(data, execute);
