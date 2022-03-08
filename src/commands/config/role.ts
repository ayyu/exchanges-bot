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

async function buildPermissionsOptions(
	guild: Guild,
	role: Role,
): Promise<{guild: Guild, permissions: ApplicationCommandPermissionData[] }> {
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
	const permissions = await guild.roles.fetch()
		.then(roles => roles.filter(adminRole => adminRole.permissions.has(Permissions.FLAGS.ADMINISTRATOR)))
		.then(adminRoles => adminRoles.map(adminRole => ({
			id: adminRole.id,
			type: ApplicationCommandPermissionTypes.ROLE,
			permission: true,
		})))
		.then(adminPermissions => adminPermissions.concat(basePermissions))
		.then(permissions => permissions
			.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
	return { guild, permissions };
}

async function execute(interaction: CommandInteraction): Promise<void> {
	const role = interaction.options.getRole('role');
	if (!role || !interaction.guild) return;

	return interaction.guild.commands.fetch()
		.then(commands => Promise.all(commands.map(async (command) => 
			buildPermissionsOptions(interaction.guild as Guild, role as Role)
				.then(options => command.permissions.set(options))
		)))
		.then(() => interaction.reply(`Set role for bot to ${role}`));
}

export default new CommandHandler(data, execute);
