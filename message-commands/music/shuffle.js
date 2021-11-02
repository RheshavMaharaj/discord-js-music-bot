module.exports = {
  name: 'shuffle',
  aliases: ["asdf"],
  description: 'Shuffles the queue',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      message.react('‍👌');
      guildQueue.shuffle();
    }

  },
};