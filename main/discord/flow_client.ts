import { Client, Collection } from 'discord.js';
import { Command } from './commands';

export default class FlowClient extends Client {
  public commands: Collection<string, Command>;
} 