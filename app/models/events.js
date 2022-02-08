class DiscordEvent {
	/**
	 * @param {string} name
	 * @param {Function} execute
	 * @param {boolean} once
	 */
	constructor(name, once = false, execute) {
		this.name = name;
		this.once = once;
		this.execute = execute;
	}
}

module.exports = { DiscordEvent };
