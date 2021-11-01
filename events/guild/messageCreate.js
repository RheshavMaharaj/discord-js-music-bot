const { prefix } = require('../../config.json');
module.exports = async (client, player, message) => {
  const serverPrefix = prefix;
  const args = message.content.slice(serverPrefix.length).trim().split(/ +/g);
  const cmd = args.shift();

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const command = client.messageCommands.get(cmd) || client.aliases.get(cmd);

  // Executing message commands and personal commands
  // If command contains double prefix, execute personal command
  if (command) {
    try {
      await command.execute(client, player, message, args);
    }
    catch (error) {
      console.error(error);
      await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }

};