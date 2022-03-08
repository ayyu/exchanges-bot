import { Message, TextBasedChannel } from "discord.js";
import { GroupPost } from "../classes/GroupPost";

const charLimit = 2000;

export async function editGroupPost(groupPost: GroupPost, original: Message) {
	const postString = groupPost.toString();
	if (postString.length >= charLimit) {
		const [post1, post2] = groupPost.split();
		await original.edit(post1.toString());
		await makeGroupPost(post2, original.channel);
	} else {
		await original.edit(postString);
	}
}

export async function makeGroupPost(groupPost: GroupPost, channel: TextBasedChannel) {
	let posts = [groupPost];
	const postString = groupPost.toString();
	if (postString.length >= charLimit) posts = groupPost.split();
	for (const post of posts) {
		const reply = await channel.send(post.toString());
		await reply.pin();
	}
}