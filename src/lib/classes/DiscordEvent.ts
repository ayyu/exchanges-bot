export default interface DiscordEvent {
	name: string;
	execute: Function;
	once?: boolean;
}
