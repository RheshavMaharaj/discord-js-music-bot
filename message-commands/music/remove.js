const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'remove',
  aliases: ["rm"],
  description: 'Removes the song from a given index in the queue',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (guildQueue.tracks.length >= args[0]) {
        const song = guildQueue.remove(parseInt(args[0] - 1));
        const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Removed: ${song.title} from queue`);
        await message.channel.send({ embeds: [commandEmbed] });
      }
    }

  },
};