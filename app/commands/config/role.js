const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Collection, Permissions } = require('discord.js');
const { DiscordCommand } = require('../../models/commands')(Collection);
/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').Guild} Guild
 * @typedef {import('discord.js').Role} Role
 * @typedef {import('discord.js').ApplicationCommandPermissionData} ApplicationCommandPermissionData
 */

module.exports = () => {
	const optionName = 'role';

	const data = new SlashCommandSubcommandBuilder()
		.setName('role')
		.setDescription('Set which role can use this bot\'s commands')
		.addRoleOption(option => option
			.setName(optionName)
			.setDescription('Which role to use as exchange host')
			.setRequired(true));

	/**
 * @param {Guild} guild
 * @param {Role} role
 * @returns {Array<ApplicationCommandPermissionData>}
 */
	const buildPermissions = async (guild, role) => {
		const permissions = [
			{
				id: guild.ownerId,
				type: 'USER',
				permission: true,
			},
			{
				id: role.id,
				type: 'ROLE',
				permission: true,
			},
			{
				id: guild.roles.everyone.id,
				type: 'ROLE',
				permission: false,
			},
		];
		return guild.roles.fetch()
			.then(roles => roles
				.filter(adminRole => adminRole.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
				.map(adminRole => ({
					id: adminRole.id,
					type: 'ROLE',
					permission: true,
				}))
				.concat(permissions)
				.filter((v, i, a) => // remove duplicate role IDs
					a.findIndex(t => (t.id === v.id)) === i
				)
			);
	};

	/** @param {CommandInteraction} interaction */
	const execute = async interaction => {
		const role = interaction.options.getRole(optionName);
		const permissions = await buildPermissions(interaction.guild, role);
		return interaction.client.application.commands.fetch()
			.then(commands => Promise.all(commands.map(async command => {
				command.permissions.set({ guild: interaction.guild.id, permissions });
			})))
			.then(() => interaction.reply(`Set exchange manager role to ${role.name}`));
	};

	return new DiscordCommand(data, execute);
};