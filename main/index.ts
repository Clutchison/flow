import { Interaction } from 'discord.js';
import { TOKEN } from './config/.secrets.js';
import client from './discord';
import { getChannel, getVideo, searchForVideo } from './youtube/demo.js';
// const yt = require(resolve('./main/youtube/demo.ts'));


client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
  const creds = getVideo('dQw4w9WgXcQ');
  // yt.getVideo('Never gonna give you up');
});


client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  console.log(JSON.stringify(interaction.command));

  const command = client.commands.get(interaction.commandName);

  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  } else {
    await interaction.reply({ content: "This command doesn't exist on the server!", ephemeral: true });
  }
});

client.login(TOKEN);