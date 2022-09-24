import { Command } from ".";
import { SlashCommandBuilder } from 'discord.js';

const ping: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Joining!'),
	execute: async (interaction) => {
		await interaction.reply('Pong!');
	},
}

export default ping;