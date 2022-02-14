import { SlashCommandBuilder } from '@discordjs/builders';
import { ParentCommandHandler } from "../lib/classes/ParentCommandHandler";
// import subcommands from "./exchange";

const data = new SlashCommandBuilder()
	.setName('exchange')
	.setDescription('Commands for managing exchanges');

export default new ParentCommandHandler(data, []);
