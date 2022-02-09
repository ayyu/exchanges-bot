const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const { requireBotThread } = require('../../common/channels');
const format = require('../../common/format');
const { updateListTitle } = require('../../common/munge');
const { timeout } = require('../../config/timeout');
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
				interaction.channel.awaitMessages({ filter, max: 1, time: timeout, errors: ['time'] })
					.then(collected => {
						const formattedList = format.formatMessageUnchecked(collected.first().content);
						const title = format.listTitle(groupNumber, hostMember, 0, 0);
						const content = title + '\n' + formattedList;
						return interaction.followUp({
							content,
							fetchReply: true,
						})
							.then(reply => reply.edit(updateListTitle(reply.content, groupNumber)))
							.then(reply => reply.pin())
							.then(() => collected.first().delete())
							.then(() => interaction.followUp({
								content: `Posted and pinned list of entries given.`,
								ephemeral: true
							}));
					})
					.catch(err => {
						console.log(err);
						if (typeof err == 'Collection' && err.size == 0) {
							return interaction.followUp({
							content: `Command timed out. Please enter the list within ${timeout/1000} seconds.`,
							ephemeral: true,
							});
						}
						return interaction.followUp({
							content: err.message,
							ephemeral: true,
						})
					});
			});
	};

	return new DiscordCommand(data, execute);
};