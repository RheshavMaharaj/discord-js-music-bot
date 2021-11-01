const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'help',
  aliases: ["h"],
  description: 'Help command for users',
  async execute(client, _player, message, args) {
    const messageCommands = [...new Set(client.messageCommands.map((cmd => cmd.name)))];
    const masterCommands = [];
    const commandFind = [];

    const format = (arr) => {
      let string = "";
      for (const command of arr) {
        string += "`" + command + "` ";
      }
      return string;
    };

    const cmdCheck = (argument) => {
      [messageCommands].forEach(e => {
        e.forEach(name => masterCommands.push(name));
      });
      return masterCommands.includes(argument);
    };

    const getCmd = (argument) => {
      [client.messageCommands].forEach(e => {
        e.forEach(command => commandFind.push(command));
      });
      return commandFind.find(element => element.name === argument);
    };

    if (args.length === 0) {
      const helpEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bot Commands')
        .setAuthor(client.user.username, `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`)
        .setThumbnail(message.author.displayAvatarURL({ size: 4096, dynamic:true }))
        .setDescription(`Here is a list of all the current available commands. Refine search with **${prefix}help** \`<command name>\``)
        .addFields(
          { name: "Commands 🎵", value: format(messageCommands), inline: false },
        )
        .setFooter("Music Bot")
        .setTimestamp();

      await message.channel.send({ embeds: [helpEmbed] });
    }
    else if (args.length === 1) {
      if (cmdCheck(args[0])) {
        const helpEmbed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(getCmd(args[0]).name)
          .setDescription(`\`${getCmd(args[0]).description}\``)
          .setTimestamp();
        await message.channel.send({ embeds: [helpEmbed] });
      }
    }
  },
};