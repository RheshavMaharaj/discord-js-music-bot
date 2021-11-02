const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'jump',
  aliases: ["j"],
  description: 'Brings the indexed song to next in queue and skips to it',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (guildQueue.tracks.length >= args[0] - 1) {
        const source = guildQueue.tracks[args[0] - 1];

        guildQueue.remove(parseInt(args[0] - 1));
        guildQueue.insert(source, 0);
        guildQueue.skip();

        const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Jumped to postion: \`${args[0]}\``);
        await message.channel.send({ embeds: [commandEmbed] });
      }
    }

  },
};