module.exports = Collection => {
	/**
	 * @typedef {import('@discordjs/builders').SlashCommandBuilder} SlashCommandBuilder
	 * @typedef {import('@discordjs/builders').SlashCommandSubcommandBuilder} SlashCommandSubcommandBuilder
	 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
	 * @typedef {import('discord.js').Collection} Collection
	 */

	/**
	 * @callback CommandCallback
	 * @param {CommandInteraction} interaction
	 * @returns {Promise<any>}
	 */

	/**
	 * @callback RequireCallback
	 * @param {Command}
	 * @returns {void}
	 */
	
	class DiscordCommand {

		/**
		 * @param {SlashCommandBuilder|SlashCommandSubcommandBuilder} data 
		 * @param {CommandCallback} execute 
		 */
		constructor(data, execute = null) {
			this.data = data;
			this.execute = execute;
		}

		/**
		 * @param {CommandInteraction} interaction
		 * @returns {Promise<void>}
		 */
		async run(interaction) {
			if (this.execute) {
				return this.execute(interaction)
					.catch(err => this.error(interaction, err));
			}
		}

		/**
		 * @param {CommandInteraction} interaction
		 * @param {Error} error
		 * @returns {Promise<void>}
		 */
		async error(interaction, err) {
			return interaction.reply({
				content: err.message,
				ephemeral: true,
			})
				.then(() => console.error(err));
		}
	}

	class DiscordParentCommand extends DiscordCommand {
		/**
		 * @param {SlashCommandBuilder|SlashCommandSubcommandBuilder} data 
		 * @param {CommandCallback} execute 
		 * @param {Array<Command>} subcommands
		 */
		constructor(data, execute = null, subcommands = null) {
			super(data, execute);
			const callback = command => this.data.addSubcommand(command.data);
			this.subcommands = requireCommands(subcommands, callback);
		}
		
		/**
		 * @param {CommandInteraction} interaction
		 * @returns {Promise<void>}
		 */
		async run(interaction) {
			if (!interaction.options.getSubcommand(false)) return;
			const subcommand = this.subcommands.get(interaction.options.getSubcommand());
			if (!subcommand) return;
			return subcommand.execute(interaction)
				.catch(err => super.error(interaction, err));
		}
	}

	/**
	 * @param {Array<Command>} commands
	 * @param {RequireCallback} callback
	 * @returns {Collection<string, DiscordCommand>}
	 */
	function requireCommands(commands, callback = null) {
		/** @type {Collection<string, DiscordCommand>} */
		const collection = new Collection();
		for (const command of commands) {
			if (callback) callback(command);
			collection.set(command.data.name, command);
		}
		return collection;
	}

	return {
		DiscordCommand,
		DiscordParentCommand,
		requireCommands,
	};
};
