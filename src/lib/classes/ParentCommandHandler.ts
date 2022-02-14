import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";
import { ICommandHandler } from "./ICommandHandler";
import { CommandHandler } from "./CommandHandler";

export class ParentCommandHandler extends CommandHandler {
	subcommands: Collection<string, ICommandHandler>;

	constructor(data: SlashCommandBuilder, subcommands: CommandHandler[]) {
		super(data);
		this.subcommands = CommandHandler.collectCommands(
			subcommands,
			(command: ICommandHandler) => data
				.addSubcommand(command.data as SlashCommandSubcommandBuilder)
		);
	}

	async run(interaction: CommandInteraction): Promise<any> {
		if (!interaction.options.getSubcommand(false))
			return;
		const subcommand = this.subcommands.get(interaction.options.getSubcommand());
		if (subcommand)
			return subcommand.run(interaction);
	}
}
