import { Client, Collection, CommandInteraction, GatewayIntentBits,  ClientOptions, IntentsBitField, VoiceChannel } from "discord.js";
import * as dotenv from 'dotenv';
import { getEvents, getCommands } from "./src/helpers/importHandler.js";

// Define an interface that extends Client to parse actual command
export interface Command {
    name: string;
    description: string;
    execute(interaction : CommandInteraction): Promise<void>; 
}

dotenv.config();
const token = process.env.DISCORD_TOKEN;

// add optional props to parent class Client<boolean> then adding commands to custom client class
export class OpenBotClient extends Client {
    public commands: Collection<string, Command>;
    public cooldowns: Collection<any, any>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.cooldowns = new Collection();
    }
}

const clientIntents = new IntentsBitField().add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildVoiceStates);

const client = new OpenBotClient({ 
    intents: clientIntents
});

async function initializeBot() { 
    client.login(token);
    getCommands(client);
    getEvents(client);
}

initializeBot().catch(console.error);

export { client };