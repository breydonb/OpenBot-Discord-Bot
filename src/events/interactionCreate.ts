import { Events, CommandInteraction } from 'discord.js';
import { Event, assertOptionalProperties } from './events.base.js'
import { client } from '../../index.js'

const handleCommandInteraction = async ( interaction : CommandInteraction) => {
    if(interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if(command){
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                const errorMessage = { content: 'There was an error while executing this command!', ephemeral: true };
                (interaction.replied || interaction.deferred) ? await interaction.followUp(errorMessage) : await interaction.reply(errorMessage);
            }
        }
    }
}

const interactionCreate : Event<string> = {
    type: 'interactionCreate',
    name: Events.InteractionCreate,
    on: true,
    async execute(interaction: any) {
        handleCommandInteraction(interaction)
    }
}

export default assertOptionalProperties(interactionCreate);