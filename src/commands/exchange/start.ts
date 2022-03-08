import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction, Message } from "discord.js";
import { container, Keyv } from "../../services";
import { requireNotThread } from "../../lib/functions/channels";
import * as messages from '../../config/messages';
import { CommandHandler } from "../../lib/classes/CommandHandler";

const optionName = 'name';

const keyvs = container.resolve("keyvs") as Collection<string, Keyv>;

const data = new SlashCommandSubcommandBuilder()
	.setName('start')
	.setDescription('Start a new exchange')
	.addStringOption(option => option
		.setName(optionName)
		.setDescription('Name of the exchange')
		.setRequired(true));

async function execute(interaction: CommandInteraction) {
	requireNotThread(interaction);

	const keyv = keyvs.get("channels");
	if (!interaction.guild) return;
	const channelId = await keyv?.get(interaction.guild.id);
	if (keyv && channelId && channelId != interaction.channelId) {
		throw new Error(messages.wrongChannelError);
	}

	const exchangeName = interaction.options.getString(optionName);
	if (!exchangeName) throw new Error(`No exchange name provided`);
	
	const reply = await interaction.reply({
		content: `**${exchangeName}**`,
		fetchReply: true,
	}) as Message;
	await reply.pin();
	await reply.startThread({
		name: exchangeName,
		autoArchiveDuration: 'MAX',
		reason: 'New exchange started',
		rateLimitPerUser: 60,
	});
}

export default new CommandHandler(data, execute);
