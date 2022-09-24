import commands from "./commands";
import { intents } from "./config";
import FlowClient from "./flow_client";

const client = new FlowClient({ intents: intents });

client.commands = commands;

export default client;
