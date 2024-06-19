import { Event, assertOptionalProperties } from './events.base.js';
import { Events } from 'discord.js';

const messageCreate : Event<string> = {
    type: 'messageCreate',
    name: Events.MessageCreate,
    on: true,
    async execute(interaction: any) {
        
    }
}

export default assertOptionalProperties(messageCreate);