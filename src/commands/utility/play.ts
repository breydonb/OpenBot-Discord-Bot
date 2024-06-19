import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder} from 'discord.js';
import { NoSubscriberBehavior, VoiceConnectionStatus, createAudioPlayer, createAudioResource, generateDependencyReport, joinVoiceChannel } from '@discordjs/voice';

import { OpusEncoder } from '@discordjs/opus';

const data = new SlashCommandBuilder()
    .setName('play')
    .setDefaultMemberPermissions(0)
    .setDescription('Plays song from spotify')
    .addStringOption(option => 
        option.setName('song')
        .setDescription('The name or URL of the song to play')
        .setRequired(true)
    );

const execute = async ( interaction: any) => {
    const { options, guild } = interaction;
    if(interaction){
        try {
            console.log(options.data[0].value);

            const connection = joinVoiceChannel({
                channelId: '1248931132096118826',
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            connection.on(VoiceConnectionStatus.Ready, () => {
                const subscription = connection.subscribe(player);
                if(subscription) {
                    console.log(subscription);
                }
            })
            connection.on(VoiceConnectionStatus.Signalling, (oldState, newState) =>{
                console.log(connection);
            });
            connection.on(VoiceConnectionStatus.Destroyed, () => {
                player.stop();
                connection.destroy();
            });
            connection.on(VoiceConnectionStatus.Disconnected, () => {
                player.stop();
                connection.disconnect();
            });
        } catch(error) {
            console.log(error);
            console.log(generateDependencyReport());
        }
    }
}

export { data, execute };