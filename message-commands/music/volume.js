const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'volume',
  aliases: ["vol", "v"],
  description: 'Change the volume of the player by passing a value or view the current volume',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && isNaN(args[0]) && message.member.voice.channelId === message.guild.me.voice.channelId) {
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Current volume: **${guildQueue.volume}**%`);
      await message.channel.send({ embeds: [commandEmbed] });
    }
    else if (guildQueue && !isNaN(args[0]) && message.member.voice.channelId === message.guild.me.voice.channelId) {
      guildQueue.setVolume(parseInt(args[0]));
      const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Set volume to: **${guildQueue.volume}**%`);
      await message.channel.send({ embeds: [commandEmbed] });
    }
  },
};