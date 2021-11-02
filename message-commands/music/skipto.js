const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'skipto',
  aliases: ["jumpto", "st"],
  description: 'Jumps to particular track, removing other tracks on the way',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (guildQueue.tracks.length >= args[0] - 1) {
        guildQueue.skipTo(parseInt(args[0] - 1));
        const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Jumped to postion: \`${args[0]}\``);
        await message.channel.send({ embeds: [commandEmbed] });
      }
    }
  },
};