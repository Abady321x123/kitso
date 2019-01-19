const { Command } = require('discord-akairo');
const NekosClient = require('nekos.life');
const neko = new NekosClient();

class PatCommand extends Command {
	constructor() {
		super('pat', {
			aliases: ['pat'],
			cooldown: 5000,
			ratelimit: 3,
			category: 'action',
			channel: 'guild',
			description: {
				content: 'Pats the specified user/users.',
				examples: ['@Abady', '@Abady @Flart'],
				usage: '@user1 / @user2 ...'
			}
		});
	}

	async exec(message) {
		const { users } = message.mentions;
		if (users.size < 1) return message.channel.send(`:x: You need to mention a user/users.`);
		if (users.first().bot) return message.channel.send(`:x: You can't do that to bots.`);
		const img = await neko.getSFWPat();
		if (users.filter(m => m.username === message.author.username)) return message.channel.send(`:broken_heart: **I feel ya** *${this.id}s*`, { files: [img.url] });
		return message.channel.send(`💬 **${users.map(user => user.username).join(' ')}** you have been ${this.id}tted by **${message.author.username}**`, { files: [img.url] });
	}
}
module.exports = PatCommand;
