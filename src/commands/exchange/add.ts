import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from 'discord.js';
import { requireBotThread } from '../../lib/functions/channels';
import { timeout } from '../../config/timeout';
import { CommandHandler } from "../../lib/classes/CommandHandler";
import { GroupPost } from '../../lib/classes/GroupPost';
import { Entry } from '../../lib/classes/Entry';
import { editGroupPost } from "../../lib/functions/posts";
import { splitAndTrim } from "../../lib/functions/format";

const data = new SlashCommandSubcommandBuilder()
	.setName('add')
	.setDescription('Add an entry to an existing list of entries.')
	.addIntegerOption(option => option
		.setName('group')
		.setDescription('Group number of the list to add to')
		.setRequired(true));

async function execute(interaction: CommandInteraction): Promise<void> {
	requireBotThread(interaction);

	const groupNumber = interaction.options.getInteger('group');
	if (!groupNumber) throw new Error(`Missing required option(s)`);
	if (!interaction.channel) throw new Error(`Command must be called in thread`);

	const filter = (response: Message) => response.author.id == interaction.user.id;

	await interaction.reply({
		content: 'Paste the list of entries to be added now. You have 60 seconds to do so.',
		ephemeral: true,
	});
	const collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: timeout, errors: ['time'] });
	if (!collected) {
		await interaction.followUp({
			content: `Command timed out. Please enter the entry within ${timeout / 1000} seconds.`,
			ephemeral: true,
		});
		return;
	}
	const entryList = collected.first()?.content;
	await collected.first()?.delete();
	if (!entryList) return;

	const pins = await interaction.channel.messages.fetchPinned(false);
	for (const [, pin] of pins) {
		const groupPost = GroupPost.fromString(pin.content);
		if (!groupPost) continue;
		if (groupPost.group == groupNumber.toString()) {
			splitAndTrim(entryList).forEach(entry => groupPost.entries.push(new Entry(entry)));
			await editGroupPost(groupPost, pin);
			break;
		}
	}
}

export default new CommandHandler(data, execute);
