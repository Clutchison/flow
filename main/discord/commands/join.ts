import { SlashCommandBuilder } from 'discord.js';
import { getCircularReplacer, jlog } from '../../util';
import { joinVoiceChannel, demuxProbe } from '@discordjs/voice';
import { join as j, resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { Command } from './index';

import { createAudioPlayer, createAudioResource, StreamType } from '@discordjs/voice';

const join: Command = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joining!'),
	execute: async function execute(interaction) {
		console.log('Joining...');
		interaction.member.fetch();
		const channel = interaction.member.voice.channel;
		if (channel) {
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			const player = createAudioPlayer();

			// const resource = createAudioResource(j(__dirname, 'd2.mp3'));
			const stream = createReadStream(resolve(j(__dirname, 'output.ogg')));
			const resource = createAudioResource(stream, { inputType: StreamType.OggOpus });
			jlog(resource, 'Resource', getCircularReplacer());
			const subscription = connection.subscribe(player);

			if (subscription) {
				console.log('Success on subscription');
				player.play(resource);
			}

			setTimeout(() => {
				player.stop();
				connection.destroy();
			},
				8000);
		}
	}
}

export default join;