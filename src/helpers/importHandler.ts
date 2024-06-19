import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { OpenBotClient, Command } from '../../index.js';
import { Collection } from 'discord.js';

interface ErrorHandler {
    errorCode: number,
    message: string
}

export async function getCommands(client: OpenBotClient) : Promise<void> { 
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const file of commandFolders) {
        const commandsPath = path.join(foldersPath, file);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) { 
            const filePath = path.join(commandsPath, file);
            const command = await import(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
            else {
                const error : ErrorHandler = {
                    errorCode: 1,
                    message: `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`
                }
                console.warn(`Error Code: ${error.errorCode}\nError Message ${error.message}`);
            }
        }
    }
}

export async function getEvents (client: OpenBotClient) : Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        if(file.toString() !== "events.base.ts"){
            const eventModule = await import(filePath);
            const event = eventModule.default;
            if(event) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                }
                else if (event.on) {
                    client.on(event.name, (interaction) => event.execute(interaction));
                }
                else {
                    const error : ErrorHandler = {
                        errorCode: 1,
                        message: `[WARNING] The command at ${filePath} is missing a required "on" or "execute" property.`
                    }
                    console.warn(`Error Code: ${error.errorCode}\nError Message ${error.message}`);
                }
            }
        }
    }
}