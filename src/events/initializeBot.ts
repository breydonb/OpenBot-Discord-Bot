import { Events } from 'discord.js';
import { Event, assertOptionalProperties } from './events.base.js';

const initializeBot: Event<string> = {
    type: 'intitalizeBot',
    name: Events.ClientReady,
    once: true,
    execute(client) {
        if(client) {
            console.log(`Ready! Logged in as ${client!.user!.tag}`);
        }
    }
}

export default assertOptionalProperties(initializeBot);
