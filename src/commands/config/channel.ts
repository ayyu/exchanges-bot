import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";
import { container } from "tsyringe";
import { CommandHandler } from "../../lib/classes/CommandHandler";
import { Keyv } from "../../services/keyvs";

const optionName = "channel";

const keyvs = container.resolve("keyvs") as Collection<string, Keyv>;

const data = new SlashCommandSubcommandBuilder()
	.setName("channel")
	.setDescription("Set which channel to use for exchanges")
	.addChannelOption(option => option
		.setName(optionName)
		.setDescription("Which channel to post exchanges in")
		.setRequired(true));

async function execute(interaction: CommandInteraction): Promise<void> {
	const channel = interaction.options.getChannel(optionName);
	const keyv = keyvs.get("channels");
	if (keyv && interaction.guild && channel) keyv.set(interaction.guild.id, channel.id)
		.then(() => interaction.reply(`Set exchange channel to ${channel}`));
}

export default new CommandHandler(data, execute);
