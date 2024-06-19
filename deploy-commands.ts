import { LocaleString, REST, Routes} from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Configure environment variable
dotenv.config()
const token: string  = process!.env.DISCORD_TOKEN as string;
const clientId: string = process!.env.CLIENT_ID as string;
const guildId: string = process!.env.GUILD_ID as string;

if (!token || !clientId || !guildId) {
    console.error('DISCORD_TOKEN, CLIENT_ID, and GUILD_ID environment variables are required.');
    process.exit(1);
}
// Initializes commands array
const commands: Array<Command> = [];

interface Command {
	name: string;
	description: string;
	description_localizations: {
		locale: LocaleString,
		description: string
	};
	default_member_permissions: string | number | bigint;
}

async function getCommands() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
			
	// Grab all the command folders from the commands directory you created earlier
	const foldersPath = path.join(__dirname, 'src/commands/');
	const commandFolders = fs.readdirSync(foldersPath);
	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} 
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10'}).setToken(token as string);

// and deploy your commands!
(async () => {
	try {
		await getCommands();
		console.log(`Commands to be imported:\t${commands.length}`)
		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);
		console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
		

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();