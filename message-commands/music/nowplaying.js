const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'nowplaying',
  aliases: ["np", "now", "playing"],
  description: 'Displays the current playing song',
  async execute(client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue) {
      if (guildQueue.playing) {
        const ProgressBar = guildQueue.createProgressBar({
          timecodes: true,
          queue: true,
          length: 20,
        });
        const commandEmbed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Now Playing')
          .setThumbnail(guildQueue.nowPlaying().thumbnail)
          .setDescription(`Current Song: **${guildQueue.nowPlaying()}**`)
          .addFields(
            { name: 'Progress', value: '```' + ProgressBar + '```' },
          )
          .setTimestamp()
          .setFooter('Sweeper Bot', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`);
        await message.channel.send({ embeds: [commandEmbed] });
      }
    }
  },
};