import { Collection } from "discord.js";
import Keyv from "keyv";
import { uri, options } from "../config/keyv";

const keyvs = new Collection<string, Keyv>();
keyvs.set('channels', new Keyv(uri, { ...options, namespace: "channel" }));

export default keyvs;
export { Keyv };
