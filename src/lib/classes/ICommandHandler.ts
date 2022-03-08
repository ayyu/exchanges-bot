import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export type SlashCommandEitherBuilder = SlashCommandBuilder | SlashCommandSubcommandBuilder;

export interface ICommandHandler {
	data: SlashCommandEitherBuilder;
	run: (interaction: CommandInteraction) => Promise<void>;
	error: (interaction: CommandInteraction, err: Error) => Promise<void>;
}
