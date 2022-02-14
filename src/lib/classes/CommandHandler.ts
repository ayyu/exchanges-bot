import { Collection, CommandInteraction } from "discord.js";
import { SlashCommandEitherBuilder, ICommandHandler } from "./ICommandHandler";

export type CollectCallback = (command: ICommandHandler) => any;
export type CommandCallback = (interaction: CommandInteraction) => Promise<any>;

export class CommandHandler implements ICommandHandler {
	data: SlashCommandEitherBuilder;
	private execute?: CommandCallback;

	constructor(data: SlashCommandEitherBuilder, execute?: CommandCallback) {
		this.data = data;
		this.execute = execute;
	}

	async run(interaction: CommandInteraction): Promise<any> {
		if (this.execute)
			return this.execute(interaction)
				.catch((err: Error) => this.error(interaction, err));
	}

	async error(interaction: CommandInteraction, err: Error): Promise<void> {
		return interaction.reply({
			content: err.message,
			ephemeral: true,
		}).then(() => console.error(err));
	}

	static collectCommands(
		commands: ICommandHandler[],
		callback?: CollectCallback
	): Collection<string, ICommandHandler> {
		const collection = new Collection<string, ICommandHandler>();
		for (const command of commands) {
			if (callback)
				callback(command);
			collection.set(command.data.name, command);
		}
		return collection;
	}
}
