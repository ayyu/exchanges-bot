import { Awaitable } from "discord.js";

type EventCallback = (...args: any[]) => Awaitable<void>;

export default interface DiscordEvent {
	name: string;
	execute: EventCallback;
	once?: boolean;
}
