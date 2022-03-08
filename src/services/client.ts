import { singleton } from "tsyringe";
import { Client, ClientOptions, Collection } from "discord.js";

import { ICommandHandler } from "../lib/classes/ICommandHandler";

@singleton()
export default class BotClient extends Client {
	commands: Collection<string, ICommandHandler>;
	constructor(options: ClientOptions, token?: string) {
		super(options);
		this.token = token ?? null;
		this.commands = new Collection<string, ICommandHandler>();
	}
}
