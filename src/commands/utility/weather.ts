import { SlashCommandBuilder } from "discord.js";
import { OpenWeatherAPI } from "openweather-api-node";
import * as dotenv from 'dotenv';

dotenv.config();

const data = new SlashCommandBuilder()
    .setName('weather')
        .setDefaultMemberPermissions(0)
        .setDescription('Gets current forecast for given city')
        .addStringOption(option => 
            option.setName('city')
            .setDescription('The city ')
            .setRequired(true)
        );

const execute = async (interaction : any) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if(interaction && apiKey) {
        const { options } = interaction;
        try {
            const weather = new OpenWeatherAPI({
                key: apiKey,
                locationName: options.data[0].value,
                units: 'imperial'
            });
            const data = await weather.getCurrent();
            console.log(data);
        } catch(error){
            console.log(error);
        }
    }
}

export {data, execute}