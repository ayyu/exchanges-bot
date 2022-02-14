type EventCallback = (model: unknown) => Promise<void> | void;

export default interface DiscordEvent {
	name: string;
	execute: EventCallback;
	once?: boolean;
}
