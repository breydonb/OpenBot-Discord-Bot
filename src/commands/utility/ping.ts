import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder} from 'discord.js';
import { client } from '../../../index.js';

const cooldown = 5;

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDefaultMemberPermissions(0)
    .setDescription('Replies with Pong! and provides ping to discord bot.')

const execute = async ( interaction : CommandInteraction ) =>{
    const embed = new EmbedBuilder()
        .setTitle('Network Specs')
        .addFields(
            {name: 'Bot Latency:\t', value: `${client.ws.ping}ms`, inline: true}
        )
    await interaction.reply({ embeds: [embed] });
}

export { data, execute, cooldown };