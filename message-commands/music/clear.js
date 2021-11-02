module.exports = {
  name: 'clear',
  aliases: ["c"],
  description: 'Clears the queue',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      message.react('‍👌');
      guildQueue.clear();
      guildQueue.stop(); // Stopping since clear does not remove the current song
    }

  },
};