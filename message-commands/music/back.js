module.exports = {
  name: 'back',
  aliases: ["prev"],
  description: 'Goes back one position in the queue',
  async execute(_client, player, message) {

    const guildQueue = player.getQueue(message.guild.id);

    if (guildQueue && message.member.voice.channelId === message.guild.me.voice.channelId) {
      guildQueue.back();
      message.react('👌');
    }
    else {
      message.react('❌');
    }

  },
};