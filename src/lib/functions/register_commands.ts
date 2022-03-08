import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { Routes } from 'discord-api-types/v9';
import { ICommandHandler } from "../classes/ICommandHandler";
import commands from "../../commands";

export async function registerCommands(
	client: Client,
	guildId: string | null = null,
	token: string | null = null,
): Promise<void> {
	token = token || client.token;
	if (!token || !client.user)
		return;
	const rest: REST = new REST({ version: '9' }).setToken(token);
	const commandsJSON = commands.map(
		(command: ICommandHandler) => command.data.toJSON());
	const routes = guildId
		? Routes.applicationGuildCommands(client.user.id, guildId)
		: Routes.applicationCommands(client.user.id);
	return rest.put(routes, { body: commandsJSON })
		.then(() => console.log('Successfully registered commands.'))
		.catch(console.error);
}
