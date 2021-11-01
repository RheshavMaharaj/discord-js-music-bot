const fs = require('fs');

module.exports = (client) => {
  const loadDir = (dirs) => {
    const msgCommandFiles = fs.readdirSync(`./message-commands/${dirs}`).filter(file => file.endsWith('.js'));
    for (const file of msgCommandFiles) {
      const messageCommand = require(`../message-commands/${dirs}/${file}`);
      // Message Commands
      if (messageCommand.name) {
        client.messageCommands.set(messageCommand.name, messageCommand);
      }
      else {
        continue;
      }

      if (messageCommand.aliases) {
        messageCommand.aliases.forEach(alias => {
          client.aliases.set(alias, messageCommand);
        });
      }
    }
  };
  ['music', 'admin'].forEach(e => loadDir(e));
};