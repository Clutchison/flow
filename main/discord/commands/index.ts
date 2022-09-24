import clear from './clear';
import join from './join';
import ping from './ping';

import { Collection, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder,
  execute: Function
}

const commands = new Collection<string, Command>();
commands.set('clear', clear);
commands.set('join', join);
commands.set('ping', ping);

export default commands;