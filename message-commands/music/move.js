const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'move',
  aliases: ["shift", "change", "m"],
  description: 'Moves the target song to the source index',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      if (args.length === 2 && args[0] < guildQueue.tracks.length && args[1] < guildQueue.tracks.length) {
        const source = guildQueue.tracks[args[0] - 1];

        guildQueue.remove(parseInt(args[0] - 1));
        guildQueue.insert(source, parseInt(args[1] - 1));

        const commandEmbed = new MessageEmbed().setColor('#0099ff').setDescription(`Moved ${source.title} to position \`${args[1]}\``);
        await message.channel.send({ embeds: [commandEmbed] });
      }
    }

  },
};