import { SlashCommandBuilder } from '@discordjs/builders';
import { ParentCommandHandler } from "../lib/classes/ParentCommandHandler";
import subcommands from "./config/";

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Commands for configuring this bot');

export default new ParentCommandHandler(data, subcommands);
