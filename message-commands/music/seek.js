module.exports = {
  name: 'seek',
  aliases: ["sk"],
  description: 'Seeks to a position in the song in seconds',
  async execute(_client, player, message, args) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      message.react('‍👌');
      guildQueue.seek(parseInt(args[0]) * 1000);
    }

  },
};