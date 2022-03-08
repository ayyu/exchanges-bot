import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import {
	Permissions,
	Guild,
	Role,
	CommandInteraction,
	ApplicationCommandPermissionData
} from 'discord.js';
import { ApplicationCommandPermissionTypes } from 'discord.js/typings/enums';
import { CommandHandler } from "../../lib/classes/CommandHandler";

const optionName = 'role';

const data = new SlashCommandSubcommandBuilder()
	.setName('role')
	.setDescription('Set which role can use this bot\'s commands')
	.addRoleOption(option => option
		.setName(optionName)
		.setDescription('Which role to use as exchange host')
		.setRequired(true));

async function buildPermissionData(
	guild: Guild,
	role: Role,
): Promise<ApplicationCommandPermissionData[]> {
	const basePermissions = [
		{
			id: guild.ownerId,
			type: ApplicationCommandPermissionTypes.USER,
			permission: true,
		},
		{
			id: role.id,
			type: ApplicationCommandPermissionTypes.ROLE,
			permission: true,
		},
		{
			id: guild.roles.everyone.id,
			type: ApplicationCommandPermissionTypes.ROLE,
			permission: false,
		},
	];
	const adminRoles = (await guild.roles.fetch())
		.filter(role => role.permissions.has(Permissions.FLAGS.ADMINISTRATOR));
	const adminPermissions: ApplicationCommandPermissionData[] = adminRoles.map(role => ({
		id: role.id,
		type: ApplicationCommandPermissionTypes.ROLE,
		permission: true,
	}));
	const permissions = adminPermissions
		.concat(basePermissions)
		.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
	return permissions;
}

async function execute(interaction: CommandInteraction): Promise<void> {
	const role = interaction.options.getRole('role') as Role;
	if (!role || !interaction.guild) return;
	const guild = interaction.guild;

	const commands = await interaction.guild.commands.fetch();
	await Promise.all(commands.map(async (command) => {
		const permissions = await buildPermissionData(guild, role);
		guild.commands.permissions.set({ command, permissions });
	}));
	await interaction.reply(`Set role for bot to ${role}`);
}

export default new CommandHandler(data, execute);
