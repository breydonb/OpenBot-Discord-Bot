import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

const cooldown = 5;

const data = new SlashCommandBuilder()
    .setName('gemini')
    .setDefaultMemberPermissions(0)
    .setDescription('Replies with Pong! and provides ping to discord bot.')
    .addStringOption(option => 
        option.setName('question')
        .setDescription('What is your question for Google Gemini')
        .setRequired(true)
    );

const execute = async (interaction : any) => {
    const apiKey = process.env.AI_API_KEY;
    if(interaction && apiKey) {
        const { options } = interaction;
        const generativeai = new GoogleGenerativeAI(apiKey);
        const model = generativeai.getGenerativeModel({model: "gemini-1.5-flash"});
        const result = (await model.generateContent(options.data[0].value)).response.text();
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Google Gemini Response')
            .setAuthor({ name: 'OpenBot' })
            .setDescription(result)
            .setTimestamp();
        await interaction.reply({embeds: [embed]});
    }
}

export { data, execute, cooldown };