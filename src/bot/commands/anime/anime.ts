interface Anime {
	genres: string[];
	format: string;
	siteUrl: string;
	description: string | null;
	episodes: number | null;
	averageScore: number | null;
	coverImage: { extraLarge: string };
	startDate: { year: number | null; month: number | null; day: number | null };
	endDate: { year: number | null; month: number | null; day: number | null };
	title: { romaji: string };
}

import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';


export default class ANISYNCCOMMAND extends Command {
	public constructor() {
		super('anime', {
			aliases: ['anime'],
			category: 'anime',
			description: {
				content: 'Shows info of an anime.',
				usage: '<query>',
				examples: ['One Piece', 'Yahari', 'Kimi no wa']
			},
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'query',
					match: 'restContent',
					type: 'lowercase',
					prompt: {
						start: (message: Message): string => `${message.author}, what would you like to search?`
					}
				}
			]
		});
	}

	public async exec(message: Message, { query }: { query: string }): Promise<Message | Message[]> {
		const { data: { Page: { media: [anime] } } }: { data: { Page: { media: [Anime] } } } = await (await fetch('https://graphql.anilist.co', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				query: `{
                    Page(perPage: 1) {
                      media(search: "${query}", isAdult: false) {
                        genres
                        format
                        siteUrl
                        description
                        episodes
                        averageScore
                        coverImage { extraLarge }
                        startDate { year month day}
                        endDate { year month day }
                        title { romaji }
                      }
                    }
                  }`
			})
		})).json();

		if (!anime) {
			return message.reply("Kitso couldn't / can't find the requested information. 😉");
		}

		const {
			year: startYear,
			month: startMonth,
			day: startDay
		} = anime.startDate;

		const {
			year: endYear,
			month: endMonth,
			day: endDay
		} = anime.endDate;

		const embed = new MessageEmbed()
			.setTitle(`**${anime.title.romaji}**`)
			.setURL(anime.siteUrl)
			.setDescription(this.safe(anime.description!.replace(/<br\s*\/?>/gm, '\n').replace(/<[^>]*>/g, ''), '―'))
			.addField('Type', `📺 **${anime.format}**`, true)
			.addField('Genres', `🔣 ${anime.genres.map(g => `**${g}**`).join(', ')}`, true)
			.addField('Episodes', `🎥 **${this.safe(anime.episodes)}**`, true)
			.addField('Score', `⭐ **${this.safe(anime.averageScore, '―')}**`, true)
			.setThumbnail(anime.coverImage.extraLarge)
			.setFooter(`${this.safe(startYear)}/${this.safe(startMonth)}/${this.safe(startDay)} to ${this.safe(endYear)}/${this.safe(endMonth)}/${this.safe(endDay)}`, 'https://i.imgur.com/b7xjPhF.png')
			.setColor('ORANGE');
		return message.util!.send(embed);
	}

	// eslint-disable-next-line @typescript-eslint/promise-function-async
	protected safe(value: any, nullIcon: string = '?'): any {
		return Boolean(value) ? value : nullIcon;
	}
}
