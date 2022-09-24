import { getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder } from 'discord.js';
import { Command } from './index';

const clear: Command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear!'),
  execute: async function execute(interaction: { guild: { id: string; }; }) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) connection.destroy();
  }
}

export default clear;