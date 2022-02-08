const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { requireBotThread } = require('../../common/channels');
const format = require('../../common/format');
const { DiscordCommand } = require('../../models/commands')(Collection);
/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').Message} Message
 */

module.exports = () => {
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

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		requireBotThread(interaction);

		const groupNumber = interaction.options.getInteger('group');
		const hostMember = interaction.options.getMember('host');

		/** @param {Message} response */
		const filter = response => response.author.id == interaction.member.id;

		return interaction.reply({
			content:
		'Paste the list of entries given now as a message, using one line per entry. You have 60 seconds to do so.',
			ephemeral: true,
			fetchReply: true,
		})
			.then(() => {
				interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						let content = `${format.group(groupNumber)}, handed out by ${hostMember}\n`;
						const reply = collected.first();
						content += reply.content.split('\n')
							.map(format.unchecked)
							.reduce((post, line) => post + line + '\n', '');
						return interaction.followUp({
							content,
							fetchReply: true,
						})
							.then(list => list.pin())
							.then(() => reply.delete());
					})
					.catch(() => {
						interaction.followUp({
							content: 'Command timed out. Please enter the list within 60 seconds.',
							ephemeral: true,
						});
					});
			});
	};

	return new DiscordCommand(data, execute);
};