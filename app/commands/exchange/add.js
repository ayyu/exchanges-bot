const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { requireBotThread } = require('../../common/channels');
const format = require('../../common/format');
const { splitAndTrim } = require('../../common/munge');
const { DiscordCommand } = require('../../models/commands')(Collection);
/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').ThreadChannel} ThreadChannel
 */

module.exports = () => {
	const data = new SlashCommandSubcommandBuilder()
		.setName('add')
		.setDescription('Add to an existing a list of entries given')
		.addIntegerOption(option => option
			.setName('group')
			.setDescription('Group number of the list')
			.setRequired(true));

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		requireBotThread(interaction);

		const groupNumber = interaction.options.getInteger('group');

		/** @param {Message} response */
		const filter = response => response.author.id == interaction.member.id;

		return interaction.reply({
			content:
			'Paste the list of entries to add as a message, using one line per entry. You have 60 seconds to do so.',
			ephemeral: true,
			fetchReply: true,
		})
			.then(() => {
				interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						return interaction.channel.messages.fetchPinned(false)
							.then(pins => pins.filter(message => {
								const [header] = splitAndTrim(message.content, '\n');
								return header.includes(format.group(match.group));
							}))
							.then(pins => {
								const pin = pins.first();
								const content = format.formatMessageUnchecked(collected.first().content);
								return pin.edit(
									pin.content
									+ '\n'
									+ content,
								);
							})
							.then(() => collected.first.delete())
							.then(() => interaction.followUp({
								content: `Added to list in original message.`,
								ephemeral: true
							}))
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